var VError = require('verror');

module.exports = function () {
    return {
        // return updated user
        //
        // @param user  the sanitized user object
        // @param next  callback when user object is updated `function (error, user)`
        hashPassword: function plainText(user, next) {
            var salt = "aaa";
            user.password = user.password + salt;
            user.salt = salt;
            user.passwordStrategy = 'salt';
            next(null, user);
        },
        // Check given password match given user's password.
        checkPassword: function (user, password, next) {
            var computedPassword = password + user.salt;
            if (computedPassword === user.password) {
                return next(null, computedPassword);
            }

            next(new VError('Password does not match.'));
        }
    };
};
