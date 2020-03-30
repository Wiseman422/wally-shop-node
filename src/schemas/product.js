const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
        product_id: String,
        cat_id: String,
        subcat_id: String,
        name: String,
        description: String,
        organic: {type: Boolean, default: false},
        local: {type: Boolean, default: true},
        allergens: {type: [String], default: []},
        taxable: {type: Boolean, default: false},
        unit_type: String,
        unit_size: String,
        increment_size: {type: Number, default: 1},
        min_size: {type: Number, default: 1},
        final_adj: {type: Boolean, default: false},
        packaging_id: Schema.Types.ObjectId,
        packaging_vol: {type: Number, default: 1},
        image_refs: {type: [String], default: []}
    },
    {
        toObject: {virtuals: true},
    },
    {timestamps: true});

ProductSchema.virtual('inventory', {
    ref: 'InventoryItem',
    localField: 'product_id',
    foreignField: 'product_id',
});

ProductSchema.virtual('packaging', {
    ref: 'Packaging',
    localField: 'packaging_id',
    foreignField: '_id',
});

module.exports = mongoose.model('Product', ProductSchema);
