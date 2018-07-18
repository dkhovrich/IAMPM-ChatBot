import passport from 'passport';
import passportJWT from 'passport-jwt';
import * as _ from 'lodash';

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_KEY
}, function (jwtPayload, next) {
    const { id, email } = jwtPayload;
    if (_.isString(id) && _.isString(email)) {
        next(null, jwtPayload);
    } else {
        next(null, false);
    }
}));