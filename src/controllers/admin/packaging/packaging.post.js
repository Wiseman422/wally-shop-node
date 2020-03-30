const router = require('express').Router();
const errors = require('../../../errors');
const {Packaging} = require('../../../schemas');
const authenticate = require('../../../middleware/authenticate');
const arrangeInput = require('../../../middleware/arrange-inputs');
const userRoles = require('../../../enums/user-roles');

/**
 *  @swagger
 *  /api/admin/packaging:
 *    post:
 *      tags:
 *        - admin/packaging
 *      description: Creates a new packaging
 *      parameters:
 *        - name: type
 *          description:
 *          in: formData
 *          type: string
 *          required: true
 *        - name: description
 *          description:
 *          in: formData
 *          type: string
 *          required: true
 *        - name: deposit_amount
 *          description:
 *          in: formData
 *          type: integer
 *          required: true
 *      responses:
 *        200:
 *          description: created packaging
 */

 router.post('/api/admin/packaging',
    // authenticate([userRoles.ADMIN]),
    arrangeInput('body', {
        type: {
            type: 'STRING',
        },
        description: {
            type: 'STRING',
        },
        deposit_amount: {
            type: 'NUMBER',
        },
    }),
    errors.wrap(async (req, res) => {
        let existingPackaging = await Packaging.find({type: req.body.type});
        console.log("Existing packaging is", existingPackaging);
        if (existingPackaging.length > 0) throw errors.InvalidInputError("Packaging type already exists");

        const packaging = await Packaging.create(req.body);
        res.json(packaging);
    })
);

module.exports = router;