const router = require('express').Router();
const errors = require('../../../errors');
const {PromoCode} = require('../../../schemas');
const arrangeInput = require('../../../middleware/arrange-inputs');

/**
 *  @swagger
 *  /api/category:
 *    post:
 *      tags:
 *        - category
 *      description: create category, Admin API
 *      parameters:
 *        - name: type
 *          description: promo code type
 *          in: formData
 *          type: string
 *          required: true
 *        - name: referrer_id
 *          description: ID of referrer
 *          in: formData
 *          type: string
 *          required: false
 *        - name: promo_code
 *          description: promo code name
 *          in: formData
 *          type: string
 *          required: true
 *        - name: benefit
 *          description: promo code benefit
 *          in: formData
 *          type: String
 *      responses:
 *        200:
 *          description: promo code
 */

router.post('/api/admin/promo',
    // TODO uncomment to activate admin-only access
    //authenticate([userRights.ADMIN]),
    arrangeInput('body', {
        type: {
            type: 'STRING',
        },
        referrer_id: {
            type: 'STRING',
        },
        promo_code: {
            type: 'STRING',
        },
        benefit: {
            type: 'STRING',
        },
    }),
    errors.wrap(async (req, res) => {
        const promo = await PromoCode.create(req.body);
        res.json(promo);
    })
);

module.exports = router;

