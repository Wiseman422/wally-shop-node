const router = require('express').Router();
const errors = require('../../../errors');
const {PackagingReturn, User, Packaging} = require('../../../schemas');
const authenticate = require('../../../middleware/authenticate');

/**
 *  @swagger
 *  /api/admin/packaging-return:
 *    patch:
 *      tags:
 *        - admin/packaging-return
 *      description: Submits a Packaging Return. Increments the specified user’s store_credit field.
 *      responses:
 *        200:
 *          description: packaging return
 */

 router.post('/api/admin/packaging-return',
    errors.wrap(async (req, res) => {
        const packagingReturn = new PackagingReturn();
        const user = await User.findById(req.body.user_id);
        if (!user) throw errors.InvalidInputError("User does not exist");

        packagingReturn.user_id = req.body.user_id;
        packagingReturn.returns = [];
        var incAmount = 0;
        for (var i=0; i<req.body.returns.length; i++) {
          var returnObject = req.body.returns[i];
          var packaging = await Packaging.findOne({type: returnObject.type});
          var newReturnObject = {
            type: returnObject.type,
            quantity: returnObject.quantity,
            credit_amount: returnObject.quantity * packaging.deposit_amount
          };
          packagingReturn.returns.push(newReturnObject);

          incAmount += returnObject.quantity * packaging.deposit_amount;
        }

        await packagingReturn.save();
        user.store_credit = user.store_credit + incAmount;
        await user.save();
        res.json(packagingReturn);
    })
);

module.exports = router;