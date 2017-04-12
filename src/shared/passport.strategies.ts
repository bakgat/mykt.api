import { Passport } from 'passport';
import * as local from 'passport-local';
import { IStaff, staffService } from '../staff/index';

let LocalStrategy = require('passport-local').Strategy;

export function setupStrategies(passport: Passport): void {
    /**
     * Passport session setup.
     * Required for persistent login sessions
     * Passport needs ability to serialize and deserialize users out of sesseion
     */

    passport.serializeUser((user: IStaff, done) => {
        done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
        staffService.getOne(id)
            .then(staff => {
                done(null, staff);
            }).catch(err => {
                done(err, null);
            });
    });

    /**
     * Local login
     * Implementation for the local strategy for the login process.
     */
    passport.use('local-login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallBack: true //allows us to pass back the entire request to the callback
    }, (req, email, password, done) => {
        //first check if the user exists
        staffService.findByUsername(email)
            .then(staff => {
                if(!staff) {
                    return done(null, false, 'Not found');
                }
                if(!staff.validPassword(password)) {
                    return done(null, false, 'Wrong password');
                }
                return done(null, staff);
            }).catch(err => {
                return done(err);
            })
    }));
}