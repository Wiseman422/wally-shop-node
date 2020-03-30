const router = require('express').Router();
const errors = require('../../../errors');
const {Order} = require('../../../schemas');
const mongoose = require('mongoose');
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const authenticate = require('../../../middleware/authenticate');
const userRights = require('../../../enums/user-roles');

/**
 *  @swagger
 *  /api/order/{order_id}/pay:
 *    post:
 *      tags:
 *        - order
 *      description: Submits an order
 *      parameters:
 *        - name: order_id
 *          default: 5b713aba7b86745de3170305
 *          description: product ID
 *          in: path
 *          type: string
 *      responses:
 *        200:
 *          description: packaged order data
 */

router.post('/api/order/:order_id/pay',
    // TODO remove after implement ADMIN account
    //authenticate([userRights.ADMIN]),
    errors.wrap(async (req, res) => {
        const orderId = req.params.order_id;
        if (!mongoose.Types.ObjectId.isValid(orderId)) throw errors.InvalidInputError('Invalid format of order ID');
        const order = await Order.findById(orderId);
        if (!order) throw errors.NotFoundError('Order not found!');

        let paymentSuccess = false;
        try {
            await stripe.Charges.capture(order.auth_charge_id);
            order.status = 'paid';
            paymentSuccess = true;
        } catch (e) {
            await emailHelper.send({
                templateFile: 'failed-order.pug',
                recipient: user.email,
                subject: `Order[${orderId}] failed`,
                name: user.name,
                data: {
                    message: e.message,
                    orderId
                }
            });
            order.status = 'payment_issue';
            paymentSuccess = false;
            throw errors.InternalServerError(e.message);
        } finally {
            await order.save();
        }

        res.json({payment_success: paymentSuccess});
    })
);

module.exports = router;
