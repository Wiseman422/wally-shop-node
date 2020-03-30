'use strict';
const jwt = require('jsonwebtoken');
const errors = require('../errors');
const User = require('../schemas/user');
const accessOptions = require('../enums/access-options');
const config = require('config');

module.exports = function authenticate(roles, options) {
    
    return errors.wrap(async function (req, res, next) {
        const passGuest = options && options.includes(accessOptions.GUEST_ALLOWED);

        if (!('authorization' in req.headers)) {
            if (passGuest) return next();
            return res.status(403).send('Missing authorization header');
        }

        const token = req.headers['authorization'].split(' ')[1];
        let payload;

        try {
            payload = jwt.verify(token, process.env.SALT || 'salt');
        } catch (err) {
            throw errors.UnauthorizedError(err.name);
        }

        const user = await User.findById(payload.userId);
        if (!user) throw errors.UnauthorizedError('User not found');
        if (roles && !roles.includes(user.type)) throw errors.Forbidden('You have no access to this feature');
        if (options && options.includes(accessOptions.VALID_EMAIL)
            && !user.validated_email) throw errors.Forbidden('You should submit email first');

        res.locals.user = user;
        next();
    });
};
