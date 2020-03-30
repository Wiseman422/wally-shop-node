const router = require('express').Router();
const errors = require('../../../errors');
const {Product} = require('../../../schemas');
const authenticate = require('../../../middleware/authenticate');

/**
 *  @swagger
 *  /api/admin/product:
 *    post:
 *      tags:
 *        - admin/product
 *      description: Creates a new product
 *      responses:
 *        200:
 *          description: created product
 */

 router.post('/api/admin/product',
    // arrangeInput('body', {
    //     cat_id: {
    //         type: 'STRING',
    //         required: true,
    //     },
    //     parent_id: {
    //         type: 'STRING',
    //         required: true,
    //     },
    //     child_ids: {
    //         type: 'STRING'
    //     },
    //     name: {
    //         type: 'STRING',
    //     },
    //     description: {
    //         type: 'STRING',
    //     },
    // }),
    // TODO remove after implement ADMIN account
    // authenticate(['ADMIN']),
    errors.wrap(async (req, res) => {
        const user = res.locals.user;
        let product = new Product(req.body);

        await product.save();

        res.json(product);
    })
);

module.exports = router;