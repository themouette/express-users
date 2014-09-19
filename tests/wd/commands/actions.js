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
    logOut: function (cb) {
        this
            .click('[href="/logout"]')
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
    },
    fillSudo: function (pwd, cb) {
        this
            .setValue('[name="password"]', pwd)
            .submitForm('form')
            .call(cb);
    },
    updatePassword: function (password, password_repeat, cb) {
        if (!cb) {
            cb = password_repeat;
            password_repeat = password;
        }
        this
            .clearElement('[name="password"]')
            .clearElement('[name="password_repeat"]')
            .setValue('[name="password"]', password)
            .setValue('[name="password_repeat"]', password_repeat)
            .submitForm('[action="/me/password"]')
            .call(cb);
    }
};
