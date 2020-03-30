const router = require('express').Router();
const errors = require('../../../errors');
const {InventoryItem} = require('../../../schemas');
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

 router.patch('/api/admin/inventories/shop-times',
    errors.wrap(async (req, res) => {
        let criteria = { "available_times": { $elemMatch: { "day_of_week": 0, "start": "15:00:00", "end": "23:59:59" } } };
        let update = { "available_times": [ { day_of_week: 0, start: "14:00:00", end: "23:59:59" }, { day_of_week: 1, start: "00:00:00", end: "14:59:59" } ] };

        inventory = await InventoryItem.update(criteria, update, { multi: true });
        console.log(inventory);
        res.json(inventory);
    })
);

module.exports = router;