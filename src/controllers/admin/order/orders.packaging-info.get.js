const router = require('express').Router();
const errors = require('../../../errors');
const {Order, InventoryItem} = require('../../../schemas');
const authenticate = require('../../../middleware/authenticate');

/**
 *  @swagger
 *  /api/admin/orders:
 *    get:
 *      tags:
 *        - admin/orders
 *      description: Fetches orders
 *      responses:
 *        200:
 *          description: array of order schemas
 */

 router.get('/api/admin/orders/packaging',
    errors.wrap(async (req, res) => {
        
        const today = req.query.today;        
        const orders = await Order.find({status: "submitted", "delivery_time": {"$regex": today} }).sort("-delivery_time");

        let headers = ["date", "order_id", "product_id", "product_name", "quantity", "packaged"];
        let output = headers.join() + '\n';

        for (var i = orders.length - 1; i >= 0; i--) {
            var o = orders[i];
            for (var j = o.cart_items.length - 1; j >= 0; j--) {
                var p = o.cart_items[j];
                var invObj = await InventoryItem.findById(p.inventory_id);

                output += `${today};${o.id};${p.product_id};${p.product_name};${p.customer_quantity} ${invObj.price_unit};false\n`    
            };
        };

        console.log(output);
        res.json(orders);
    })
);

module.exports = router;