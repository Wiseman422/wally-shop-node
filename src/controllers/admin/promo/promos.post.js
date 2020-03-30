const router = require('express').Router();
const errors = require('../../../errors');
const {PromoCode} = require('../../../schemas');
const userRights = require('../../../enums/user-roles');
const authenticate = require('../../../middleware/authenticate');
const arrangeInput = require('../../../middleware/arrange-inputs');

/**
 *  @swagger
 *  /api/admin/promos:
 *    post:
 *      tags:
 *        - promo
 *      description: create promocodes, Admin API
 *      parameters:
 *      responses:
 *        200:
 *          description: user data
 */

router.post('/api/admin/promos',
    // TODO uncomment to activate admin-only access
    //authenticate([userRights.ADMIN]),
    errors.wrap(async (req, res) => {
        promoIds = [];
        promos = [];
        for (var i = 20; i >= 1; i--) {
            var promo = {type: "general", benefit: "$50.00 of store credit", promo_code: `Alpha${i}` }
            console.log(promo);
            const promoCode = await PromoCode.create(promo);
            promos.push(promoCode);
            promoIds.push(promoCode.id);
        };
        console.log(promoIds);
        res.json(promos);
    })
);

module.exports = router;

