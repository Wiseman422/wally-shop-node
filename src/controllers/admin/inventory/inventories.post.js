const router = require('express').Router();
const errors = require('../../../errors');
const {InventoryItem} = require('../../../schemas');
const userRights = require('../../../enums/user-roles');
const authenticate = require('../../../middleware/authenticate');
const arrangeInput = require('../../../middleware/arrange-inputs');

/**
 *  @swagger
 *  /api/admin/inventories:
 *    post:
 *      tags:
 *        - inventory
 *      description: create category, Admin API
 *      parameters:
 *      responses:
 *        200:
 *          description: user data
 */

router.post('/api/admin/inventories',
    // TODO uncomment to activate admin-only access
    //authenticate([userRights.ADMIN]),
    errors.wrap(async (req, res) => {
        const productIds = req.body.product_ids;
        const producers = req.body.producers;
        const shops = req.body.shops;
        const prices = req.body.prices;
        const price_units = req.body.price_units;
        const available_times = req.body.available_times;

        const inventories = [];
        const iIds = [];

        for (var i = productIds.length - 1; i >= 0; i--) {
            console.log(i);
            var iObj = {
                product_id: productIds[i],
                producer: producers[i],
                shop: shops[i],
                live: true,
                price: prices[i],
                price_unit: price_units[i],
                available_times: available_times[i]             
            };

            const inventory = await InventoryItem.create(iObj);
            inventories.push(inventory);
            iIds.push(inventory.id);
        };
        // console.log(pIds);
        res.json(inventories);
    })
);

module.exports = router;

