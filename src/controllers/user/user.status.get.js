const router = require('express').Router();
const errors = require('../../errors');

/**
 *  @swagger
 *  /api/user/status:
 *    get:
 *      tags:
 *        - user.status
 *      description: get user data
 *      responses:
 *        200:
 *          description: user data
 */

router.get('/api/user/status',
    errors.wrap(async (req, res) => {
        res.json({});
    })
);

module.exports = router;
