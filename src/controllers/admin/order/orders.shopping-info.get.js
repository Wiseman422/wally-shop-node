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

 router.get('/api/admin/orders/shopping',
    errors.wrap(async (req, res) => {
        
        const today = req.query.today;        
        const orders = await Order.find({status: "submitted", "delivery_time": {"$regex": today} }).sort("-delivery_time");

        let headers = ["date", "product_id", "product_name", "quantity", "estimated_price", "vendor", "location", "bought"];
        let output = headers.join() + '\n';

        let consolidated = {};
        for (var i = orders.length - 1; i >= 0; i--) {
            var o = orders[i];
            for (var j = o.cart_items.length - 1; j >= 0; j--) {
                var p = o.cart_items[j];
                var invObj = await InventoryItem.findById(p.inventory_id);

                var pKey = p.product_id + " " + invObj.id;

                if (consolidated[pKey]) {
                    consolidated[pKey]["quantity"] += p.customer_quantity;
                } else {
                    consolidated[pKey] = { "quantity": p.customer_quantity, "price": p.product_price, 
                        "product_id": p.product_id, "product_name": p.product_name,
                        "vendor": invObj.producer, "location": invObj.shop, "unit": invObj.price_unit };
                }

            };
        };

        let keys = Object.keys(consolidated);
        for (var i = keys.length - 1; i >= 0; i--) {
            var c = consolidated[keys[i]];
            output += `${today};${c.product_id};${c.product_name};${c.quantity} ${c.unit};\$${c.price/100} / ${c.unit};${c.vendor};${c.location};false\n`
        };

        console.log(output);

        res.json(orders);
    })
);

module.exports = router;