// middlewares related to user authorization
module.exports = function (render) {
    return {
        // redirect user to login page unless already logged in
        requireAuthentication: function requireAuthentication() {
            return function (req, res, next) {
                if (!req.isAuthenticated()) {
                    res.status(401);
                    // for html only.
                    // TODO: content negotiation
                    req.flash('error', 'You must be authenticated to access this feature.');
                    return res.redirect('/login');
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

