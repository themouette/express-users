// Sanitize passed data
// ====================
//
// This is the place where requests are validated and cleaned.


// Require External Packages
// =========================
var _           = require('lodash');
var async       = require('async');
var debug       = require('debug')('users:sanitizer');
var VError      = require('verror');

var ValidationErrors = require('./validation').ValidationErrors;


module.exports = function (store) {

    // validate options
    if (!store) {
        debug('You must provide a store option to sanitizer.');
        throw new VError('User sanitizer requires a `store` option.');
    }

    function validateUsername(data, validation, done) {
        var username = data.username;

        if (!username) {
            validation.addFieldError('username', 'username field is required');

            return done(null);
        }

        store.findUserByUsername(username, function (err, user) {
            if (err || user) {
                validation.addFieldError('username', 'username is already in use');

                return done(null);
            }

            done(null, username);
        });
    }

    function validatePassword(data, validation, done) {
        var password = data.password;

        if (!password) {
            validation.addFieldError('password', 'password field is required');
        }
        if (password !== data.password_repeat) {
            validation.addGlobalError('Passwords does not match.');
        }

        done(null, password);
    }

    function validateEmail(data, validation, done) {
        var email = data.email;

        if (!email) {
            validation.addFieldError('email', 'email field is required');
        }

        done(null, email);
    }

    // transform validation errors into series error.
    // This will stop further execution.
    function exitIfValidationError(validation, done) {
        if (validation.hasError()) {
            return done(validation.format());
        }

        done(null);
    }

    return {
        // Validate and sanitize user creation form into a user JSON object.
        // This object is given as is to store createUser method.
        //
        // @param data  user provided data
        // @param next  callack to return user object - `function (err, user)`
        sanitizeNewUser: function (data, next) {
            var user = {};
            var validation = new ValidationErrors();

            // execute series of async operations for validation.
            async.series([
                function (done) {validateUsername(data, validation, done);},
                function (done) {validatePassword(data, validation, done);},
                function (done) {validateEmail(data, validation, done);},
                // do not hash if not required
                function (done) {exitIfValidationError(validation, done);}
            ], function handleValidation(err, results) {
                if (err) {
                    return next(err);
                }

                var user = {
                    username: results[0],
                    password: results[1],
                    email: results[2]
                };

                next(null, user);
            });

        },

        // Validate and sanitize profile update request into a user JSON object.
        // This object is given as is to store updateProfile method.
        //
        // @param data  user provided data
        // @param next  callack to return user object - `function (err, user)`
        sanitizeProfileUpdate: function (data, next) {
            var user = {};
            var validation = new ValidationErrors();

            // execute series of async operations for validation.
            async.series([
                function (done) {validateEmail(data, validation, done);},
                // do not hash if not required
                function (done) {exitIfValidationError(validation, done);}
            ], function handleValidation(err, results) {
                if (err) {
                    return next(err);
                }

                var user = {
                    email: results[0]
                };

                next(null, user);
            });
        },

        // Validate and sanitize user update form into a user JSON object.
        // This object is given as is to store createUser method.
        //
        // @param data  user provided data
        // @param next  callack to return user object - `function (err, user)`
        sanitizePasswordUpdate: function (data, next) {
            var user = {};
            var validation = new ValidationErrors();

            // execute series of async operations for validation.
            async.series([
                function (done) {validatePassword(data, validation, done);},
                // do not hash if not required
                function (done) {exitIfValidationError(validation, done);},
            ], function handleValidation(err, results) {
                if (err) {
                    return next(err);
                }

                var user = {
                    password: results[0]
                };

                next(null, user);
            });
        }
    };
};
