const mongoose = require('mongoose');
const router = require('express').Router();
const errors = require('../../../errors');
const config = require('config').app;
const {User, Token} = require('../../../schemas');
const arrangeInput = require('../../../middleware/arrange-inputs');

/**
 *  @swagger
 *  /api/user/reset-password/{token_id}:
 *    patch:
 *      tags:
 *        - user/password
 *      description: get user data
 *      parameters:
 *        - name: token_id
 *          in: path
 *          type: string
 *          required: true
 *          default: 5b71680b3cba981564edd10a
 *        - name: new_password
 *          in: formData
 *          type: string
 *          required: true
 *          default: password1234
 *        - name: confirm_password
 *          in: formData
 *          type: string
 *          required: true
 *          default: password1234
 *      responses:
 *        200:
 *          description: password successfully updated
 */

router.patch('/api/user/reset-password/:token_id',
    arrangeInput('body', {
        new_password: {
            type: 'STRING',
            pattern: config.passwordPattern,
            required: true,
        },
        confirm_password: {
            type: 'STRING',
            pattern: config.passwordPattern,
            required: true,
        },
    }),
    errors.wrap(async function (req, res) {
        const body = req.body;
        const tokenId = req.params.token_id;
        if (!mongoose.Types.ObjectId.isValid(tokenId)) throw errors.InvalidInputError('Invalid token format');

        const token = await Token.findOne({
            _id: tokenId,
            type: 'password-reset',
            expires_in: {
                $gt: Date.now()
            },
        });

        if (!token) throw errors.NotFoundError('Password reset token is invalid or has expired.');
        if (!(body.new_password === body.confirm_password)) throw errors.InvalidInputError('Passwords doesn\'t mach');
        const user = await User
            .findById(token.user_id)
            .select('password');

        if (!user) throw errors.NotFoundError('User not found');
        const hashedPassword = User.hashPassword(body.new_password);
        if (user.password === hashedPassword) throw errors.InvalidInputError('Old password and new password match!');
        user.password = body.new_password;

        await user.save();
        await token.remove();

        res.json({success_message: 'Your password has been successfully updated'});
    })
);

module.exports = router;
