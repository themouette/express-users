describe('MemoryStore', function() {
    var createStore = require('../../../lib/stores/memory');
    var assert = require('assert');
    var async = require('async');
    var data = [
        {id: "julien", username: "Julien", password: "pwd"},
        {id: "anne", username: "Anne", password: "pwd"},
        {id: "salome", username: "Salome", password: "pwd"},
        {id: "kangoo", username: "Kangoo", password: "pwd"}
    ];

    function populateStore(store, data, done) {
        async.each(data, function (user, next) {
            var id = user.id;
            store.createUser(user, function (err, newDoc) {
                newDoc.id = id;
                next(err);
            });
        }, done);
    }

    describe('#findUserById()', function() {

        var collection;
        beforeEach(function (done) {
            collection = createStore();
            populateStore(collection, data, done);
        });

        it('should return existing user', function (done) {
            collection.findUserById('julien', function (err, user) {
                try {
                    assert.ifError(err);
                    assert.equal(user.username, 'Julien');
                    done();
                } catch (validationError) {
                    done(validationError);
                }
            });
        });

        it('should return no user if no match', function (done) {
            collection.findUserById('Bill', function (err, user) {
                try {
                    assert.ifError(err);
                    assert.ok(typeof user === "undefined", 'user should be undefined');
                    done();
                } catch (validationError) {
                    done(validationError);
                }
            });
        });
    });

    describe('#findUserByUsername()', function() {

        var collection;
        beforeEach(function (done) {
            collection = createStore();
            populateStore(collection, data, done);
        });

        it('should return existing user', function (done) {
            collection.findUserByUsername('Julien', function (err, user) {
                try {
                    assert.ifError(err);
                    assert.equal(user.username, 'Julien');
                    done();
                } catch (validationError) {
                    done(validationError);
                }
            });
        });

        it('should return last user', function (done) {
            collection.findUserByUsername('Kangoo', function (err, user) {
                try {
                    assert.ifError(err);
                    assert.equal(user.username, 'Kangoo');
                    done();
                } catch (validationError) {
                    done(validationError);
                }
            });
        });

        it('should return no user if no match', function (done) {
            collection.findUserByUsername('Bill', function (err, user) {
                try {
                    assert.ifError(err);
                    assert.ok(typeof user === "undefined", 'user should be undefined');
                    done();
                } catch (validationError) {
                    done(validationError);
                }
            });
        });
    });

    describe('#createUser()', function() {

        var collection;
        beforeEach(function (done) {
            collection = createStore();
            populateStore(collection, data, done);
        });

        it('should define an id property.', function (done) {
            collection.createUser({username: "Franck"}, function (err, newUser) {
                try {
                    assert.ifError(err);
                    assert.ok(newUser.id, 'user id property should be undefined');
                    done();
                } catch (validationError) {
                    done(validationError);
                }
            });
        });

        it('should store the new user.', function (done) {
            collection.createUser({username: "Franck"}, function (err, newUser) {
                try {
                    assert.ifError(err);

                    collection.findUserByUsername("Franck", function (err, user) {
                        try {
                            assert.ok(user, 'Object should be found');
                            done();
                        } catch (validationError) {
                            done(validationError);
                        }
                    });
                } catch (validationError) {
                    done(validationError);
                }
            });
        });
    });

    describe('#updateUserPassword()', function() {

        var collection;
        beforeEach(function (done) {
            collection = createStore();
            populateStore(collection, data, done);
        });

        it('should update user password.', function (done) {
            collection.updateUserPassword({id: "julien"}, {password: "pwdbbb", salt: "bbb"}, function (err, newUser) {
                try {
                    assert.ifError(err);
                    assert.equal(newUser.password, "pwdbbb", 'password should be updated immediately');
                    assert.equal(newUser.salt, "bbb", 'salt should be updated immediately');

                    collection.findUserByUsername("Julien", function (err, user) {
                        try {
                            assert.ok(user.password === "pwdbbb", 'Password field should be updated');
                            assert.ok(user.salt === "bbb", 'Salt field should be updated');
                            done();
                        } catch (validationError) {
                            done(validationError);
                        }
                    });
                } catch (validationError) {
                    done(validationError);
                }
            });
        });
    });
});
