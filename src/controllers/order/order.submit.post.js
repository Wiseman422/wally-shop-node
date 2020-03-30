const config = require('config');
const router = require('express').Router();
const errors = require('../../errors');
const {Order, Cart} = require('../../schemas');
const orderHelper = require('../../helpers/order.helper');
const zipCodes = require('../../enums/zip-codes');
const emailHelper = require('../../helpers/email-helper');
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const authenticate = require('../../middleware/authenticate');
const arrangeInput = require('../../middleware/arrange-inputs');

/**
 *  @swagger
 *  /api/order:
 *    post:
 *      tags:
 *        - order
 *      description: Submits an order
 *      parameters:
 *        - name: user_time
 *          description: local user time in UTC
 *          in: formData
 *          type: string
 *          required: true
 *          default: 2018-08-12 12:00:00
 *        - name: address_id
 *          default: 5b74aa5ab1240f12fddfe5ff
 *          description: delivery address
 *          required: true
 *          in: formData
 *          type: string
 *        - name: payment_id
 *          default: 5b74aa5ab1240f12fddfe5f1
 *          description: payment method
 *          required: true
 *          in: formData
 *          type: string
 *        - name: delivery_time
 *          default: 2018-09-05T18:00:00.000Z
 *          description: delivery address
 *          required: true
 *          in: formData
 *          type: string
 *        - name: store_credit
 *          default: false
 *          description: store_credit
 *          required: true
 *          in: formData
 *          type: boolean
 *        - name: promo
 *          default: ABCDEF
 *          description: delivery address
 *          in: formData
 *          type: string
 *        - name: 
 *      responses:
 *        200:
 *          description: submitted order data
 *        404:
 *          description: order not found
 */

router.post('/api/order',
    arrangeInput('body', {
        user_time: {
            type: 'STRING',
            required: true,
        },
        address_id: {
            type: 'STRING',
            required: true,
        },
        payment_id: {
            type: 'STRING',
            required: true,
        },
        delivery_time: {
            type: 'STRING',
            required: true,
        }
    }),
    authenticate(),
    errors.wrap(async (req, res) => {
        const user = res.locals.user;
        const orderForm = req.body;
        let summary = await orderHelper.summarizeOrder(user, orderForm.user_time);

        let address = user.addresses.id(orderForm.address_id);
        if (!address) throw errors.NotFoundError('Primary address not found');
        address = address.toObject();
        delete address._id;

        if (!zipCodes.includes(address.zip)) throw errors.InvalidInputError('Invalid zip-code');

        const payment = user.payment.id(orderForm.payment_id);
        if (!payment) throw errors.NotFoundError('Payment method not found');

        // TODO implement promo calculation

        summary = {...summary, ...address};
        summary.user_name = address.name;
        summary.status = 'submitted';
        summary.delivery_time = orderForm.delivery_time;
        summary.applicable_store_credit = orderForm.store_credit ? Math.min(summary.total, user.store_credit) : 0;

        summary.total = Math.round(summary.subtotal
            + summary.tax_amount
            + summary.packaging_deposit
            + summary.service_amount
            + summary.delivery_amount
            - summary.applied_store_credit
            - summary.promo_discount);

        const authorizationCharge = Math.round(1.2 * summary.total);
        const charge = await stripe.charges.create({
            amount: authorizationCharge,
            currency: 'usd',
            description: 'Authorization charge',
            customer: user.stripe_customer_id,
            source: payment.card_id,
            capture: false,
        });

        // // save charge ID to capture in order.pay
        summary.auth_charge_id = charge.id;

        const cart =  await Cart.findById(summary.cart_id);
        cart.status = 'ordered';
        await cart.save();

        const order = await Order.create(summary);
        await emailHelper.send({
            templateFile: 'submit-order.pug',
            recipient: user.email,
            subject: 'Your Wally Shop Order Confirmation',
            name: user.name,
            preheader : "Your Wally Shop order is on the way!",
            data: {
                items: order.cart_items,
                itemCnt: order.cart_items.length,
                deliveryTime: order.delivery_time,
                link: `${config.app.appURL}/orders`
            }
        });

        res.json(order);
    })
);

module.exports = router;
