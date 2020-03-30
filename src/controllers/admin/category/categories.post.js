const router = require('express').Router();
const errors = require('../../../errors');
const {Category} = require('../../../schemas');
const userRights = require('../../../enums/user-roles');
const authenticate = require('../../../middleware/authenticate');
const arrangeInput = require('../../../middleware/arrange-inputs');

/**
 *  @swagger
 *  /api/category:
 *    post:
 *      tags:
 *        - category
 *      description: create category, Admin API
 *      parameters:
 *        - name: name
 *          description: category name
 *          in: formData
 *          type: string
 *          required: true
 *          default: Default Name
 *        - name: category_id
 *          description: category item ID
 *          in: formData
 *          type: string
 *          required: true
 *          default: cat_default123
 *        - name: parent_id
 *          description: parent category id, this cat should be added to parent category child_id's array
 *          in: formData
 *          type: string
 *        - name: child_ids
 *          description: child categories IDs array
 *          in: formData
 *          type: String
 *          default: cat_Food,cat_Toys,cat_Dairy
 *        - name: description
 *          description: category description
 *          in: formData
 *          type: string
 *          default: Default description
 *      responses:
 *        200:
 *          description: user data
 */

router.post('/api/admin/categories',
    // TODO uncomment to activate admin-only access
    //authenticate([userRights.ADMIN]),
    errors.wrap(async (req, res) => {
        const categoryIds = req.body.category_ids;
        const parentIds = req.body.parent_ids;
        const names = req.body.names;
        const descriptions = req.body.descriptions;
        const categories = [];
        const catIds = [];

        for (var i = categoryIds.length - 1; i >= 0; i--) {
            var catId = categoryIds[i];
            var name = names[i];
            var description = descriptions[i];
            var cat = {category_id: catId, name: name, description: description}
            if (req.body.parent_ids) {
                cat.parent_id = req.body.parent_ids[i];
                parentCategory = await Category.findOne({category_id: req.body.parent_ids[i]});
                if (parentCategory) {
                    parentCategory.child_ids.push(catId);
                    await parentCategory.save();
                }
            }
            const category = await Category.create(cat);
            categories.push(category);
            catIds.push(category.id);
        };
        console.log(catIds);
        res.json(categories);
    })
);

module.exports = router;

