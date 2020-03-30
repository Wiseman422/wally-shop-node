'use strict';

const router = require('express').Router();
const errors = require('../../errors');
const {Product, Category} = require('../../schemas');
const filterHelper = require('../../helpers/filters-helper');
/**
 *  @swagger
 *  /api/products/search:
 *    get:
 *      tags:
 *        - product
 *      description: get product data
 *      parameters:
 *        - name: keyword
 *          default: ilk
 *          description: search keyword
 *          in: query
 *          type: string
 *          required: true
 *      responses:
 *        200:
 *          description: user data
 */

router.get('/api/products/search',
    errors.wrap(async (req, res) => {
        console.log("user time is", req.query.time);

        if (!req.query.keyword) throw errors.InvalidInputError('Keyword string should not be null');

        const rawProducts = await Product
            .find({name: {$regex: req.query.keyword, $options: 'i'}})
            .populate({
                path: 'inventory',
                select: 'live price price_unit',
                match: filterHelper.getAvailableInventoryFilter(req.query.time),
            })
            .select('name product_id cat_id subcat_id unit_size unit_type image_refs');
        const filteredProducts = rawProducts.filter(product => product.inventory.length > 0);

        const products = filteredProducts.map(product => {
            let p = {
                cat_id: product.cat_id,
                subcat_id: product.subcat_id,
                product_id: product.product_id,
                name: product.name,
                available_now: product.inventory.length > 0,
                unit_type: product.unit_type,
                product_size: product.unit_size,
                image_refs: product.image_refs
            }

            if (product.inventory.length > 0) {
                p.product_price = product.inventory[0].price;
                p.price_unit = product.inventory[0].price_unit;
                p.inventory_id = product.inventory[0].id;
            } else {
                p.product_price = 0;
                p.price_unit = "ea";
                p.inventory_id = "";
            }

            return p;
        });

        const categoryIds = [...new Set(products.map(prd => prd.cat_id))];
        const categories = await Category.find({category_id: {$in: categoryIds}});
        const filtersPromises = await categories.map(async category => {
            let subCategories;
            if (category.child_ids && category.child_ids.length) {
                const subCatRaw = await Category.find({category_id: {$in: category.child_ids}});
                subCategories = subCatRaw.map(sc => {
                    return {
                        cat_id: sc.category_id,
                        cat_name: sc.name,
                    };
                });
            }

            return {
                cat_id: category.category_id,
                cat_name: category.name,
                sub_cats: subCategories,
            };
        });

        const filters = await Promise.all(filtersPromises);

        res.json({products, filters});
    })
);

module.exports = router;
