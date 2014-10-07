// middlewares related to user authentication
module.exports = function (passport, render) {
    return {
        // display login form
        loginForm: function loginForm(req, res, next) {
            render(res, 'login.html', {});
        },
        // do actuallogin
        login: function(req, res, next) {
            passport.authenticate('local', function(err, user, info) {
                if (err) { return next(err); }
                if (!user) {
                    return render(res, 'login.html', {
                        username: req.body.username,
                        errors: { fields: { username: ['Unable to authenticate with provided username/password.'] } }
                    });
                }
                var redirectUrl = req.session.redirectAfterLoginUrl;
                req.logIn(user, function(err) {
                    if (err) { return next(err); }
                    if (redirectUrl) {
                        req.session.redirectAfterLoginUrl = null;
                        return res.redirect(redirectUrl);
                    }
                    return res.redirect('/app');
                });
            })(req, res, next);
        },
        // log out user
        logout: function logout(req, res, next) {
            if (req.session && req.session.destroy) {
                req.session.destroy(function () {});
            }
            req.logout();
            req.session = null;
            res.redirect('/');
        }
    };
};
