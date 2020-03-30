'use strict';
const filterHelper = require('./filters-helper');
const {Cart} = require('./../schemas');
const errors = require('../errors');

module.exports = {
    summarizeOrder: async (user, time) => {
        const cart = await Cart.findOne({user_id: user._id, status: 'open'});
        if (!cart) throw errors.NotFoundError('Cart not found');

        const cartItems = cart.cart_items;
        const summary = {
            user_id: user._id,
            cart_id: cart._id,
            cart_items: [],
            unavailable_items: [],
            subtotal: 0,
            packaging_deposit: 500,
            promo: '',
            promo_discount: 0,
            applicable_store_credit: 0,
            applied_store_credit: 0,
            order_verified: true,
            service_amount: 0,
            delivery_amount: 0,
            tax_amount: cart.tax_amount || 0,
        };

        for (const item of cartItems) {
            const product = await filterHelper.isProductAvailable(item, time);
            const availabilityType = product.isAvailable ? 'cart_items' : 'unavailable_items';
            const quantity = item.customer_quantity;
            const inventoryItem = product.inventory[0];
            if (!product.isAvailable) summary.order_verified = false;

            summary[availabilityType].push({
                product_id: product.product_id,
                product_name: product.name,
                product_price: product.isAvailable ? inventoryItem.price : 0,
                inventory: product.inventory,
                customer_quantity: quantity,
                total: product.isAvailable ? inventoryItem.price * quantity : 0,
                inventory_id: inventoryItem._id
                // packaging_deposit: product.packaging[0].deposit_amount * Math.ceil(quantity)
            });

            if (product.isAvailable) {
                summary.subtotal += Math.round(inventoryItem.price * quantity);
                // summary.packaging_deposit += product.packaging[0].deposit_amount * Math.ceil(quantity);
                summary.tax_amount += 0;
            }
        }

        summary.delivery_amount = summary.subtotal >= 3500 ? 0 : 399;
        summary.service_amount = Math.round(0.12 * summary.subtotal);

        summary.total = Math.round(summary.subtotal + summary.tax_amount + summary.packaging_deposit + summary.service_amount + summary.delivery_amount);
        summary.applicable_store_credit = Math.min(summary.total, user.store_credit);
        return summary;
    }
};
