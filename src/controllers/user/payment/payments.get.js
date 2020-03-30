const router = require('express').Router();
const errors = require('../../../errors');
const authenticate = require('../../../middleware/authenticate');

/**
 *  @swagger
 *  /api/user/payments:
 *    get:
 *      tags:
 *        - user/payment
 *      description: get payment methods list
 *      responses:
 *        200:
 *          description: array of user payment methods
 */

router.get('/api/user/payments',
    authenticate(),
    errors.wrap(async (req, res) => {
        const user = res.locals.user;
        res.json(user.payment);
    })
);

module.exports = router;
