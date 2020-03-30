const router = require('express').Router();
const errors = require('../../../errors');
const {InventoryItem} = require('../../../schemas');
const authenticate = require('../../../middleware/authenticate');

/**
 *  @swagger
 *  /api/admin/inventory/live/{id}:
 *    post:
 *      tags:
 *        - admin/inventory
 *      description: Updates existing InventoryItem
 *      responses:
 *        200:
 *          description: updated inventory item
 */

 router.patch('/api/admin/inventory/live/:id',
    errors.wrap(async (req, res) => {
        const inventory = await InventoryItem.findById(req.params.id);
        const liveStatus = !inventory.live;
        inventory.live = liveStatus;

        await inventory.save();

        res.json(inventory);
    })
);

module.exports = router;