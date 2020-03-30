const router = require('express').Router();
const errors = require('../../../errors');
const authenticate = require('../../../middleware/authenticate');
const arrangeInput = require('../../../middleware/arrange-inputs');
const postcode = require('postcode-validator');
const ObjectId = require('mongoose').Types.ObjectId;
const zipCodes = require('../../../enums/zip-codes');

/**
 *  @swagger
 *  /api/user/address:
 *    post:
 *      tags:
 *        - user/address
 *      parameters:
 *        - name: name
 *          in: formData
 *          type: string
 *          default: ''
 *          description:  name of address owner
 *        - name: telephone
 *          in: formData
 *          type: string
 *          required: true
 *          default: ''
 *        - name: street_address
 *          in: formData
 *          type: string
 *          default:  123 Avenue
 *          required: true
 *        - name: unit
 *          in: formData
 *          type: string
 *          required: false
 *          default: 1A
 *        - name: zip
 *          in: formData
 *          type: string
 *          required: true
 *          default: "10016"
 *        - name: city
 *          in: formData
 *          type: string
 *          required: true
 *          default: New York
 *        - name: state
 *          in: formData
 *          type: string
 *          required: true
 *          default: NY
 *        - name: country
 *          in: formData
 *          type: string
 *          required: true
 *          default: USA
 *        - name: delivery_notes
 *          in: formData
 *          type: string
 *          default: I prefer submarine delivery.
 *        - name: preferred_address
 *          in: formData
 *          type: boolean
 *          default: false
 *      description: get user data
 *      responses:
 *        200:
 *          description: user data
 */

router.post('/api/user/address',
    authenticate(),
    arrangeInput('body', {
        name: {
            type: 'STRING',
        },
        telephone: {
            type: 'STRING',
            required: true,
        },
        zip: {
            type: 'STRING',
            required: true,
            pattern: /^\d{5}(?:[-\s]\d{4})?$/
        },
        street_address: {
            type: 'STRING',
            required: true,
        },
        unit: {
            type: 'STRING',
        },
        city: {
            type: 'STRING',
            // required: true,
        },
        state: {
            type: 'STRING',
            // required: true,
        },
        country: {
            type: 'STRING',
            // required: true,
        },
        preferred_address: {
            type: 'BOOLEAN',
        }

    }),
    errors.wrap(async (req, res) => {
        const user = res.locals.user;
        const address = req.body;
        if (!zipCodes.includes(address.zip)) throw errors.InvalidInputError('Invalid zip-code');
        address.telephone = address.telephone || user.telephone;
        address.zip = address.zip || user.signup_zip;
        address._id = ObjectId();
        address.address_id = address._id;
        user.primary_telephone = user.primary_telephone || address.telephone;
        user.preferred_address = address.preferred_address
            ? address._id
            : user.preferred_address || address._id;
        await user.addresses.push(address);
        await user.save();
        res.json(user);
    })
);

module.exports = router;
