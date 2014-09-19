// NeDB user store
// =================
//
// A simple implementation for small applications.

// Require External Packages
// =========================
var _           = require('lodash');
var VError      = require('verror');
var Datastore   = require('nedb');
var debug       = require('debug')('users:strategy:nedb');

module.exports = function (config) {

    // Add default configuration
    // =========================
    //
    // Refer to [nedb
    // documentation](https://github.com/louischatriot/nedb#creatingloading-a-database)
    // for further information
    config = _.extend({
        autoload: true
    }, config || {});

    var users = new Datastore(config);

    users.ensureIndex({ fieldName: 'canonicalUsername', unique: true}, function (err) {debug('While ensuring canonicalUsername index: ', err);});
    users.ensureIndex({ fieldName: 'canonicalEmail', unique: true}, function (err) {debug('While ensuring canonicalEmail index: ', err);});

    function canonizeUsername(username) {
        return username.toLowerCase();
    }

    function formatUser(user) {
        if (!user) { return user; }
        var ret = {};
        Object.keys(user).forEach(function (propid) {
            if ('_id' === propid) {
                ret.id = user[propid];
                return null;
            }

            ret[propid] = user[propid];
        });
        return ret;
    }


    return {
        // Create a new user in database
        //
        // @param user  the sanitized user
        // @param cb    callback when done. `function (err, newUser)`
        createUser: function createUser(user, next) {
            // set canonical username
            // This is the store responsability as it is the only service to use it.
            user.canonicalUsername  = canonizeUsername(user.username);
            user.canonicalEmail     = canonizeUsername(user.email);

            // save user
            users.insert(user, function (err, newDoc) {
                next(err, formatUser(newDoc));
            });
        },
        // Find a user by its username
        //
        // @param username  the username to look for
        // @param cb        callback when done. `function (err, newUser)`
        findUserByUsername: function (username, next) {
            var canonizedName = canonizeUsername(username);
            users.findOne({
                            $or: [
                                { canonicalUsername: canonizedName},
                                { canonicalEmail: canonizedName}
                            ]},
                            function (err, user) {
                                next(err, formatUser(user));
                            });
        },
        // Find a user by its id
        //
        // @param username  the username to look for
        // @param cb        callback when done. `function (err, newUser)`
        findUserById: function (id, next) {
            users.findOne({_id: id}, function (err, user) {
                next(err, formatUser(user));
            });
        },
        // @param user          current loggedin user
        // @param updatedFields fields to update
        // @param cb            callback when done. `function (err, updatedUser)`
        updateUserProfile: function (user, updatedFields, next) {
            if (updatedFields.email) {
                updatedFields.canonicalEmail     = canonizeUsername(updatedFields.email);
            }

            var self= this;
            users.update(
                {_id: user.id},
                { $set: updatedFields },
                {multi: false},
                function (err, numReplaced) {
                    self.findUserById(user.id, next);
                });
        },
        // Update user password
        //
        // @param user          user to update
        // @param updatedFields fields to update
        // @param cb            callback when done. `function (err, updatedUser)`
        updateUserPassword: function (user, updatedFields, next) {
            var self= this;
            users.update(
                {_id: user.id},
                { $set: updatedFields },
                {multi: false},
                function (err, numReplaced) {
                    self.findUserById(user.id, next);
                });
        }
    };
};
