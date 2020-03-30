'use strict';

const router = require('express').Router();
const errors = require('../../../errors');
const {Order, User, Packaging} = require('../../../schemas');
const mongoose = require('mongoose');
const emailHelper = require('../../../helpers/email-helper');
const authenticate = require('../../../middleware/authenticate');

/**
 *  @swagger
 *  /api/order/{order_id}/package:
 *    post:
 *      tags:
 *        - order
 *      description: Packages an order
 *      parameters:
 *        - name: order_id
 *          default: 5b713aba7b86745de3170305
 *          description: product ID
 *          in: path
 *          type: string
 *        - name: products
 *          in: body
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              product_id:
 *                type: string
 *              product_name:
 *                type: string
 *              product_price:
 *                type: integer
 *              quantity:
 *                type: integer
 *        - name: packaging
 *          in: body
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              type:
 *                type: string
 *              quantity:
 *                type: string
 *      responses:
 *        200:
 *          description: packaged order data
 */

router.patch('/api/order/:order_id/package',
    // TODO remove after implement ADMIN account
    // authenticate(['ADMIN']),
    errors.wrap(async (req, res) => {
        const orderId = req.params.order_id;
        if (!mongoose.Types.ObjectId.isValid(orderId)) throw errors.InvalidInputError('Invalid format of order ID');
        const order = await Order.findById(orderId);
        if (!order) throw errors.NotFoundError('Order not found!');
        const user = await User.findById(order.user_id);
        if (!user) throw errors.NotFoundError('User not found!');

        // get items from body, merge price and quantity to current cart items;
        const finalProducts = req.body.products;
        order.cart_items = order.cart_items
            .map(item => {
                const finalProduct = finalProducts.find(el => el.product_id === item.product_id);
                if (finalProduct) {
                    item.product_name = finalProduct.product_name;
                    item.product_price = finalProduct.product_price;
                    item.customer_quantity = finalProduct.quantity;
                    item.final_quantity = finalProduct.quantity;
                    item.total = finalProduct.product_price * finalProduct.quantity;
                } else {
                    item.final_quantity = 0;
                    item.customer_quantity = 0;
                    item.total = 0;
                }
                return item;
            });

        // IF CART FOR ORDER IS EMPTY
        // for (var i = finalProducts.length - 1; i >= 0; i--) {
        //     var p = finalProducts[i];
        //     order["cart_items"].push({
        //         product_id: p.product_id,
        //         product_name: p.product_name,
        //         product_price: p.product_price,
        //         customer_quantity: p.quantity,
        //         final_quantity: p.quantity,
        //         total: Math.round(p.product_price * p.quantity)
        //     });
        // };

        const packaging = req.body.packaging;
        order.packaging_deposit = 0;
        // calculate packaging deposit
        for (var i = packaging.length - 1; i >= 0; i--) {
            var p = packaging[i];
            var pObj = await Packaging.findOne({ type: p.type });
            order.packaging_deposit += p.quantity * pObj.deposit_amount;
        };

        order.subtotal = Math.round(order.cart_items.reduce((acc, item) => acc + (item.product_price * item.final_quantity), 0));
        order.service_amount = Math.round(0.12 * order.subtotal);

        // recalculate applied_store_credit
        if (order.applied_store_credit > 0) {
            order.applied_store_credit = Math.min((order.subtotal + order.tax_amount + order.packaging_deposit + order.delivery_amount + order.service_amount), user.store_credit);
            user.store_credit -= order.applied_store_credit;
            await user.save();
        }

        order.total = Math.round(order.subtotal
            + order.tax_amount
            + order.packaging_deposit
            + order.service_amount
            + order.delivery_amount
            - order.applied_store_credit
            - order.promo_discount);

        order.status = 'packaged';

        // await emailHelper.send({
        //     templateFile: 'order-packaged.pug',
        //     recipient: user.email,
        //     subject: 'Order packaged',
        //     name: user.name,
        //     data: {
        //         items: order.cart_items,
        //     }
        // });

        await order.save();
        res.json(order);
    })
);

module.exports = router;
