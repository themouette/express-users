// load fixtures
var _                   = require('lodash');
var async               = require('async');
var ValidationErrors    = require('./validation').ValidationErrors;
var debug               = require('debug')('users:fixtures');

module.exports = function (store, sanitizer, passwordChecker) {

    function encryptUserPassword(user, next) {
        var validation = new ValidationErrors();
        passwordChecker.hashPassword(user, function (err, newUser) {
            if (err) {
                // forward error
                validation.addFieldError('password', err);
                return next(validation.format());
            }

            next(null, newUser || user);
        });
    }

    // WARNING: this is executed in reverse order!
    var createUser = async.compose(
            function saveUser(updatedUser, next) {
                store.createUser(updatedUser, function (err, user) {
                    if (err) {
                        return next(err);
                    }
                    next(null, user);
                });
            },
            function hashPassword(sanitizedUser, next) {
                // transform new user
                encryptUserPassword(sanitizedUser, function (err, updatedUser) {
                    newUser = updatedUser || sanitizedUser;
                    if (err) {
                        // forward error
                        return next(err);
                    }

                    next(null, updatedUser);
                });
            },
            function sanitizeData(rawData, next) {
                sanitizer.sanitizeNewUser(rawData, function (err, user) {
                    if (err) {
                        return next(err);
                    }
                    next(null, user);
                });
            }
        );
    return {
        validateAndCreate: createUser,
        loadFixtures: function loadFixtures(fixtures, done) {
            fixtures = fixtures || [];
            fixtures = _.map(fixtures, function (data) {
                return _.defaults(data, {password_repeat: data.password});
            });
            async.each(fixtures, createUser, done);
        }
    };
};
