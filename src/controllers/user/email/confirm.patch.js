const router = require('express').Router();
const errors = require('../../../errors');
const {User, Token} = require('../../../schemas');

/**
 * @swagger
 * /email/confirm/{token}:
 *   patch:
 *     tags:
 *       - user.email
 *     description: Check if token valid and exists and confirm email
 *     parameters:
 *        - name: token
 *          in: path
 *          type: string
 *          required: true
 *     responses:
 *       200:
 *         description: email confirmed
 */

router.patch('/email/confirm/:token',
    errors.wrap(async function (req, res) {
        const tokenId = req.params.token_id;
        if (!mongoose.Types.ObjectId.isValid(tokenId)) throw errors.InvalidInputError('Invalid token format');

        const token = await Token.findOne({
            _id: tokenId,
            type: 'password-reset',
            expires_in: {
                $gt: Date.now()
            },
        });
        if (!token) throw errors.NotFoundError('Confirmation token is invalid or has expired.');

        const user = await User.findById(token.user_id);
        if (!user) throw errors.NotFoundError('User not found');

        user.validated_email = true;
        await user.save();
        await token.remove();

        res.json({success_message: 'Your email successfully confirmed'});
    })
);

module.exports = router;
