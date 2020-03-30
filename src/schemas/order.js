const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
    name: String,
});

const CartItemSchema = new Schema({
    product_id: String,
    product_name: String,
    product_price: Number,
    inventory_id: Schema.Types.ObjectId,
    customer_quantity: Number,
    price_quantity: Number,
    final_quantity: Number,
    inventory_hit: Boolean,
    valid: Boolean,
    total: Number,
    substitute_for_name: String,
    missing: { type: Boolean, default: false }
});

const PackagingItemSchema = new Schema({
    type: String,
    quantity: Number
});

const OrderSchema = new Schema({
        user_id: String,
        cart_id: String,
        cart_items: [CartItemSchema],
        packaging_used: [PackagingItemSchema],
        subtotal: Number,
        promo: {type: String, default: ''},
        promo_discount: {type: Number, default: 0},
        delivery_amount: Number,
        service_amount: Number,
        tax_amount: Number,
        packaging_deposit: Number,
        applied_store_credit: Number,
        total: Number,
        user_name: String,
        telephone: String,
        street_address: String,
        unit: String,
        zip: String,
        city: String,
        state: String,
        country: String,
        delivery_notes: String,
        delivery_time: String,
        payment_method: PaymentSchema,
        verified: Boolean,
        status: String,
        auth_charge_id: String,
    },
    {timestamps: true});


module.exports = mongoose.model('Order', OrderSchema);
