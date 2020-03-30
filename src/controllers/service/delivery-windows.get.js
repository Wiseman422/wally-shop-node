'use strict';

const router = require('express').Router();
const moment = require('moment');

const errors = require('../../errors');
const arrangeInput = require('../../middleware/arrange-inputs');
const {Order} = require('../../schemas');
const validZip = require('../../enums/zip-codes');

const startDeliveryHour = 18;
const endDeliveryHour = 18;
const timeFrameWidth = 2;
const ordersLimit = 15;
const cutoffHour = 15;
const weekendCutoffHour = 14;
/**
 *  @swagger
 *  /api/delivery_windows:
 *    get:
 *      tags:
 *        - delivery
 *      description: get delivery windows
 *      parameters:
 *        - name: zip
 *          default: '10011'
 *          required: true
 *          in: query
 *          description: address zip-code
 *          type: string
 *        - name: user_time
 *          default: '2010-01-01T14:00:00.000Z'
 *          required: true
 *          in: query
 *          description: user current time ISO format like 2010-01-01T12:00:00.000Z
 *          type: string
 *      responses:
 *        200:
 *          description: delivery windows was sent
 */

router.get('/api/delivery_windows',
    arrangeInput('query', {
        zip: {
            type: 'STRING',
            required: true,
            pattern: /^\d{5}(?:[-\s]\d{4})?$/
        },
        user_time: {
            type: 'STRING',
            required: true,
        },
    }),
    errors.wrap(async (req, res) => {
        console.log("user time is", req.query.user_time);
        if (!validZip.includes(req.query.zip)) throw errors.InvalidInputError('Invalid zip-code provided');

        let startDate = moment.utc(req.query.user_time);
        if (!startDate.isValid()) throw errors.InvalidInputError('Time format is invalid');
        let endDate = startDate.clone().endOf('day');

        // check for weekend
        if ([0, 6].includes(startDate.day())) {
            if (startDate.hour() >= weekendCutoffHour) {
                startDate = startDate.add(1, 'day').startOf('day');
                endDate = startDate.clone().endOf('day');
            }
        } else {
            if (startDate.hour() >= cutoffHour) {
                startDate = startDate.add(1, 'day').startOf('day');
                endDate = startDate.clone().endOf('day');
            }
        }
        

        const timeBlocks = [];
        let timeBlockHour = startDeliveryHour;
        let timeBlockDate = startDate.clone().startOf('day').add(startDeliveryHour, 'hours');

        while (timeBlockHour <= endDeliveryHour) {
            timeBlocks.push(timeBlockDate.clone());
            timeBlockHour += 1;
            timeBlockDate = timeBlockDate.utc().add(1, 'hour');
        }

        const scheduledOrders = await Order.aggregate([
            {
                $match: {
                    zip: req.query.zip,
                    delivery_time: {
                        $gte: startDate.toDate(),
                        $lte: endDate.toDate(),
                    },
                    $or: [
                        {status: 'paid'},
                        {status: 'submitted'},
                        {status: 'packaged'},
                    ]
                },
            },
            {
                $project: {
                    h: {$hour: '$delivery_time'},
                }
            },
            {
                $group: {
                    _id: {hour: '$h'},
                    total: {$sum: 1}
                }
            }],
        );

        const deliveryWindows = [];
        for (const timeBlock of timeBlocks) {
            const timeBlockOrders = scheduledOrders.filter(order => {
                return timeBlock.hour() <= order._id.hour
                    && timeBlock.hour() + timeFrameWidth >= order._id.hour;
            });

            const isTimeBlockAvailable = timeBlockOrders.reduce((acc, item) => acc + item.total, 0) < ordersLimit;
            deliveryWindows.push([
                `${timeBlock.hour()}:00-${timeBlock.hour() + timeFrameWidth}:00`,
                `${timeBlock.format('YYYY-MM-DD')}`,
                !isTimeBlockAvailable]);
        }

        res.json({delivery_windows: deliveryWindows});
    })
);

module.exports = router;
