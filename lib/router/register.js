// middlewares related to user registration
var ValidationErrors = require('../validation').ValidationErrors;

module.exports = function (sanitizer, store, passwordChecker, render) {

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
        register: [
            function sanitizeRequest(req, res, next) {
                sanitizer.sanitizeNewUser(req.body, function (err, user) {
                    if (err) {
                        return render(res, 'register.html', {user: user, errors: err});
                    }
                    req.sanitizedUser   = user;
                    next();
                });
            },
            function hashPassword(req, res, next) {
                // transform new user
                encryptUserPassword(req.sanitizedUser, function (err, newUser) {
                    newUser = newUser || req.sanitizedUser;
                    if (err) {
                        // forward error
                        return render(res, 'register.html', {user: newUser, errors: err});
                    }

                    next(null, newUser);
                });
            },
            function saveUser(req, res) {
                store.createUser(req.sanitizedUser, function (err, user) {
                    if (err) {
                        req.flash('error', err);
                        return render(res, 'register.html', {user: user});
                    }
                    res.redirect('/login');
                });
            }
        ]
    };
};
