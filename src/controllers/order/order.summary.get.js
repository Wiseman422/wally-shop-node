'use strict';

const router = require('express').Router();
const errors = require('../../errors');
const orderHelper = require('../../helpers/order.helper');
const authenticate = require('../../middleware/authenticate');

/**
 *  @swagger
 *  /api/order/summary:
 *    get:
 *      tags:
 *        - order
 *      description: check cart items and create order
 *      parameters:
 *        - name: time
 *          description: local user time in UTC
 *          in: query
 *          type: string
 *          default: 2018-08-12 12:00:00
 *      responses:
 *        200:
 *          description: user data
 */

router.get('/api/order/summary',
    authenticate(),
    errors.wrap(async (req, res) => {
        console.log("user time is", req.query.time);
        const user = res.locals.user;
        const summary = await orderHelper.summarizeOrder(user, req.query.time);
        res.json(summary);
    })
);

module.exports = router;
