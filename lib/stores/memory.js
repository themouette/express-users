// Memory user store
// =================
//
// A simple implementation for development and tests.

// Require External Packages
// =========================
var _           = require('lodash');
var debug       = require('debug')('users:strategy:memory');

module.exports = function (config) {

    // Add default configuration
    // =========================
    config = _.extend({ }, config || {});

    // Local memory store
    var inMemoryUsers = [];

    function canonizeUsername(username) {
        return username.toLowerCase();
    }


    return {
        data: inMemoryUsers,
        // Create a new user in database
        //
        // @param user  the sanitized user
        // @param cb    callback when done. `function (err, newUser)`
        createUser: function createUser(user, next) {
            // generate an id if not already provided
            var id = user.id || (+new Date()).toString(36);
            user.id = id;
            // set canonical username
            // This is the store responsability as it is the only service to use it.
            user.canonicalUsername = canonizeUsername(user.username);

            // save user
            inMemoryUsers.push(user);
            next(null, user);
        },
        // Find a user by its username
        //
        // @param username  the username to look for
        // @param cb        callback when done. `function (err, newUser)`
        findUserByUsername: function (username, next) {
            var user = _.find(inMemoryUsers, {canonicalUsername: canonizeUsername(username)});
            next(null, user);
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
        updateUserProfile: function (user, updatedFields, next) {
            var userIndex = _.findIndex(inMemoryUsers, {id: user.id});
            user = inMemoryUsers[userIndex];
            _.extend(user, updatedFields);
            inMemoryUsers.splice(userIndex, 1, user);
            next(null, user);
        },
        // Update user password
        //
        // @param user          user to update
        // @param updatedFields fields to update
        // @param cb            callback when done. `function (err, updatedUser)`
        updateUserPassword: function (user, updatedFields, next) {
            var userIndex = _.findIndex(inMemoryUsers, {id: user.id});
            user = inMemoryUsers[userIndex];
            _.extend(user, updatedFields);
            inMemoryUsers.splice(userIndex, 1, user);
            next(null, user);
        }
    };
};
