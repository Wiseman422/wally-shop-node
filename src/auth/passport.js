'use strict';
const config = require('config');
const passport = require('passport');
const FacebookTokenStrategy = require('passport-facebook-token');


module.exports = () => {
    console.log('configurePassport');
    passport.use(new FacebookTokenStrategy(config.auth.facebook,
        (accessToken, refreshToken, profile, done) => {
            const user = {
                email: profile.emails[0].value,
                name: profile.name.givenName + ' ' + profile.name.familyName,
                id: profile.id,
                token: accessToken
            };
            return done(null, user);
        }
    ));
};
