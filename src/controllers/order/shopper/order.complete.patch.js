const config = require('config');
const router = require('express').Router();
const errors = require('../../../errors');
const {Order, InventoryItem, Packaging, User} = require('../../../schemas');
const mongoose = require('mongoose');
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const http = require('http');
const axios = require('axios');
const https = require('https');
const authenticate = require('../../../middleware/authenticate');
const userRights = require('../../../enums/user-roles');
const emailHelper = require('../../../helpers/email-helper');

/**
 *  @swagger
 *  /api/order/complete:
 *    patch:
 *      tags:
 *        - order
 *      description: Marks an order as completed
 *      parameters:
 *        - name: order_id
 *          default: 5b713aba7b86745de3170305
 *          description: product ID
 *          in: path
 *          type: string
 *          required: true
 *        - name: delivered
 *          description: product ID
 *          in: path
 *          type: bool
 *          required: true
 *        - name: packaging
 *          description: list of packaging returned. only included if quantity returned more than 0. [{ type, quantity }]
 *          in: path
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              type:
 *                type: string
 *              quantity:
 *                type: string
 *          required: true
 *      responses:
 *        200:
 *          description: order schema
 */


router.patch('/api/order/complete',
    // TODO remove after implement ADMIN account
    //authenticate([userRights.ADMIN]),
    errors.wrap(async (req, res) => {
        // const delivered = req.body.delivered;
        // const packaging = req.body.packaging;
        // const orderId = req.body.order_id;
        // const time = req.query.time;

        const delivered = true;
        const packaging = [ { type: "Mesh Bag", quantity: 4 }, { type: "Tote Bag", quantity: 2 } ];
        const orderId = "5b9ff0961c69ca000403d839";
        const time = "2018-09-26%2018:45:00";

        const packagingReturnInfo = [];
        for (var i = packaging.length - 1; i >= 0; i--) {
            var p = packaging[i];
            var pObj = await Packaging.findOne({ type: p.type });
            packagingReturnInfo.push({type: pObj.type, quantity: p.quantity, deposit_credited: pObj.deposit_amount * p.quantity});
        };

        if (!mongoose.Types.ObjectId.isValid(orderId)) throw errors.InvalidInputError('Invalid format of order ID');
        const order = await Order.findById(orderId);
        if (!order) throw errors.NotFoundError('Order not found!');

        const user = await User.findById(order.user_id);
        if (!user) throw errors.NotFoundError('User not found');

        var mainData = order.toObject();

        mainData.cart_items.forEach( async (item) => {
          var inventory = await InventoryItem.findById(item.inventory_id);
          if (!inventory) throw errors.NotFoundError('Producer not found');

          item.producer = inventory.producer;
          item.price_unit = inventory.price_unit;
          }
        );

        mainData.packaging = packagingReturnInfo;
        mainData.total_credited_amount = 0;
        mainData.delivery_time = time;

        for (i = 0; i < packagingReturnInfo.length; i ++) {
            mainData.total_credited_amount += packagingReturnInfo[i].deposit_credited;
        }
        user.store_credit += mainData.total_credited_amount;
        await user.save();

        if (delivered) {
            order.status = "delivered";
            await order.save();

            // paymentSuccess = await completeOrderPayment(order);
            paymentSuccess = true;

            if (paymentSuccess) {
                await emailHelper.send({
                    templateFile: 'order-completed.pug',
                    // recipient: user.email,
                    recipient: "wisdom20101205@gmail.com",
                    preheader : "We hope you enjoyed your Wally Shop order",
                    subject: `Your Wally Shop Order Receipt`,
                    data: mainData
                });
            }

        } else {
            // order.status = "delivery_issue";
            // await order.save();
            // await emailHelper.send({
            //     templateFile: 'delivery_failed.pug',
            //     recipient: user.email,
            //     subject: `Delivery failed`
            // });
        }


        res.json(order);
    })
);

const completeOrderPayment = async (order) => {
    try {
        var order_amount = order.total / 100;
        console.log("Capturing charge");
        await stripe.Charges.capture({
            charge: order.auth_charge_id,
            amount: order_amount
        });
        order.status = 'paid';
        paymentSuccess = true;
    } catch (e) {
        // await emailHelper.send({
        //     templateFile: 'failed-order.pug',
        //     recipient: user.email,
        //     subject: `Order[${orderId}] failed`,
        //     name: user.name,
        //     data: {
        //         message: e.message,
        //         orderId
        //     }
        // });
        order.status = 'payment_issue';
        paymentSuccess = false;
        throw errors.InternalServerError(e.message);
    } finally {
        await order.save();
        return paymentSuccess
    }
}

module.exports = router;
