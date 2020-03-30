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

router.post('/api/admin/category',
    // TODO uncomment to activate admin-only access
    //authenticate([userRights.ADMIN]),
    arrangeInput('body', {
        name: {
            type: 'STRING',
        },
        category_id: {
            type: 'STRING',
        },
        parent_id: {
            type: 'STRING',
        },
        description: {
            type: 'STRING',
        },
    }),
    errors.wrap(async (req, res) => {
        const categoryId = req.body.category_id;
        const isCategoryExists = await Category.findOne({
            $or: [{
                category_id: categoryId
            }, {
                name: req.body.name
            }]
        });
        // req.body.child_ids = req.body.child_ids.split(',');
        // console.log(req.body.child_ids);
        // if (isCategoryExists) throw errors.InvalidInputError('Category with such ID or Name already exists');

        const category = await Category.create(req.body);
        console.log(category);
        if (req.body.parent_id) {
            parentCategory = await Category.findOne({category_id: req.body.parent_id});
            if (parentCategory) {
                parentCategory.child_ids.push(category_id);
                await parentCategory.save();
            }
        }

        res.json(category);
    })
);

module.exports = router;

