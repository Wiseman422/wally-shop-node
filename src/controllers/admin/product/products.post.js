const router = require('express').Router();
const errors = require('../../../errors');
const {Product} = require('../../../schemas');
const userRights = require('../../../enums/user-roles');
const authenticate = require('../../../middleware/authenticate');
const arrangeInput = require('../../../middleware/arrange-inputs');

/**
 *  @swagger
 *  /api/admin/products:
 *    post:
 *      tags:
 *        - product
 *      description: create category, Admin API
 *      parameters:
 *      responses:
 *        200:
 *          description: user data
 */

router.post('/api/admin/products',
    // TODO uncomment to activate admin-only access
    //authenticate([userRights.ADMIN]),
    errors.wrap(async (req, res) => {
        const productIds = req.body.product_ids;
        const catIds = req.body.cat_ids;
        const subcatIds = req.body.subcat_ids;
        const names = req.body.names;
        const descriptions = req.body.descriptions;
        const organics = req.body.organics;
        const unit_types = req.body.unit_types;
        const unit_sizes = req.body.unit_sizes;
        const increment_sizes = req.body.increment_sizes;
        const min_sizes = req.body.min_sizes;
        const image_refes = req.body.image_refes;

        const products = [];
        const pIds = [];

        for (var i = productIds.length - 1; i >= 0; i--) {
            console.log(i);
            var pObj = {
                product_id: productIds[i],
                cat_id: catIds[i],
                subcat_id: subcatIds[i],
                name: names[i],
                description: descriptions[i],
                organic: organics[i],
                unit_type: unit_types[i],
                increment_size: increment_sizes[i],
                min_size: min_sizes[i],
                packaging_id: "5b78b01bedab8f917e02e5f9",
                image_refs: image_refes[i]                
            };
            var unit_size = unit_sizes[i];
            if (unit_size != "") pObj.unit_size = unit_size;

            const product = await Product.create(pObj);
            products.push(product);
            pIds.push(product.id);
        };
        // console.log(pIds);
        res.json(products);
    })
);

module.exports = router;

