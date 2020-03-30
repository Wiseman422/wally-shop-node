const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET);

const errors = require('../../../errors');
const authenticate = require('../../../middleware/authenticate');

/**
 *  @swagger
 *  /api/user/payment/{payment_id}:
 *    delete:
 *      tags:
 *        - user/payment
 *      description: Removes an payment method from the user’s list of payment methods.
 *      parameters:
 *        - name: payment_id
 *          description: user payment method ID
 *          in: path
 *          type: string
 *          required: true
 *      responses:
 *        200:
 *          description: user data
 */

router.delete('/api/user/payment/:payment_id',
    authenticate(),
    errors.wrap(async (req, res) => {
        const user = res.locals.user;
        const paymentId = req.params.payment_id;
        const payment = await user.payment.id(paymentId);
        if (!payment) throw errors.NotFoundError('Payment method with this ID is not found');
        await user.payment.id(paymentId).remove();
        user.preferred_payment = user.payment.length > 0
            ? user.payment[0]._id
            : '';

        try {
            await stripe.customers.deleteCard(user.stripe_customer_id, payment.card_id);
        } catch (e) {
            throw errors.InternalServerError(e.message);
        }

        await user.save();
        res.json(user); // there is better to send just 204 (Not Found) status
    })
);

module.exports = router;
