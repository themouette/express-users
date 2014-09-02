// middlewares related to user authentication
module.exports = function (passport, render) {
    return {
        // display login form
        loginForm: function loginForm(req, res, next) {
            render(res, 'login.html', {});
        },
        // do actuallogin
        login: passport.authenticate('local', {
                    successRedirect: '/',
                    successFlash: 'Welcome!',
                    failureRedirect: '/login',
                    failureFlash: 'Unable to authenticate with provided username/password.' }),
        // log out user
        logout: function logout(req, res, next) {
            req.logout();
            req.session = null;
            res.redirect('/');
        }
    };
};
