const router = require('express').Router();
const errors = require('../../../errors');

/**
 *  @swagger
 *  /api/user/subscription:
 *    post:
 *      tags:
 *        - user/subscription
 *      description: get user data
 *      responses:
 *        200:
 *          description: user data
 */

router.post('/api/user/subscription',
    errors.wrap(async (req, res) => {
        res.json({});
    })
);

module.exports = router;
