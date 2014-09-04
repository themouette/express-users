// middlewares related to user authorization
module.exports = function (render) {
    return {
        // redirect user to login page unless already logged in
        requireAuthentication: function requireAuthentication() {
            return function (req, res, next) {
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
        requireSudo: function requireSudo() {
            return function (req, res, next) {
                next();
            };
        },
        resetSudo: function resetSudo() {
            return function (req, res, next) {
                next();
            };
        }
    };
};

