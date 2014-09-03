// middlewares related to user registration
var _                   = require('lodash');
var ValidationErrors    = require('../validation').ValidationErrors;

module.exports = function (sanitizer, store, passwordChecker, render) {
    var validateAndCreate = require('../fixtures')(store, sanitizer, passwordChecker).validateAndCreate;

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

    return {
        registerForm: function registerForm(req, res) {
            render(res, 'register.html', {user: req.user});
        },
        register: function sanitizeRequest(req, res, next) {
                var data = _.cloneDeep(req.body);
                validateAndCreate(data, function (err, user) {
                    if (err) {
                        return render(res, 'register.html', {user: req.body, errors: err});
                    }

                    req.flash('success', 'Your account has been created');
                    res.redirect('/login');
                });
            }
    };
};
