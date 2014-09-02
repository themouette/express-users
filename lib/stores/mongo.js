// Mongo user strategy
// ===================
//
// A simple implementation for mongoDB user store.

// Require External Packages
// =========================
var _           = require('lodash');
var debug       = require('debug')('users:strategy:mongodb');

module.exports = function (config) {

    // Add default configuration
    // =========================
    config = _.defaults(config || {}, {
        // MongoClient instance to use for user storage.
        //
        // example:
        //
        // ```
        // var createUserStore = require('users/stores/mongo');
        // var dsn = 'mongodb://localhost:27017/authentication';
        // var userStore;
        // MongoClient.connect(dsn, function(err, db) {
        //     if(!err) {
        //         userStore = createUserStore({
        //             db: db,
        //             collection: db.collection('users');
        //         });
        //     } else {
        //         console.log('Ooops, unable to connect to mongoDb.');
        //     }
        // });
        // ```
        db: null,
        collection: null
    });

    return {
        // Create a new user in database
        //
        // @param user  the sanitized user
        // @param cb    callback when done. `function (err, newUser)`
        createUser: function (user, next) {
            // save user
            config.collection.insert(user, next);
        },
        // Find a user by its username
        //
        // @param username  the username to look for
        // @param cb        callback when done. `function (err, newUser)`
        findUserByUsername: function (username, next) {
            next(null);
        },
        // Find a user by its id
        //
        // @param username  the username to look for
        // @param cb        callback when done. `function (err, newUser)`
        findUserById: function (id, next) {
            var user = _.find(inMemoryUsers, {id: id});
            next(null, user);
        },
        // @param user          current loggedin user
        // @param updatedFields fields to update
        // @param cb            callback when done. `function (err, updatedUser)`
        updateProfile: function (user, updatedFields, next) {
            console.log(updatedFields);
            next(null, user);
        },
        // Update user password
        //
        // @param user          current loggedin user
        // @param updatedFields fields to update
        // @param cb            callback when done. `function (err, updatedUser)`
        updateUserPassword: function (user, updatedFields, next) {
            console.log(updatedFields);
            next(null, user);
        }
    };
};
