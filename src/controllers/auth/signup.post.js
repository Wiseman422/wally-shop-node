const router = require('express').Router();
const config = require('config');
const errors = require('../../errors');
const arrangeInput = require('../../middleware/arrange-inputs');
const {User, Token} = require('../../schemas');
const PromoCode = require('../../schemas/promocode');
const Referral = require('../../schemas/referral');
const emailHelper = require('../../helpers/email-helper');
const zipCodes = require('../../enums/zip-codes');

/**
 *  @swagger
 *  /api/signup:
 *    post:
 *      tags:
 *        - auth
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
 *        - name: name
 *          default: userName
 *          in: formData
 *          type: string
 *        - name: signup_zip
 *          default: "10016"
 *          in: formData
 *          type: string
 *        - name: telephone
 *          default: "123132123"
 *          in: formData
 *          type: string
 *        - name: reference_promo
 *          default: abcdefg12345
 *          in: formData
 *          type: string
 *      description: create user
 *      responses:
 *        200:
 *          description: user created successfully
 */

router.post('/api/signup',
    arrangeInput('body', {
        email: {
            type: 'STRING',
            required: true,
            pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/,
        },
        password: {
            type: 'STRING',
            required: true,
            pattern: /\w{5,}/,
        },
        signup_zip: {
            type: 'STRING',
            required: true,
            pattern: /^\d{5}(?:[-\s]\d{4})?$/
        },
        name: {
            type: 'STRING',
        },
        reference_promo: {
            type: 'STRING',
        },

    }),
    errors.wrap(async (req, res) => {
        req.body.email = req.body.email.toLowerCase();
        const existingUser = await User.findOne({email: req.body.email});
        if (existingUser) throw errors.InvalidInputError('User with same email already exists');
        if (!zipCodes.includes(req.body.signup_zip)) throw errors.InvalidInputError('Invalid zip-code');

        let user = new User(req.body);
        const promo = new PromoCode({referrer_id: user._id, type: "referral"});


        const referencePromoCode = req.body.reference_promo;
        if (referencePromoCode) {
            const referrerPromo = await PromoCode.findOne({promo_code: referencePromoCode});
            if (referrerPromo) {
                const referral = new Referral({
                    promo_code: referrerPromo.promo_code,
                    referrer_id: referrerPromo.referrer_id
                });
                await referral.save();
            }
        }

        // const conformationToken = await Token.create({
        //     user_id: user._id,
        //     expires_in: Date.now() + 3600000 * 24, // 24hours
        //     type: 'email-confirm',
        // });

        // await emailHelper.send({
        //     templateFile: 'confirm-email.pug',
        //     recipient: user.email,
        //     subject: 'Email confirmation',
        //     name: user.name,
        //     data: {
        //         link: `${config.app.appURL}/email/confirm?token=${conformationToken._id}`,
        //     }
        // });


        await user.save();
        await promo.save();

        const token = user.generateToken();
        user = user.toObject();
        delete user._id;
        delete user.password;
        res.json({token, user});
    })
);

module.exports = router;
