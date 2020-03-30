const router = require('express').Router();
const errors = require('../../errors');
const {Category} = require('../../schemas');
/**
 *  @swagger
 *  /api/categories:
 *    get:
 *      tags:
 *        - category
 *      description: get product data
 *      responses:
 *        200:
 *          description: user data
 */

router.get('/api/categories',
    errors.wrap(async (req, res) => {
        const topCategories = await Category
            .find({parent_id: null});
        const categories = await recursiveSearch(topCategories);
        const result = categories.map(cat => {
            return {
                cat_id: cat.category_id,
                cat_name: cat.name,
                sub_cats: cat.sub_cats,
            };
        });
        res.json(result);
    })
);

const recursiveSearch = async (categories) => {
    let cat = [];
    for (const key in categories) {
        if (!categories.hasOwnProperty(key)) continue;
        const subCategories = await Category.find({parent_id: categories[key].category_id});
        categories[key].sub_cats = subCategories.map(cat => {
            return {
                cat_id: cat.category_id,
                cat_name: cat.name,
            };
        });
        cat = [...cat, categories[key]];
        const recursiveCat = await recursiveSearch(subCategories);
        cat = [...cat, ...recursiveCat];
    }
    return cat;
};

module.exports = router;
