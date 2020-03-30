const router = require('express').Router();
const errors = require('../../../errors');
const authenticate = require('../../../middleware/authenticate');

/**
 *  @swagger
 *  /api/user/addresses:
 *    get:
 *      tags:
 *        - user/address
 *      description: get addresses list
 *      responses:
 *        200:
 *          description: array of user addresses
 */

router.get('/api/user/addresses',
    authenticate(),
    errors.wrap(async (req, res) => {
        const user = res.locals.user;
        res.json(user.addresses);
    })
);

module.exports = router;
