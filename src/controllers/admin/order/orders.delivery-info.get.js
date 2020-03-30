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

 router.get('/api/admin/orders/delivery',
    errors.wrap(async (req, res) => {
        
        const today = req.query.today;        
        const orders = await Order.find({status: "submitted", "delivery_time": {"$regex": today} }).sort("-delivery_time");

        let headers = ["date", "order_id", "address", "unit", "delivery_notes", "zip", "name", "telephone", "delivery_time", "delivered"];
        let output = headers.join() + '\n';

        for (var i = orders.length - 1; i >= 0; i--) {
            var o = orders[i];
            output += `${today};${o.id};${o.street_address};${o.unit};${o.delivery_notes};${o.zip};${o.user_name};${o.telephone};${o.delivery_time};false\n`    
        };

        console.log(output);
        res.json(orders);
    })
);

module.exports = router;