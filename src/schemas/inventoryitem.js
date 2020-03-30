const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AvailableTime = new Schema({
    day_of_week: Number,
    start: String,
    end: String
});

const InventoryItemSchema = new Schema({
        product_id: String,
        producer: String,
        shop: String,
        available_times: [AvailableTime],
        live: {
            type: Boolean,
            default: false,
        },
        create_date: Date,
        price: Number,
        price_unit: String
    },
    {timestamps: true});

module.exports = mongoose.model('InventoryItem', InventoryItemSchema);
