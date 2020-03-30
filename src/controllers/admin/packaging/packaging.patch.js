const router = require('express').Router();
const errors = require('../../../errors');
const {Packaging} = require('../../../schemas');
const authenticate = require('../../../middleware/authenticate');

/**
 *  @swagger
 *  /api/admin/packaging:
 *    patch:
 *      tags:
 *        - admin/packaging
 *      description: Updates existing Packaging
 *      responses:
 *        200:
 *          description: updated packaging
 */

 router.patch('/api/admin/packaging/:packaging_id',
    errors.wrap(async (req, res) => {
        const packaging = await Packaging.findById(req.params.packaging_id);
        packaging.type = req.body.type;
        packaging.description = req.body.description;
        packaging.deposit_amount = req.body.deposit_amount;

        await packaging.save();

        res.json(packaging);
    })
);

module.exports = router;