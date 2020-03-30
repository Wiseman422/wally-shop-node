const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartItemSchema = new Schema({
        product_id: String,
        product_name: String,
        packaging_name: String,
        product_price: Number,
        inventory_id: Schema.Types.ObjectId,
        customer_quantity: Number,
        price_quantity: Number,
        final_quantity: Number,
        total: Number,
        packaging_deposit: Number,
        tax_amount: {
            type: Number,
            default: 0
        }
    },
    {
        toObject: {virtuals: true},
    },
);

const CartSchema = new Schema({
        user_id: Schema.Types.ObjectId,
        cart_items: [CartItemSchema],
        unavailable_items: [CartItemSchema],
        subtotal: Number,
        packaging_deposit: Number,
        tax_amount: Number,
        total: Number,
        status: String
    },
    {timestamps: true});

CartItemSchema.virtual('product', {
    ref: 'Product',
    localField: 'product_id',
    foreignField: 'product_id',
});

module.exports = mongoose.model('Cart', CartSchema);
