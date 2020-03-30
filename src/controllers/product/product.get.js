const router = require('express').Router();
const errors = require('../../errors');
const {Product, InventoryItem} = require('../../schemas');
const filterHelper = require('../../helpers/filters-helper');

/**
 *  @swagger
 *  /api/product/{product_id}:
 *    get:
 *      tags:
 *        - product
 *      description: get product details
 *      parameters:
 *        - name: product_id
 *          default: prod_001
 *          description: product ID
 *          in: path
 *          type: string
 *          required: true
 *        - name: time
 *          description: local user time in UTC
 *          in: query
 *          type: string
 *          required: true
 *          default: 2018-08-12 12:00:00
 *      responses:
 *        200:
 *          description: user data
 */

router.get('/api/product/:product_id',
    errors.wrap(async (req, res) => {
        console.log("user time is", req.query.time);
        const productId = req.params.product_id;
        const product = await Product
            .findOne({product_id: productId})
            .populate({path: 'packaging'});
        if (!product) throw errors.NotFoundError(`Product with id[${productId}] is not found`);
        availableInventoryFilter = filterHelper.getAvailableInventoryFilter(req.query.time);
        availableInventoryFilter.product_id = productId;
        unavailableInventoryFilter = filterHelper.getUnvailableInventoryFilter(req.query.time);
        unavailableInventoryFilter.product_id = productId;
        const availableInventory = await InventoryItem.find(availableInventoryFilter);
        const unavailableInventory = await InventoryItem.find(unavailableInventoryFilter);
        const result = product.toObject();
        result.available_inventory = availableInventory;
        result.unavailable_inventory = unavailableInventory;
        result.farms = getFarmsFromInventory(availableInventory);
        res.json(result);
    })
);

const getFarmsFromInventory = (availableInventory) => {
    const inventory = availableInventory;
    const farms = [...new Set(inventory.map(i => i.producer))];
    return farms;
}

module.exports = router;
