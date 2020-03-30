const router = require('express').Router();
const mongoose = require('mongoose');

const errors = require('../../errors');
const {Cart} = require('../../schemas');
const authenticate = require('../../middleware/authenticate');
const accessOptions = require('../../enums/access-options');
const filterHelper = require('../../helpers/filters-helper');
/**
 *  @swagger
 *  /api/cart/{cart_id}:
 *    get:
 *      tags:
 *        - cart
 *      description: get cart for logged user
 *      parameters:
 *        - name: cart_id
 *          default: 5b741479ae3aa876e3859e90
 *          description: cart ID
 *          in: path
 *          type: string
 *        - name: time
 *          description: local user time in UTC
 *          in: query
 *          type: string
 *          default: 2018-08-12 12:00:00
 *      responses:
 *        200:
 *          description: user data
 */

router.get(['/api/cart', '/api/cart/:cart_id'],
    authenticate(null, [accessOptions.GUEST_ALLOWED]),
    errors.wrap(async (req, res) => {
        console.log("User fetching cart");
        console.log("user time is", req.query.time);
        const user = res.locals.user;
        const cartId = req.params.cart_id;
        if (cartId && !mongoose.Types.ObjectId.isValid(cartId)) throw errors.InvalidInputError('Cart ID should be valid ObjectID');

        let cart;
        // if only cart id provided by guest user
        if (!user) {
            console.log("User is guest");
            if (cartId) {
                cart = await Cart.findOne({_id: cartId, status: 'open'});
            }
            if (!cart) cart = await Cart.create({_id: cartId, status: 'open'});
        }

        if (user) {
            console.log("User logged in");
            // Try to find user opened cart
            cart = await Cart.findOne({
                user_id: user._id,
                status: 'open'
            });

            // if not found && cartId provided - try to find corresponding cart and bind it to user
            if (!cart && cartId) {
                cart = await Cart.findOne({_id: cartId, status: 'open'});
                cart.user_id = user._id;
                console.log("Cart tried to be found");
                await cart.save();
            }

            if (!cart) {
                console.log("No cart found");
                cart = await Cart.create({
                    user_id: user._id,
                    status: 'open'
                });
            }
        }

        const cartItems = [...cart.cart_items, ...cart.unavailable_items];
        cart.cart_items = [];
        cart.unavailable_items = [];
        cart.subtotal = 0;
        cart.packaging_deposit = 0;
        cart.tax_amount = 0;
        cart.total = 0;

        // split available and unavailable items to corresponding arrays
        for (const item of cartItems) {
            const product = await filterHelper.isProductAvailable(item, req.query.time);
            const availabilityType = product.isAvailable ? 'cart_items' : 'unavailable_items';
            const quantity = item.customer_quantity;
            const inventoryItem = product.inventory[0];
            if (product.isAvailable) {
                cart[availabilityType].push({
                    product_id: product.product_id,
                    product_name: product.name,
                    packaging_name: product.packaging[0].type,
                    product_price: product.isAvailable ? inventoryItem.price : 0,
                    inventory_id: product.isAvailable ? inventoryItem._id : "",
                    inventory: product.inventory,
                    customer_quantity: quantity,
                    total: product.isAvailable ? inventoryItem.price * quantity : 0,
                    packaging_deposit: product.packaging[0].deposit_amount * Math.ceil(quantity),
                    tax_amount: 0
                });
                if (product.isAvailable) {
                    cart.subtotal += inventoryItem.price * quantity;
                    cart.tax_amount += 0;
                    cart.total += inventoryItem.price * quantity;
                }
            }
        }
        cart.status = "open";
        cart.packaging_deposit = 500;
        cart.total += cart.packaging_deposit;
        cart.total += cart.tax_amount;
        cart.total = Math.round(cart.total);
        await cart.save();
        res.json(cart);
    })
);

module.exports = router;
