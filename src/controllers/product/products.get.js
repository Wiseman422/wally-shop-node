const router = require('express').Router();
const errors = require('../../errors');
const {Product, Category} = require('../../schemas');
const filterHelper = require('../../helpers/filters-helper');
/**
 *  @swagger
 *  /api/products/{cat_id}:
 *    get:
 *      tags:
 *        - product
 *      description: get product details
 *      parameters:
 *        - name: cat_id
 *          default: '003'
 *          description: category ID
 *          in: path
 *          type: string
 *        - name: time
 *          description: local user time in UTC
 *          in: query
 *          type: string
 *          required: true
 *          default: 2018-08-12 12:00:00
 *      responses:
 *        200:
 *          description: products list
 */

router.get(['/api/products/', '/api/products/all', '/api/products/:cat_id'],
    errors.wrap(async (req, res) => {
        console.log("Getting products");
        console.log("user time is", req.query.time);
        const catId = req.params.cat_id;
        let categoriesList = await getSubCategories(catId);

        // Get only top level categories, if no category selected
        if (!catId) categoriesList = categoriesList.filter(category => category.category_id.length === 3);
        const categoryIds = categoriesList.map(el => el.category_id);

        let categoryFilterField = 'subcat_id';
        let productsFindFilter = {subcat_id: {$in: categoryIds}};
        if (!catId) {
            categoryFilterField = 'cat_id';
            productsFindFilter = {cat_id: {$in: categoryIds}};
        };

        let products = await Product
            .find(productsFindFilter)
            .populate({
                path: 'inventory',
                select: 'live price price_unit',
                match: filterHelper.getAvailableInventoryFilter(req.query.time),
            })
            .select('id name product_id cat_id subcat_id unit_size unit_type image_refs');

        // filter available products and rename fields corresponding to example in API v.1.1 doc
        products = products.filter(product => product.inventory.length > 0);

        const mainProducts = categoriesList
            .map(cat => {
                let productsList = products
                    .filter(product => product[categoryFilterField] === cat.category_id)
                    .map(product => {
                        return {
                            product_name: product.name,
                            product_id: product.product_id,
                            product_price: product.inventory[0].price,
                            unit_type: product.unit_type,
                            price_unit: product.inventory[0].price_unit,
                            product_size: product.unit_size,
                            inventory_id: product.inventory[0].id,
                            image_refs: product.image_refs
                        };
                    });

                if (cat.category_id.length === 3) productsList = productsList.slice(0,8);
                if (cat.category_id.length === 6) productsList = productsList.slice(0,4);

                return {
                    cat_id: cat.category_id,
                    cat_name: cat.name,
                    number_products: productsList.length,
                    products: productsList,
                };
            })
            .filter(cat => cat.products.length > 0);

        const {path, sideBarCategories} = await createSidebarAndPath(catId);

        res.json({
            main_products: mainProducts,
            sidebar: sideBarCategories,
            path
        });
    })
);

// Design for unlimited subcategories depth
const getSubCategories = async (catId) => {
    const subCategories = await Category.aggregate([
        {
            $match: {parent_id: catId}
        },
        {
            $graphLookup: {
                from: 'categories',
                startWith: '$category_id',
                connectFromField: 'child_ids',
                connectToField: 'category_id',
                as: 'categories'
            }
        },
        {
            $project: {
                'categories.name': 1,
                'categories.category_id': 1
            }
        }
    ]);

    let categories = [];
    if (catId) {
        const mainCategory = await Category.findOne({category_id: catId}).select('category_id name');
        if (!mainCategory) throw errors.NotFoundError('Category with this ID was not found');
        categories.push({
            category_id: mainCategory.category_id,
            name: mainCategory.name
        });
    }
    subCategories.map(sc => categories = [...categories, ...sc.categories]);

    return categories;
};

const createSidebarAndPath = async (catId) => {
    const path = [['All', 'all']];

    const subCategories = await Category.find({parent_id: null});
    sideBarCategories = subCategories.map(category => formatCategory(category));

    if (catId) {
        const topCategoryId = catId.length === 3 ? catId : catId.slice(0, 3);
        topCategory = await Category
            .findOne({category_id: topCategoryId})
            .select('category_id parent_id name');
        topCategory = formatCategory(topCategory);
        path.push([topCategory.cat_name, topCategory.cat_id]);
        const subCategories = await Category.find({parent_id: topCategoryId});
        topCategory.sub_cats = subCategories.map(category => formatCategory(category));
        sideBarCategories = sideBarCategories.map(function(cat) { return cat.cat_id == topCategoryId ? topCategory : cat; });
        if (catId.length === 6) {
            const subcategory = await Category.findOne({category_id: catId}).select('category_id parent_id name');
            path.push([subcategory.name, subcategory.category_id]);
        }
    }

    return ({path, sideBarCategories});
};

const formatCategory = (category) => {
    return {
        cat_id: category.category_id,
        cat_name: category.name,
    };
};

module.exports = router;
