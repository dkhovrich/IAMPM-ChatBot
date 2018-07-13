const passport = require('passport');
const passportJWT = require('passport-jwt');
const _ = require('lodash');

const jwtSecretKey = require('../config').jwtSecretKey;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecretKey
}, function (jwtPayload, next) {
    const { id, email } = jwtPayload;
    if (_.isString(id) && _.isString(email)) {
        next(null, jwtPayload);
    } else {
        next(null, false);
    }
}));