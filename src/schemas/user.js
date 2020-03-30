const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;
const errors = require('../errors');
const crypto = require('crypto');
const _ = require('lodash');

const AddressSchema = new Schema({
    address_id: String,
    name: String,
    telephone: {
        type: String,
        default: '',
    },
    street_address: String,
    unit: {type: String, default: ''},
    zip: String,
    city: String,
    state: String,
    country: String,
    delivery_notes: {type: String, default: ''}
});

const PaymentSchema = new Schema({
    card_id: String,
    stripe_payment_id: String,
    brand: String,
    country: String,
    exp_month: String,
    exp_year: String,
    fingerprint: String,
    last4: String,
});

const hashPassword = (password) => {
    return crypto
        .createHmac('sha512', process.env.SALT || 'salt')
        .update(password)
        .digest('hex');
};

const UserSchema = new Schema({
        type: {
            type: String,
            default: 'user',
        },
        email: String,
        validated_email: {
            type: Boolean,
            default: false
        },
        password: {
            type: String,
            select: false,
            set: hashPassword,
        },
        name: {
            type: String,
            default: ''
        },
        facebook_id: String,
        primary_telephone: {type: String, default: ''},
        signup_zip: String,
        store_credit: {type: Number, default: 0},
        preferred_payment: String,
        preferred_address: String,
        addresses: [AddressSchema],
        payment: [PaymentSchema],
        stripe_customer_id: String,
    },
    {
        timestamps: true
    });

/**
 * Generate Authentication Token for user
 * @return {{type: string, expiresIn: *, accessToken: *}}
 */
UserSchema.methods.generateToken = function () {
    const salt = process.env.SALT || 'salt';
    const data = {
        userId: this._id,
    };
    const tokenLifeTime = process.env.TOKEN_LIFE_TIME || 600000;
    return {
        type: 'Bearer',
        expiresIn: tokenLifeTime,
        accessToken: jwt.sign(data, salt, {expiresIn: tokenLifeTime}),
    };
};

/**
 * @param {string} password
 * @return {any} hash
 */
UserSchema.statics.hashPassword = (password) => {
    return hashPassword(password);
};

/**
 * @param {string} email
 * @param {string} password
 * @return {object} user
 */
UserSchema.statics.authenticate = async function (email, password) {
    const user = await this.findOne({email}, [...this.publicAttributes(), 'password']);
    if (!user) throw errors.NotFoundError('User not found!');
    if (!user.password) throw errors.NotAllowedError('Password not set! Please contact support.');
    if (user.password !== this.hashPassword(password)) throw errors.UnauthorizedError('Invalid credentials');
    return user;
};

UserSchema.statics.publicAttributes = function () {
    return [..._.without(_.keys(UserSchema.paths), '__v', 'password', 'createdAt', 'updatedAt')];
};

module.exports = mongoose.model('User', UserSchema);
