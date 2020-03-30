const router = require('express').Router();
const errors = require('../../errors');
const zipCodes = require('../../enums/zip-codes');

/**
 *  @swagger
 *  /api/service/zipcodes/{address}:
 *    get:
 *      tags:
 *        - service
 *      description: get cart for logged user
 *      parameters:
 *        - name: address
 *          default: test
 *          description: get zip-codes for address
 *          in: path
 *          type: string
 *          required: true
 *      responses:
 *        200:
 *          description: user data
 */

router.get('/api/service/zipcodes',
    errors.wrap(async (req, res) => {
        // TODO check address??
        res.json({zipcodes: zipCodes});
    })
);

module.exports = router;
