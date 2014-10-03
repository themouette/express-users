// Define the application router

// Require External Packages
// -------------------------
var _           = require('lodash');
var express     = require('express');

// @param sanitizer     a sanitizer to transform user params into validated data
// @param store         data store
// @param passport      passport instance to use
// @param render        render function. default uses ninjucks
module.exports = function (sanitizer, store, passwordChecker, passport, render) {
    // configure controllers
    var authorization  = require('./router/authorization')(passwordChecker, render);
    var authentication  = require('./router/authentication')(passport, render);
    var register        = require('./router/register')(sanitizer, store, passwordChecker, render);
    var lostPassword    = require('./router/lostPassword')(sanitizer, store, render);
    var profile         = require('./router/profile')(authorization, sanitizer, store, passwordChecker, render);

    var router = express.Router();      // get an instance of the express Router

    // expose some utilities
    router.requireAuthentication = authorization.requireAuthentication;
    router.requireSudo           = authorization.requireSudo;
    router.resetSudo             = authorization.resetSudo;
    router.passport              = passport;

    router.use(function addUserLocals(req, res, next) {
        // add some data to template data
        res.locals.expressUsers = {
            isAuthenticated: req.isAuthenticated(),
            current: req.user
        };
        next();
    });

    // define routes
    router.get('/login', authentication.loginForm);
    router.post('/login', authentication.login);
    router.get('/logout', authentication.logout);

    router.get('/register', register.registerForm);
    router.post('/register', register.register);

    router.get('/lost-password', lostPassword.requestPasswordForm);
    router.post('/lost-password', lostPassword.requestPassword);
    router.get('/reset-password', lostPassword.resetPasswordForm);
    router.post('/reset-password', lostPassword.resetPassword);

    router.get('/me', authorization.requireAuthentication(), profile.me);
    router.get('/me/edit', authorization.requireAuthentication(), profile.editProfile);
    router.put('/me', [authorization.requireAuthentication()].concat(profile.updateProfile));
    router.get('/me/password', authorization.requireAuthentication(), authorization.requireSudo(), profile.editPassword);
    router.put('/me/password', [authorization.requireAuthentication(), authorization.requireSudo()].concat(profile.updatePassword));
    router.put('/me/reset-sudo', authorization.resetSudo(), profile.clearSudo);

    return router;
};
