const router = require('express').Router();
const errors = require('../../errors');
const User = require('../../schemas/user');
/**
 *  @swagger
 *  /api/login:
 *    post:
 *      tags:
 *        - auth
 *      description: login user in system
 *      parameters:
 *        - name: email
 *          default: email@example.com
 *          required: true
 *          in: formData
 *          type: string
 *        - name: password
 *          default: password
 *          required: true
 *          in: formData
 *          type: string
 *      responses:
 *        200:
 *          description: return saved report object
 */

router.post('/api/login',
    errors.wrap(async (req, res) => {
        console.log('Logging in', req.body.email);
        let user = await User.authenticate(req.body.email, req.body.password);
        if (!user) throw errors.NotFoundError('User not found or invalid credentials.');
        const token = await user.generateToken();
        user = user.toObject();
        delete user.password;
        res.json({user, token});
    })
);

module.exports = router;
