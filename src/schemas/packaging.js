const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PackagingSchema = new Schema({
        type: String,
        description: String,
        deposit_amount: Number,
    },
    {timestamps: true});

module.exports = mongoose.model('Packaging', PackagingSchema);
