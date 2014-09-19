// middlewares related to user authorization
var _ = require('lodash');
var ValidationErrors = require('../validation').ValidationErrors;
var debug = require('debug')('users:router:authorization');

module.exports = function (passwordChecker, render) {
    // Check the current user has sudo rights enabled.
    // This is based on time comparison.
    var checkSudo = function (req, sessionLength) {
        var value = req.session.isSudo;
        if (!value) return false;
        var now = new Date();
        var sudoTime = Date.parse(value);

        return (now - sudoTime) < sessionLength;
    };

    // store sudo authentication
    var activateSudo = function activateSudo(req) {
        req.session.isSudo = (new Date()).toString();
    };

    // reset any sudo authentication
    var deactivateSudo = function deactivateSudo(req) {
        req.session.isSudo = null;
    };
    // Render the password request page with a 401 status.
    // html only for now.
    // TODO: content negotiation
    var renderUnauthorized = function renderUnauthorized(res, data) {
        res.status(401);
        return render(res, 'sudo.html', data);
    };

    return {
        // redirect user to login page unless already logged in
        requireAuthentication: function requireAuthenticationWrapper() {
            return function requireAuthentication(req, res, next) {
                if (!req.isAuthenticated()) {
                    if (!req.session.redirectAfterLoginUrl) {
                        var path = req.path;
                        if (-1 === ['/login', '/logout'].indexOf(path)) {
                            // store
                            req.session.redirectAfterLoginUrl = path;
                        }
                    }
                    res.status(401);
                    // for html only.
                    // TODO: content negotiation
                    req.flash('error', 'You must be authenticated to access this feature.');
                    return res.redirect('/login');
                }

                if (req.session.redirectAfterLoginUrl) {
                    req.session.redirectAfterLoginUrl = null;
                }

                next();
            };
        },
        // Ask the user to reenter its password to grant admin rights
        requireSudo: function requireSudoWrapper(options) {
            options = _.defaults(options || {}, {
                // `sessionLength`
                //
                // Number of minutes the user should have provided his/her
                // password.
                sessionLength: 5 * 60 * 1000, // 5 minutes
                // `message`
                //
                // Extra message to display to user
                message: 'Please provide your password to unlock this feature.',
                // `success`
                //
                // The success message to diplay on successfull authentication.
                success: 'Your password has been successfuly checked.'
            });

            return function requireSudo(req, res, next) {
                var validation = new ValidationErrors();
                var user = req.user;
                var providedPassword = req.body.password;

                // Does user have granted privileges ?
                if (checkSudo(req, options.sessionLength)) {
                    return next(null);
                }

                // first, reset current sudo
                deactivateSudo(req);

                // First call ?
                if (null == providedPassword) {
                    // No possible error, bypass validation
                    return renderUnauthorized(res, {message: options.message});
                }


                passwordChecker.checkPassword(user, providedPassword, function (err, user) {
                    if (err) {
                        debug('Unable to validate password: %s', err);
                        validation.addGlobalError('Password does not match.');

                        return renderUnauthorized(res, {message: options.message, errors: validation.format()});
                    }

                    activateSudo(req);
                    // redirect to original url
                    req.flash('success', options.success);

                    res.redirect(req.originalUrl || '/');
                });
            };
        },
        resetSudo: function resetSudoWrapper() {
            return function resetSudo(req, res, next) {
                deactivateSudo(req);
                next();
            };
        }
    };
};

