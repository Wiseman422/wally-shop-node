const router = require('express').Router();
const errors = require('../../../errors');
const arrangeInput = require('../../../middleware/arrange-inputs');
const authenticate = require('../../../middleware/authenticate');

/**
 *  @swagger
 *  /api/user/address:
 *    patch:
 *      tags:
 *        - user/address
 *      description: set default address
 *      parameters:
 *        - name: address_id
 *          in: formData
 *          type: string
 *          required: true
 *          default: USA
 *      responses:
 *        200:
 *          description: user data
 */

router.patch('/api/user/address',
    authenticate(),
    arrangeInput('body', {
        address_id: {
            type: 'STRING',
            required: true,
        },
    }),
    errors.wrap(async (req, res) => {
        const user = res.locals.user;
        const address = await user.addresses.id(req.body.address_id);
        if (!address) throw errors.NotFoundError('Address with this ID is not found');
        user.preferred_address = address._id;
        await user.save();
        res.json(user);
    })
);

module.exports = router;
