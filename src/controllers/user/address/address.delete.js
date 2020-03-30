const router = require('express').Router();
const errors = require('../../../errors');
const authenticate = require('../../../middleware/authenticate');

/**
 *  @swagger
 *  /api/user/address/{address_id}:
 *    delete:
 *      tags:
 *        - user/address
 *      description: Removes an address from the user’s list of addresses.
 *      parameters:
 *        - name: address_id
 *          description: user address ID
 *          in: path
 *          type: string
 *          required: true
 *      responses:
 *        204:
 *          description: user data
 */

router.delete('/api/user/address/:address_id',
    authenticate(),
    errors.wrap(async (req, res) => {
        const user = res.locals.user;
        const addressId = req.params.address_id;
        const address = await user.addresses.id(addressId);
        if (!address) throw errors.NotFoundError('Address with this ID is not found');
        await user.addresses.id(addressId).remove();
        user.preferred_address = user.addresses.length > 0
            ? user.addresses[0]._id
            : '';

        await user.save();
        res.json(user); // there is better to send just 204 (Not Found) status
    })
);

module.exports = router;
