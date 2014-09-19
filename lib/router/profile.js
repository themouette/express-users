var ValidationErrors = require('../validation').ValidationErrors;
// profile related controllers
module.exports = function (authorization, sanitizer, store, passwordChecker, render) {

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
        me: function me(req, res, next) {
            render(res, 'account.html', {user: req.user});
        },
        editProfile: function editProfile(req, res, next) {
            render(res, 'accountEdit.html', {user: req.user});
        },
        updateProfile: [
            function sanitizeProfileUpdate(req, res, next) {
                sanitizer.sanitizeProfileUpdate(req.body, function (err, updatedFields) {
                    if (err) {
                        return render(res, 'accountEdit.html', {errors: err, user: req.user});
                    }
                    req.sanitizedUser   = updatedFields;
                    next();
                });
            },
            function updateUser(req, res, next) {
                store.updateUserProfile(req.user, req.sanitizedUser, function (err, user) {
                    if (err) {
                        return render(res, 'accountEdit.html', {user: user, errors: err});
                    }

                    req.flash('success', 'Your profile has been updated');
                    next();
                });
            },
            function (req, res) {
                res.redirect('/me');
            }
        ],
        editPassword: function editPassword(req, res, next) {
            render(res, 'password.html', req.user);
        },
        updatePassword: [
            function sanitizePasswordUpdate(req, res, next) {
                sanitizer.sanitizePasswordUpdate(req.body, function (err, updatedFields) {
                    if (err) {
                        return render(res, 'password.html', {errors: err});
                    }
                    req.sanitizedUser   = updatedFields;
                    next();
                });
            },
            function hashPassword(req, res, next) {
                // transform new user
                encryptUserPassword(req.sanitizedUser, function (err, updatedFields) {
                    updatedFields = updatedFields || {};
                    if (err) {
                        // forward error
                        return render(res, 'password.html', {user: req.sanitizedUser, errors: err});
                    }

                    req.sanitizedUser   = updatedFields;
                    next(null);
                });
            },
            function updateUser(req, res, next) {
                store.updateUserPassword(req.user, req.sanitizedUser, function (err, user) {
                    if (err) {
                        return render(res, 'password.html', {user: user, errors: err});
                    }

                    req.flash('success', 'Your password has been updated');
                    next();
                });
            },
            // reset sudo rights
            authorization.resetSudo(),
            function(req, res) {
                res.redirect('/me');
            }
        ],
        clearSudo: function clearSudo(req, res, next) {
            res.redirect('back');
        }
    };
};
