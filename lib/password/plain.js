var VError = require('verror');

module.exports = function () {
    return {
        // return updated user
        //
        // @param user  the sanitized user object
        // @param next  callback when user object is updated `function (error, user)`
        hashPassword: function plainText(user, next) {
            user.password = user.password;
            user.passwordStrategy = 'plaintext';
            next(null, user);
        },
        // Check given password match given user's password.
        // @param   user        the user object
        // @param   password    the password string to check
        // @param   next        function (err, processed)
        checkPassword: function (user, password, next) {
            if (user.passwordStrategy !== 'plaintext') {
                next(null, false);
            }
            if (password === user.password) {
                return next(null, true);
            }

            next(new VError('Password does not match.'));
        }
    };
};
