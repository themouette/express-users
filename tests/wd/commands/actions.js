var _ = require('lodash');

module.exports = {
    logIn: function(user, cb) {
        user = _.defaults(user, {
            username: '',
            password: ''
        });
        this
            .setValue('[name="username"]', user.username)
            .setValue('[name="password"]', user.password)
            .submitForm('[action="/login"]')
            .call(cb);
    },
    registerUser: function (user, cb) {
        user = _.defaults(user, {
            username: '',
            password: '',
            password_repeat: '',
            email: ''
        });
        this
            .setValue('[name="username"]', user.username)
            .setValue('[name="password"]', user.password)
            .setValue('[name="password_repeat"]', user.password_repeat)
            .setValue('[name="email"]', user.email)
            .submitForm('[action="/register"]')
            .call(cb);
    },
    updateProfile: function (user, cb) {
        user = _.defaults(user, {
            email: ''
        });
        this
            .setValue('[name="email"]', user.email)
            .submitForm('[action="/me"]')
            .call(cb);
    }
};
