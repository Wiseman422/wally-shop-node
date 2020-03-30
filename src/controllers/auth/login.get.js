const router = require('express').Router();
const errors = require('../../errors');
const authenticate = require('../../middleware/authenticate');
/**
 *  @swagger
 *  /api/login/status:
 *    get:
 *      tags:
 *        - user
 *      description: check token validity
 *      responses:
 *        200:
 *          description: user data
 */

router.get('/api/login/status',
    authenticate(),
    errors.wrap(async (req, res) => {
       res.json({status: true});
    })
);

module.exports = router;
