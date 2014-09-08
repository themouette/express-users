var _ = require('lodash');

module.exports = {
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
    assertGlobalSuccess: function (expectedError, cb) {
        if (!cb) {
            cb = expectedError;
            error = null;
        }
        var selector = '.alert.success.success-global';
        this.assertExists(selector);
        if (expectedError) {
            this.assertText(selector, expectedError);
        }
        this.call(cb);
    },
    assertGlobalError: function (expectedError, cb) {
        if (!cb) {
            cb = expectedError;
            error = null;
        }
        var selector = '.alert.error.error-global';
        this.assertExists(selector);
        if (expectedError) {
            this.assertText(selector, expectedError);
        }
        this.call(cb);
    },
    assertFormError: function (expectedError, cb) {
        if (!cb) {
            cb = expectedError;
            error = null;
        }
        var selector = '.alert.error.error-form';
        this.assertExists(selector);
        if (expectedError) {
            this.assertText(selector, expectedError);
        }
        this.call(cb);
    },
    assertFieldError: function (fieldName, expectedError, cb) {
        if (!cb) {
            cb = expectedError;
            error = null;
        }
        var selector = '.error.error-' + fieldName;
        this.assertExists(selector);
        if (expectedError) {
            this.assertText(selector, expectedError);
        }
        this.call(cb);
    }
};
