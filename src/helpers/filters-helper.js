'use strict';
const moment = require('moment');
const errors = require('../errors');
const {Product} = require('../schemas');

module.exports = {
    getAvailableInventoryFilter: (rawTime) => {
        const time = validateTime(rawTime);
        return {
            live: true,
            available_times: {
                $elemMatch: {
                    day_of_week: moment.utc(time).day(),
                    start: {$lte: moment.utc(time).format('HH:mm:ss')},
                    end: {$gte: moment.utc(time).format('HH:mm:ss')},
                }
            }
        };
    },

    getUnvailableInventoryFilter: (rawTime) => {
        const time = validateTime(rawTime);
        return {
            $or: [
                {live: false},
                {
                    available_times: {
                        $not: {
                            $elemMatch: {
                                day_of_week: moment.utc(time).day(),
                                start: {$lte: moment.utc(time).format('HH:mm:ss')},
                                end: {$gte: moment.utc(time).format('HH:mm:ss')},
                            }
                        }
                    }
                }
            ],
        };
    },

    isProductAvailable: async (item, time) => {
        const availabilityFilter = module.exports.getAvailableInventoryFilter(time);
        if (item.inventory_id) availabilityFilter._id = item.inventory_id;
        const populateQuery = [
            {
                path: 'inventory',
                select: 'id price price_unit',
                match: availabilityFilter,
            },
            {
                path: 'packaging',
                select: 'deposit_amount description type'
            }
            ];
        let product = await Product
            .findOne({product_id: item.product_id})
            .populate(populateQuery)
            .select('name cat_id product_id inventory packaging_id packaging');
        product = product.toObject();
        product.isAvailable = product.inventory.length > 0;
        return product;
    }
};

function validateTime(rawTime) {
    const time = rawTime
        ? moment.utc(rawTime)
        : moment.utc();
    if (!time.isValid()) throw errors.InvalidInputError('Time format is invalid');
    return time;
};
