describe('Password plaintext strategy', function () {
    var passwd;
    var user1, user2;

    var assert = require('assert');

    function assertUser(user, cb, done) {
        passwd.hashPassword(user, function (err, updatedUser) {
            try {
                cb(err, updatedUser);
                done();
            } catch (failure) {
                done(failure);
            }
        });
    }

    beforeEach(function () {
        passwd = require('../../../lib/password/plain')();
        user1 = {password: 'foo'};
    });

    it('should add user.passwordStrategy as "plaintext"', function (done) {
        assertUser(user1, function (err, updatedUser) {
            assert.ifError(err);
            assert.equal(updatedUser.passwordStrategy, 'plaintext');
        }, done);
    });

    it('should keep user.password', function (done) {
        var original = user1.password;
        assertUser(user1, function (err, updatedUser) {
            assert.ifError(err);
            assert.equal(original, updatedUser.password);
        }, done);
    });
});
