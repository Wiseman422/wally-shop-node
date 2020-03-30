const router = require('express').Router();
const errors = require('../../../errors');
const arrangeInput = require('../../../middleware/arrange-inputs');
const authenticate = require('../../../middleware/authenticate');

/**
 *  @swagger
 *  /api/user/payment:
 *    patch:
 *      tags:
 *        - user/payment
 *      description: set preferred payment method
 *      parameters:
 *        - name: payment_id
 *          in: formData
 *          type: string
 *          required: true
 *          description: Id of payment method
 *      responses:
 *        200:
 *          description: new payment set as default
 */

router.patch('/api/user/payment',
    authenticate(),
    arrangeInput('body', {
        payment_id: {
            type: 'STRING',
            required: true,
        },
    }),
    errors.wrap(async (req, res) => {
        const user = res.locals.user;
        const payment = await user.payment.id(req.body.payment_id);
        if (!payment) throw errors.NotFoundError('Payment with this ID is not found');
        user.preferred_payment = payment._id;

        await stripe.customers.update(user.stripe_customer_id, {
            default_source: payment.card_id,
        });

        await user.save();
        res.json(user);
    })
);

module.exports = router;
