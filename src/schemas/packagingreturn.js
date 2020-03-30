const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ReturnSchema = new Schema({
        type: String,
        quantity: String,
        credit_amount: Number,
    },
    {
        toObject: {virtuals: true},
    }
);

const PackagingReturnSchema = new Schema({
        user_id: String,
        return_date: {type: Date, default: Date.now},
        total_credit: Number,
        status: {type: String, default: 'returned'},
        returns: [ReturnSchema]
    },
    {
        toObject: {virtuals: true},
    },
    {timestamps: true});

ReturnSchema.virtual('packaging', {
    ref: 'Packaging',
    localField: 'type',
    foreignField: 'type',
});

PackagingReturnSchema.virtual('user', {
    ref: 'User',
    localField: 'user_id',
    foreignField: '_id',
});

module.exports = mongoose.model('PackagingReturn', PackagingReturnSchema);
