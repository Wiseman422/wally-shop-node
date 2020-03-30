const router = require('express').Router();
const config = require('config');
const errors = require('../../errors');
const {Subscription} = require('../../schemas');

const SibApiV3Sdk = require('sib-api-v3-sdk');
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = config.SendInBlue.apiKey;

const arrangeInput = require('../../middleware/arrange-inputs');

/**
 *  @swagger
 *  /api/user/email:
 *    post:
 *      tags:
 *        - user.subscriptions
 *      description: subscribe user for the newsletter
 *      parameters:
 *        - name: email
 *          default: email@example.com
 *          required: true
 *          in: formData
 *          type: string
 *        - name: zip
 *          default: '14125'
 *          required: true
 *          in: formData
 *          type: string
 *      responses:
 *        200:
 *          description: subscription created
 */

router.post('/api/email/signup',
    arrangeInput('body', {
        email: {
            type: 'STRING',
            required: true,
            pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/,
        },
        zip: {
            type: 'STRING',
            required: true,
            pattern: /^\d{5}(?:[-\s]\d{4})?$/
        },
    }),
    errors.wrap(async (req, res) => {
        
        let subscription = Subscription.find({ email: req.body.email });
        if (subscription) throw errors.InvalidInputError('This email has already been signed up!');

        const apiInstance = new SibApiV3Sdk.ContactsApi();
        try {
            await apiInstance.createContact({email: req.body.email, attributes: {zip: req.body.zip}, listIds: [4]});
        } catch (e) {
            return res.json(e.message);
        }

        res.json({success_message: 'Keep an eye out for new announcements'});
    })
);

module.exports = router;
