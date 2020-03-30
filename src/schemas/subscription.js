const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const SubscriptionSchema = new Schema({
        email: String,
        zip: String
    },
    {timestamps: true});

module.exports = mongoose.model('Subscription', SubscriptionSchema);
