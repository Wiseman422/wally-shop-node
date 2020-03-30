'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TokensSchema = new Schema({
        user_id: Schema.Types.ObjectId,
        type: String,
        expires_in: Date,
    },
    {timestamps: true});

module.exports = mongoose.model('Token', TokensSchema);
