const passport = require('passport')
const router = require('express').Router();
const errors = require('../../errors');
const {User} = require('../../schemas');
const zipCodes = require('../../enums/zip-codes');
/**
 *  @swagger
 *  /api/login/facebook:
 *    post:
 *      tags:
 *        - auth
 *      description: login user in system by facebook token
 *      parameters:
 *        - name: access_token
 *          default: facebook-token-from-application
 *          required: true
 *          in: formData
 *          type: string
 *        - name: signup_zip
 *          default: user zip-code
 *          in: formData
 *          type: string
 *      responses:
 *        200:
 *          description: return saved report object
 */

router.post('/api/login/facebook',
    passport.initialize(),
    passport.authenticate('facebook-token', {session: false}),
    errors.wrap(async (req, res) => {
            console.log('req.user:', req.user);
            const facebookData = req.user;
            let user = await User.findOne({email: facebookData.email});
            if (!user) {
                console.log("Creating user");
                user = new User({
                    facebook_id: facebookData.id,
                    email: facebookData.email,
                    validated_email: true,
                    name: facebookData.name,
                });
                const zip = req.body.signup_zip;
                if (!zipCodes.includes(zip)) throw errors.InvalidInputError('Invalid zip-code');
                user.signup_zip = zip;

                await user.save();
            }

            const token = user.generateToken();
            res.json({token, user});
        }
    )
);

module.exports = router;
