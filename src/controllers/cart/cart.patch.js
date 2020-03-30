const router = require('express').Router();
const errors = require('../../errors');
const {Cart, Product} = require('../../schemas');
const filterHelper = require('../../helpers/filters-helper');

const authenticate = require('../../middleware/authenticate');
const arrangeInput = require('../../middleware/arrange-inputs');
/**
 *  @swagger
 *  /api/cart/{cart_id}:
 *    patch:
 *      tags:
 *        - cart
 *      description: get product data
 *      parameters:
 *        - name: cart_id
 *          default: "53cb6b9b4f4ddef1ad47f943"
 *          description: cart_id
 *          in: path
 *          type: string
 *        - name: product_id
 *          default: "prod_001"
 *          description: product id
 *          in: formData
 *          type: string
 *        - name: quantity
 *          default: 1
 *          description: product quantity
 *          in: formData
 *          type: number
 *        - name: inventory_id
 *          default: 009000000000000000000001
 *          description: inventory_id
 *          in: formData
 *          type: number
 *        - name: time
 *          description: local user time in UTC
 *          in: formData
 *          type: string
 *          default: 2018-08-12 12:00:00
 *      responses:
 *        200:
 *          description: cart data
 */

router.patch('/api/cart/:cart_id',
    authenticate(null, ['GUEST_ALLOWED']),
    arrangeInput('body', {
        product_id: {
            type: 'STRING',
        },
        quantity: {
            type: 'NUMBER',
        },
        inventory_id: {
            type: 'STRING'
        }
    }),
    errors.wrap(async (req, res) => {
        console.log("Patching cart");
        console.log("user time is", req.query.time);
        const cartId = req.params.cart_id;
        const user = res.locals.user;
        let cart = await Cart
            .findOne({_id: cartId})
            .populate({
                path: 'cart_items.product',
                select: 'packaging_id packaging',
                populate: {
                    path: 'packaging',
                }
            });

        if (user) {
            const existingCart = await Cart
                .findOne({user_id: user._id, status: 'open'})
                .populate({
                    path: 'cart_items.product',
                    select: 'packaging_id packaging',
                    populate: {
                        path: 'packaging',
                    }
                });
            if (!existingCart && cart) cart.user_id = user._id;
            if (existingCart) cart = existingCart;
        }
        if (!cart) throw errors.NotFoundError('Cart not found');
        const productId = req.body.product_id;
        const quantity = req.body.quantity;

        // remove from cart
        if (productId && !+quantity) {
            const [item] = cart.cart_items.filter(el => el.product_id === productId);
            if (item) await cart.cart_items.pull(item._id);
            const [unavailableItem] = cart.unavailable_items.filter(el => el.product_id === productId);
            if (unavailableItem) await cart.unavailable_items.pull(unavailableItem._id);
        }

        // add or update
        if (productId && +quantity) {
            const cartItems = [...cart.cart_items, ...cart.unavailable_items];
            const [existingItem] = cartItems.filter(el => el.product_id === productId);
            // if we have an existing item, we have also selected inventory ID
            const searchItem = existingItem ? existingItem : {product_id: productId};
            const product = await filterHelper.isProductAvailable(searchItem, req.query.time);
            const [inventory] = await product.inventory.filter(el => el._id.toString() === req.body.inventory_id);
            if (!inventory) throw errors.NotFoundError('Inventory with such ID is not found or not available');
            if (product.isAvailable) {
                const newItem = {
                    product_id: product.product_id,
                    product_name: product.name,
                    packaging_name: product.packaging[0].type,
                    product_price: inventory.price,
                    inventory_id: inventory.id,
                    customer_quantity: quantity,
                    final_quantity: quantity,
                    total: inventory.price * quantity,
                    inventory_id: inventory._id,
                    packaging_deposit: Math.ceil(quantity) * product.packaging[0].deposit_amount,
                    tax_amount: 0,
                    product: product
                };

                !existingItem
                    ? cart.cart_items.push(newItem)
                    : existingItem.set(newItem);
            }
        }

        const cartObj = cart.toObject();
        cart.subtotal = 0;
        cart.packaging_deposit = 0;
        cart.total = 0;
        for (const item of cartObj.cart_items) {
            cart.subtotal += item.total;
            cart.tax_amount += item.tax_amount;
            cart.packaging_deposit += item.packaging_deposit;
            cart.total += item.total + item.tax_amount + item.packaging_deposit;
        }
        cart.total = Math.round(cart.total);
        cart.status = "open";
        await cart.save();

        res.json(cart);
    })
);

module.exports = router;
