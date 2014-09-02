// middlewares related to user password retrieval process
var debug       = require('debug')('users:router:lost-password');

module.exports = function (sanitizer, store, render) {
    return {
        requestPasswordForm: function (req, res) {
            render(res, 'requestPasswordReset.html', {});
        },
        requestPassword: [
            function retreiveUser(req, res, next) {
                // lookup for user
                store.findUserByUsername(req.body.username, function (err, user) {
                    if (err) {
                        next(err);
                    }
                    req.sanitizedUser = user;
                    next();
                });
            },
            function createPasswordRequest() {
                // if found, send a new request to mail address
                debug(new Error('Not implemented'));
            },
            function redirectToHomepage(req, res) {
                // render form
                req.flash('success', 'You will receive a new password request by mail');
                res.redirect('/');
            }
        ],
        resetPasswordForm: function (req, res, next) {
            // retrieve user matching token
            // check validity
            // and check for email

            // display new password form
            render(res, 'resetPassword.html', {});
        },
        resetPassword: function (req, res, next) {
            // retrieve user matching token
            // check validity
            // and check for email

            // display new password form if error
            render(res, 'resetPassword.html', req.body);
        }
    };
}
