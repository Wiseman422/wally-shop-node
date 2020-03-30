const router = require('express').Router();
const config = require('config').app;
const errors = require('../../../errors');
const {User, Token} = require('../../../schemas');

/**
 * @swagger
 * /email/confirm/send:
 *   post:
 *     tags:
 *       - user.email
 *     description: Sends confirmation email again with current existing token or new
 *     parameters:
 *        - name: email
 *          in: formData
 *          type: string
 *          required: true
 *     responses:
 *       200:
 *         description: email sent
 */

router.post('/email/confirm/send',
    errors.wrap(async function (req, res) {
        const user = await User.findOne({email: req.body.email});
        if (!user) throw errors.NotFoundError('User with such email not found.');
        if (user.isEmailConfirmed) throw errors.NotFoundError('Email already confirmed.');

        await Token.findOne({user_id: user._id, type: 'email-confirm'}).remove();

        const conformationToken = await Token.create({
            user_id: user._id,
            expires_in: Date.now() + 3600000 * 24, // 24hours
            type: 'email-confirm',
        });

        await emailHelper.send({
            templateFile: 'confirm-email.pug',
            recipient: user.email,
            subject: 'Email confirmation',
            name: user.name,
            data: {
                link: `${config.appURL}/email/confirm?token=${conformationToken._id}`,
            },
        });

        res.sendStatus(204);
    })
);

module.exports = router;
