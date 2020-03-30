const router = require('express').Router();
const errors = require('../../../errors');
const {InventoryItem} = require('../../../schemas');
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

 router.post('/api/admin/inventory',
    errors.wrap(async (req, res) => {
        console.log(req.body);
        let inventory = new InventoryItem();
        inventory.product_id = req.body.product_id;
        inventory.producer = req.body.producer;
        inventory.shop = req.body.shop;
        inventory.live = req.body.live;
        inventory.price = req.body.price;
        inventory.price_unit = req.body.price_unit;
        inventory.available_times = req.body.available_times;

        await inventory.save();

        res.json(inventory);
    })
);

module.exports = router;