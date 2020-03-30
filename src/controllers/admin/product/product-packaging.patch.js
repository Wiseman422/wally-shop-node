const router = require('express').Router();
const errors = require('../../../errors');
const {Packaging, Product} = require('../../../schemas');
const authenticate = require('../../../middleware/authenticate');

/**
 *  @swagger
 *  /api/admin/product/packaging-relationship:
 *    patch:
 *      tags:
 *        - admin/packaging
 *      description: Updates existing Packaging
 *      responses:
 *        200:
 *          description: updated packaging
 */

 router.patch('/api/admin/product/packaging-relationship',
    errors.wrap(async (req, res) => {
        const update = {packaging_id: req.body.packaging_id};
        const product = await Product.findByIdAndUpdate(req.body.product_id, update, {new: true});

        res.json(product);
    })
);

module.exports = router;