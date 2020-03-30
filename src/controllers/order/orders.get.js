const router = require('express').Router();
const errors = require('../../errors');
const {Order, PackagingReturn} = require('../../schemas');
const authenticate = require('../../middleware/authenticate');

/**
 *  @swagger
 *  /api/orders/:
 *    get:
 *      tags:
 *        - order
 *      description: Get orders list
 *      parameters:
 *        - name: limit
 *          in: query
 *          type: integer
 *          description: records count limimt
 *          default: 10
 *        - name: offset
 *          in: query
 *          type: integer
 *          description: pagination offset
 *          default: 0
 *        - name: report_type
 *          in: query
 *          type: string
 *          enum:
 *            - order
 *            - packaging
 *            - all
 *          description: pagination offset
 *          default: 0
 *      responses:
 *        200:
 *          description: submitted order data
 *        404:
 *          description: order not found
 */

router.get('/api/orders',
    authenticate(),
    errors.wrap(async (req, res) => {
        const offset = +req.query.offset || 0;
        const limit = +req.query.limit || 10;
        const user = res.locals.user;
        var reportType = 'all';
        if (req.query.report_type) reportType = req.query.report_type;


        let orders = [];
        let packagingReturns = [];

        if (reportType === 'order' || reportType === 'all') {
            orders = await Order.find({user_id: user._id})
                .sort('-createdAt')
                .limit(limit)
                .skip(offset);
        }

        if (reportType === 'packaging' || reportType === 'all') {
            packagingReturns = await PackagingReturn.find()
                .sort('-createdAt')
                .limit(limit)
                .skip(offset);
        }

        const list = [...orders, ...packagingReturns];

        res.json(list);
    })
);

module.exports = router;
