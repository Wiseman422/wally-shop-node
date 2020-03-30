const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReferralSchema = new Schema({
        referrer_id: String,
        beneficiary_id: String,
        promo_code: String,
        benefit: String
    },
    {timestamps: true});

module.exports = mongoose.model('Referral', ReferralSchema);
