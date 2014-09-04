describe('sanitizer', function () {
    var assert = require('assert');
    var createSanitizer = require('../../lib/sanitizer');

    function assertFieldsError(actual, expected, done) {
        try {
            assert.ok(actual.fields, 'there is fields errors.');
            assert.deepEqual(actual.fields, expected);
            done(null);
        } catch (failure) {
            done(failure);
        }
    }
    function assertGlobalError(actual, expected, done) {
        try {
            assert.ok(actual.globals, 'there is global errors errors.');
            assert.deepEqual(actual.globals, expected);
            done(null);
        } catch (failure) {
            done(failure);
        }
    }

    describe('#sanitizeNewUser()', function () {
        var store, sanitizer, data;

        beforeEach(function () {
            store = {
                findUserByUsername: function (username, done) {
                    done(null, username === 'exists' ? {username: 'exists'} : null);
                }
            };
            sanitizer = createSanitizer(store);
            data = {
                    username: 'Foo',
                    password: 'bar',
                    password_repeat: 'bar',
                    email: 'foo@bar.ext'
                };
        });

        it('should accept valid user', function (done) {
            sanitizer.sanitizeNewUser(data, function (err, sanitizedUser) {
                try {
                    assert.ifError(err);
                    assert.equal(sanitizedUser.username, data.username, 'username is forwarded');
                    done();
                } catch(failure) {
                    done(failure);
                }
            });
        });

        it('should reject empty username', function (done) {
            var expected = {username: ['username field is required']};
            data.username = '';

            sanitizer.sanitizeNewUser(data, function (err, user) {
                assertFieldsError(err, expected, done);
            });
        });

        it('should reject existing username username', function (done) {
            var expected = {username: ['username is already in use']};
            data.username = 'exists';

            sanitizer.sanitizeNewUser(data, function (err, user) {
                assertFieldsError(err, expected, done);
            });
        });

        it('should reject empty password', function (done) {
            var expected = {password: ['password field is required']};
            data.password = '';

            sanitizer.sanitizeNewUser(data, function (err, user) {
                assertFieldsError(err, expected, done);
            });
        });

        it('should reject mismatch password', function (done) {
            var expected = ['Passwords does not match.'];
            data.password = 'aaa';

            sanitizer.sanitizeNewUser(data, function (err, user) {
                assertGlobalError(err, expected, done);
            });
        });
    });

    describe('#sanitizeNewUser()', function () {
        var store, sanitizer, data;

        beforeEach(function () {
            store = {
                findUserByUsername: function (username, done) {
                    done(null, username === 'exists' ? {username: 'exists'} : null);
                }
            };
            sanitizer = createSanitizer(store);
            data = {
                    email: 'foo@bar.ext'
                };
        });

        it('should accept valid profile', function (done) {
            sanitizer.sanitizeProfileUpdate(data, function (err, sanitizedProfile) {
                try {
                    assert.ifError(err);
                    assert.equal(sanitizedProfile.username, data.username, 'username is forwarded');
                    done();
                } catch(failure) {
                    done(failure);
                }
            });
        });

        it('should reject empty email', function (done) {
            var expected = {email: ['email field is required']};
            data.email = '';

            sanitizer.sanitizeProfileUpdate(data, function (err, user) {
                assertFieldsError(err, expected, done);
            });
        });
    });

    describe('#sanitizePasswordUpdate()', function () {
        var store, sanitizer, data;

        beforeEach(function () {
            store = {
                findUserByUsername: function (username, done) {
                    done(null, username === 'exists' ? {username: 'exists'} : null);
                }
            };
            sanitizer = createSanitizer(store);
            data = {
                    password: 'bar',
                    password_repeat: 'bar'
                };
        });

        it('should accept valid password', function (done) {
            sanitizer.sanitizePasswordUpdate(data, function (err, sanitizedProfile) {
                try {
                    assert.ifError(err);
                    assert.equal(sanitizedProfile.password, data.password, 'password is forwarded');
                    assert.equal(sanitizedProfile.password_repeat, null, 'password_repeat is not forwarded');
                    done();
                } catch(failure) {
                    done(failure);
                }
            });
        });

        it('should reject mismatching password', function (done) {
            var expected = ['Passwords does not match.'];
            data.password_repeat = 'baz';

            sanitizer.sanitizePasswordUpdate(data, function (err, user) {
                assertGlobalError(err, expected, done);
            });
        });

        it('should reject empty password', function (done) {
            var expected = {"password":["password field is required"]};
            data.password = '';
            data.password_repeat = '';

            sanitizer.sanitizePasswordUpdate(data, function (err, user) {
                assertFieldsError(err, expected, done);
            });
        });
    });
});

