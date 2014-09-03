describe('Password Salt strategy', function () {
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
        passwd = require('../../../lib/password/salt')();
        user1 = {password: 'foo'};
        user2 = {password: 'bar'};
    });

    it('should add user.passwordStrategy as "salt"', function (done) {
        assertUser(user1, function (err, updatedUser) {
            assert.ifError(err);
            assert.equal(updatedUser.passwordStrategy, 'salt');
        }, done);
    });

    it('should add user.salt', function (done) {
        assertUser(user1, function (err, updatedUser) {
            assert.ifError(err);
            assert.ok(updatedUser.salt);
        }, done);
    });

    it('should hash user.password', function (done) {
        var original = user1.password;
        assertUser(user1, function (err, updatedUser) {
            assert.ifError(err);
            assert.notEqual(original, updatedUser.password);
        }, done);
    });

    it('salt should be unique', function (done) {
        var updatedUser1;
        assertUser(user1, function (err, updatedUser) {
            assert.ifError(err);
            updatedUser1 = updatedUser;
        }, function (err) {
            if(err) {
                done(err);
            }
            assertUser(user2, function (err, updatedUser) {
                assert.notEqual(updatedUser1.salt, updatedUser.salt);
            }, done);
        });
    });
});
