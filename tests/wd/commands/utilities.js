module.exports = {
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
}
