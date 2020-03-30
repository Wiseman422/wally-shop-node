const router = require('express').Router();
const errors = require('../../errors');
const authenticate = require('../../middleware/authenticate');
/**
 *  @swagger
 *  /api/user:
 *    get:
 *      tags:
 *        - user
 *      description: get user data
 *      responses:
 *        200:
 *          description: user data
 */

router.get('/api/user',
    authenticate(),
    errors.wrap(async (req, res) => {
        const user = res.locals.user.toObject();
        delete user.password;
        res.json(user);
    })
);

module.exports = router;
