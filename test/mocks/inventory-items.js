module.exports = {
    milk1: {
        _id: '009000000000000000000001',
        product_id: 'prod_001',
        producer: 'Milk producer 1',
        shop: 'Mega Mall',
        available_times: [
            {
                day_of_week: 0,
                start: '10:00:00',
                end: '18:00:00'
            },
            {
                day_of_week: 1,
                start: '10:00:00',
                end: '18:00:00'
            },
            {
                day_of_week: 6,
                start: '10:00:00',
                end: '22:00:00'
            }
        ],
        live: true,
        price: 199,
        price_unit: 'unit'
    },
    milk2: {
        _id: '009000000000000000000002',
        product_id: 'prod_001',
        producer: 'Milk producer 2',
        shop: 'Mini market',
        available_times: [
            {
                day_of_week: 0,
                start: '16:00:00',
                end: '22:00:00'
            },
            {
                day_of_week: 1,
                start: '16:00:00',
                end: '22:00:00'
            },
            {
                day_of_week: 6,
                start: '12:00:00',
                end: '22:00:00'
            }
        ],
        live: false,
        price: 239,
        price_unit: 'unit'
    },
    peach: {
        _id: '009000000000000000000003',
        product_id: 'prod_003',
        producer: 'Natural Farm',
        shop: 'Mega mall',
        available_times: [
            {
                day_of_week: 0,
                start: '10:00:00',
                end: '22:00:00'
            },
            {
                day_of_week: 1,
                start: '16:00:00',
                end: '22:00:00'
            },
            {
                day_of_week: 6,
                start: '12:00:00',
                end: '22:00:00'
            }
        ],
        live: true,
        price: 199,
        price_unit: 'unit'
    },
    lettuce: {
        _id: '009000000000000000000004',
        product_id: 'prod_004',
        producer: 'Turkey',
        shop: 'Mini market',
        available_times: [
            {
                day_of_week: 0,
                start: '10:00:00',
                end: '22:00:00'
            },
            {
                day_of_week: 1,
                start: '10:00:00',
                end: '22:00:00'
            },
            {
                day_of_week: 5,
                start: '10:00:00',
                end: '22:00:00'
            }
        ],
        live: true,
        price: 239,
        price_unit: 'unit'
    }
};
