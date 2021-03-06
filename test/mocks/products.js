const packaging = require('./packagings');

module.exports = {
    milk: {
        _id: '001000000000000000000001',
        product_id: 'prod_001',
        cat_id: '002',
        subcat_id: '002001',
        name: 'Fresh Milk',
        description: 'Fresh natural milk',
        allergens: ['Lactose'],
        taxable: false,
        unit_type: 'unit',
        unit_size: '64 Fl oz',
        increment_size: 1,
        min_size: 1,
        final_adj: false,
        packaging_id: packaging.bottle._id,
        packaging_vol: 1,
    },
    ribeye: {
        _id: '001000000000000000000002',
        product_id: 'prod_002',
        cat_id: '001',
        subcat_id: '001002',
        name: 'Fresh Ribeye',
        description: 'Fresh Ribeye',
        allergens: ['Fat'],
        taxable: false,
        unit_type: 'piece',
        unit_size: '100 oz',
        increment_size: 1,
        min_size: 1,
        final_adj: false,
        packaging_id: packaging.bag._id,
        packaging_vol: 1,
    },
    peach: {
        _id: '001000000000000000000003',
        product_id: 'prod_003',
        cat_id: '003',
        subcat_id: '003001',
        name: 'Peach',
        description: 'Fresh peaches',
        allergens: [],
        taxable: false,
        unit_type: 'bag',
        unit_size: '999 oz',
        increment_size: 1,
        min_size: 1,
        final_adj: false,
        packaging_id: packaging.bag._id,
        packaging_vol: 1,
    },
    lettuce: {
        _id: '001000000000000000000004',
        product_id: 'prod_004',
        cat_id: '003',
        subcat_id: '003002',
        name: 'Lettuce',
        description: 'Fresh lettuce',
        allergens: [],
        taxable: false,
        unit_type: 'bag',
        unit_size: '999 oz',
        increment_size: 1,
        min_size: 1,
        final_adj: false,
        packaging_id: packaging.bag._id,
        packaging_vol: 1,
    },
};
