var _               = require('lodash');
var passport        = require('passport');
var LocalStrategy   = require('passport-local').Strategy;
var debug           = require('debug')('users:auth');

// @param store             user store tu use for local strategy
// @param passwordChecker   password strategy
// @param passport          passport object (optional)
module.exports = function (store, passwordChecker, passport) {
    passport = passport || require('passport');

    passport.use('local', new LocalStrategy(
        function(username, password, done) {
            debug('"%s" is connecting', username);

            store.findUserByUsername(username, function (err, user) {
                if (err) {
                    return done(null, false, err);
                }

                if (!user) {
                    debug('Unknown username %s', username);
                    return done(null, false, "Unknown username");
                }

                passwordChecker.checkPassword(user, password, function (err, processed) {
                    if (err) {
                        debug('Password error %s', err);
                        return done(null, false, err);
                    }
                    if (!processed) {
                        debug('Unknown strategy %s', user.passwordStrategy);
                        return done(null, false);
                    }

                    done(null, user);
                });
            });
        }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        store.findUserById(id, function (err, user) {
            if (!user) {
                debug('Session is still active, but user has been deleted.');
            }
            done(null, user || {});
        });
    });

    return passport;
};
