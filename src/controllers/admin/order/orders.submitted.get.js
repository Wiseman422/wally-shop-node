const router = require('express').Router();
const errors = require('../../../errors');
const {Order} = require('../../../schemas');
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

 router.get('/api/admin/orders/submitted',
    errors.wrap(async (req, res) => {
        const orders = await Order.find({status: "submitted" }).sort("-delivery_time");

        res.json(orders);
    })
);

module.exports = router;