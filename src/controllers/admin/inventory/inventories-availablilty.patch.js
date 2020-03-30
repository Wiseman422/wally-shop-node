const router = require('express').Router();
const errors = require('../../../errors');
const {InventoryItem, Product} = require('../../../schemas');
const authenticate = require('../../../middleware/authenticate');

/**
 *  @swagger
 *  /api/admin/inventory:
 *    post:
 *      tags:
 *        - admin/inventory
 *      description: Updates existing InventoryItem
 *      responses:
 *        200:
 *          description: updated inventory item
 */

 router.patch('/api/admin/inventories/availability',
    errors.wrap(async (req, res) => {
        let criteria = { "name": { $regex: "white peach", $options: 'i' } };
        let products = await Product.find(criteria);

        let prodIDs = {};
        for (var i = 0; i < products.length; i++) {
          prodIDs[products[i].product_id] = true;
        };
        console.log(Object.keys(prodIDs));
        let invCriteria = { "product_id": { "$in": Object.keys(prodIDs) } };
        let update = { "live": false }
        
        let inventory = await InventoryItem.update(invCriteria, update, { multi: true })
        res.json(inventory);
    })
);

module.exports = router;