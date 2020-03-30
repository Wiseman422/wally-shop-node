const router = require('express').Router();
const errors = require('../../errors');
const {User, Token} = require('../../schemas');
const authenticate = require('../../middleware/authenticate');
const arrangeInput = require('../../middleware/arrange-inputs');
/**
 *  @swagger
 *  /api/user:
 *    patch:
 *      tags:
 *        - user
 *      parameters:
 *        - name: name
 *          default: John Doe
 *          in: formData
 *          type: string
 *        - name: telephone
 *          default: "123123123"
 *          in: formData
 *          type: string
 *        - name: email
 *          default: email@example.com
 *          in: formData
 *          type: string
 *      description: create user
 *      responses:
 *        200:
 *          description: user updated
 */


router.patch('/api/user',
    authenticate(),
    arrangeInput('body', {
        email: {
            type: 'STRING',
            pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/,
        },
        name: {
            type: 'STRING',
        },
        telephone: {
            type: 'STRING',
        },

    }),
    errors.wrap(async (req, res) => {
        const user = res.locals.user;
        const {email, name, telephone} = req.body;
        if (email && email !== user.email) {
            const existingUser = await User.findOne({email});
            if (existingUser) throw errors.InvalidInputError('Email is not available');
        }

        if (req.body.email !== user.email) {
            user.validated_email = false;
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
                link: `${config.appURL}/email/confirm?token=${conformationToken._id}`,
            });

        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.primary_telephone = telephone || user.primary_telephone;
        user.save();
        res.json(user);
    })
);

module.exports = router;
