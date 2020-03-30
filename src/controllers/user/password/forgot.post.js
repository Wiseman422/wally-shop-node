const router = require('express').Router();
const config = require('config').app;
const errors = require('../../../errors');
const {User, Token} = require('../../../schemas');
const arrangeInput = require('../../../middleware/arrange-inputs');
const emailHelper = require('../../../helpers/email-helper');

/**
 *  @swagger
 *  /api/user/reset-password:
 *    post:
 *      tags:
 *        - user/password
 *      description: send user email with confirmation link
 *      parameters:
 *        - name: email
 *          default: email@example.com
 *          required: true
 *          in: formData
 *          type: string
 *      responses:
 *        200:
 *          description: password reset link sent
 */


router.post('/api/user/reset-password',
    arrangeInput('body', {
        email: {
            type: 'STRING',
            required: true,
        },
    }),
    errors.wrap(async (req, res) => {
        const user = await User.findOne({email: req.body.email});
        if (!user) throw errors.NotFoundError('User with such email not found.');

        await Token.findOne({user_id: user._id, type: 'password-reset'}).remove();

        const token = await Token.create({
            user_id: user._id,
            expires_in: Date.now() + 3600000 * 24, // 24hours
            type: 'password-reset',
        });

        await emailHelper.send({
            templateFile: 'reset-password.pug',
            recipient: user.email,
            subject: 'The Wally Shop: Forgot Password?',
            preheader : "Forgot your Wally Shop password?",
            name: user.name,
            data: {link: `${config.appURL}/api/user/reset-password?token_id=${token._id}`}
        });

        res.json({success_message: 'Check your email!'});
    })
);

module.exports = router;
