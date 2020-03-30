const router = require('express').Router();
const errors = require('../../../errors');

/**
 *  @swagger
 *  /api/user/refer:
 *    post:
 *      tags:
 *        - user/refer
 *      description: activate refer URL
 *      responses:
 *        200:
 *          description: user data
 */

router.post('/api/user/refer',
    errors.wrap(async (req, res) => {
        res.json({});
    })
);

module.exports = router;
