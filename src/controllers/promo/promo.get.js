const router = require('express').Router();
const errors = require('../../errors');
const {PromoCode, Referral} = require('../../schemas');
const authenticate = require('../../middleware/authenticate');
const arrangeInput = require('../../middleware/arrange-inputs');
/**
 *  @swagger
 *  /api/promo/check?{promo_code}&{subtotal}:
 *    get:
 *      tags:
 *        - promo-code
 *      description: check the promo-code
 *      parameters:
 *        - name: promo_code
 *          default: SDFSDF
 *          description: code from promocode schema
 *          in: path
 *          type: string
 *          required: true
 *        - name: subtotal
 *          description: local user time in UTC
 *          in: path
 *          type: integer
 *          required: true
 *          default: 10000
 *      responses:
 *        200:
 *          description: user data
 */

router.get('/api/promo/check',
    authenticate(),
    arrangeInput('query', {
        promo_code: {
            type: 'STRING',
            required: true
        },
        subtotal: {
            type: 'STRING',
            required: true
        },
    }),
    errors.wrap(async (req, res) => {
        const user = res.locals.user;
        const promoCode = await PromoCode.findOne({promo_code: req.query.promo_code});
        if (!promoCode) throw errors.InvalidInputError('Invalid Promo-code');

        referral = await Referral.findOne({promo_code: req.query.promo_code, beneficiary_id: user.id});
        if (referral) throw errors.InvalidInputError('User has already submitted promo code');

        if (req.query.promo_code.substring(0,5) == "Alpha") {
            referral = new Referral({
                promo_code: req.query.promo_code,
                beneficiary_id: user.id,
                benefit: promoCode.benefit
            });
            await referral.save();

            user.store_credit = user.store_credit + 5000;
            await user.save();
        }

        // TODO implement discount calculations
        res.json({valid: true, discount: 0});
    })
);

module.exports = router;
