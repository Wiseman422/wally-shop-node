const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const generateCode = () => Math.random().toString(36).substring(6).toUpperCase();

const PromoCodeSchema = new Schema({
        type: String,
        referrer_id: String,
        promo_code: {
            type: String,
            default: generateCode(),
        },
        benefit: String
    },
    {timestamps: true});


module.exports = mongoose.model('PromoCode', PromoCodeSchema);
