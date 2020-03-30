module.exports = {
    cat_Meat: {
        category_id: '001',
        parent_id: null,
        child_ids: [
            '001001',
            '001002'
        ],
        name: 'Meat',
        description: 'Food category description',
    },
    cat_Beef: {
        category_id: '001001',
        parent_id: '001',
        child_ids: null,
        name: 'Beef',
        description: 'Organic Beef',
    },
    cat_ribeye: {
        category_id: '001002',
        parent_id: '001',
        child_ids: null,
        name: 'Ribeye',
        description: 'Fresh ribeye',
    },
    cat_Dairy: {
        category_id: '002',
        parent_id: null,
        child_ids: [
            '002001',
            '002002'],
        name: 'Dairy',
        description: 'Dairy description',
    },
    cat_Milk: {
        category_id: '002001',
        parent_id: '002',
        child_ids: null,
        name: 'Milk',
        description: 'Milk description',
    },
    cat_Cream: {
        category_id: '002002',
        parent_id: '002',
        child_ids: null,
        name: 'Cream',
        description: 'Cream description',
    },
    cat_Produce: {
        category_id: '003',
        parent_id: null,
        child_ids: [
            '003001',
            '003002'],
        name: 'Produce',
        description: 'Fresh vegetables and fruits',
    },
    cat_Fruits: {
        category_id: '003001',
        parent_id: '003',
        child_ids: null,
        name: 'Fruits',
        description: 'Fresh fruits',
    },
    cat_Vegetables: {
        category_id: '003002',
        parent_id: '003',
        child_ids: null,
        name: 'Vegetables',
        description: 'Organic vegetables',
    },
};
