// Require External Packages
// =========================
var _           = require('lodash');
var VError      = require('verror');
var nunjucks    = require('nunjucks');
var debug       = require('debug')('users:router');

module.exports = function (options) {
    options = options || {};

    var store;
    var sanitizer;
    var passwordChecker;
    var passport;
    var fixtures;

    _.defaults(options, {
        // default data to load
        data: [],
        // Where to find views
        // this can be an array of views.
        //
        views: [],
        // When using default template engine (Nunjunks), should view cache be enabled.
        // Default is false to ease development.
        cache: false,
        store: null,
        sanitizer: null,
        passwordChecker: null,
        passport:  null
    });

    // prepare view related configuration
    if (!options.views) {
        options.views = [];
    } else if (!_.isArray(options.views)) {
        options.views = [options.views];
    }
    // alway fallback on default templates
    options.views.push(__dirname + '/views');


    // prepare store configuration
    store = options.store;
    if (!store && options.nedb) {store = 'nedb';}
    if (!store && options.mongo) {store = 'mongo';}
    switch (store) {
        case 'memory':
            store = require('./lib/stores/memory')();
            break;
        case 'nedb':
            store = require('./lib/stores/nedb')(options.nedb);
            break;
        case 'mongo':
            store = require('./lib/stores/mongo')(options.mongo);
            break;
    }
    if (!store) {
        throw new VError('store option is mandatory');
    }

    //prepare sanitizer configuration
    sanitizer = options.sanitizer;
    if (!sanitizer) {
        sanitizer = require('./lib/sanitizer')(store);
    }

    // prepare password checker
    passwordChecker = options.passwordChecker;
    if (!passwordChecker) {
        passwordChecker = 'salt';
    }
    switch (passwordChecker) {
        case 'salt':
        case 'sha1':
            passwordChecker = require('./lib/password/salt')();
            break;
        case 'plain':
        case 'plaintext':
            passwordChecker = require('./lib/password/plain')();
            break;
    }
    if (!passwordChecker) {
        throw new VError('passwordChecker option is mandatory');
    }

    passport = options.passport;
    if (!passport) {
        passport = require('./lib/passport')(store, passwordChecker);
    }

    fixtures = require('./lib/fixtures')(store, sanitizer, passwordChecker);
    if (options.data) {
        // we don't care about async loading
        fixtures.loadFixtures(options.data, function (err) {
            if (err) {debug(err);}
        });
    }


    // Template engine configuration
    // -----------------------------
    //
    // Use Nunjuck internally.
    // We don't rely on Express render system as we want the module to be
    // reusable.
    // It is still possible to override templates and even engine through
    // configuration.
    var nunjucksLoader = _.map(options.views, function (directory) {
        return new nunjucks.FileSystemLoader(directory);
    });
    var nunjucksEnv = new nunjucks.Environment(nunjucksLoader, {
                                    autoescape: true,
                                    watch: !options.cache
                                });
    // A reusable function to render a Nunjuck template/partial.
    // This should be recursive.
    function partial(name, data) {
        if (typeof(data.partial) === 'undefined') {
            data.partial = partial;
        }

        var tmpl = nunjucksEnv.getTemplate(name);
        return tmpl.render(data);
    }
    // Render a template.
    function render(res, template, data) {
        // make global values available
        info = _.extend({}, res.locals, data || {});
        return res.send(partial(template, info));
    }

    return require('./lib/router')(sanitizer, store, passwordChecker, passport, render);

};
