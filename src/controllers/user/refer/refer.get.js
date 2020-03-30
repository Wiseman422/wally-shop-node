const router = require('express').Router();
const errors = require('../../../errors');
const config = require('config').app;
const authenticate = require('../../../middleware/authenticate');
const {PromoCode} = require('../../../schemas');
/**
 *  @swagger
 *  /api/user/refer:
 *    get:
 *      tags:
 *        - user/refer
 *      description: get refer URL
 *      responses:
 *        200:
 *          description: user data
 */

router.get('/api/user/refer',
    authenticate(),
    errors.wrap(async (req, res) => {
        const user = res.locals.user;
        const promo = await PromoCode.findOne({referrer_id: user._id});
        if (!promo) throw errors.NotFoundError('Promo code not found');
        const link = `${config.appURL}/?ref=${promo.promo_code}`;
        res.json({ref_url: link});
    })
);

module.exports = router;
