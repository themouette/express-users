express-users
=============

[![Build
Status](https://travis-ci.org/themouette/express-users.svg?branch=master)](https://travis-ci.org/themouette/express-users)

`express-users` is a drop in user management middleware.

Just add **login**, **registration**, **profile** and **password reset** in a single line.

``` bash
app.use(require('express-users')({store: 'memory'}));
```

## Stores

`express-users` provides several storage strategies.

* memory
* nedb: provide nedb options via `nedb` option
* mongodb

```
app.use(require('express-users')({
    store: 'nedb'
    nedb: {filename: '/var/data/my-app/users'}
}));

```

It is easy to add others, PRs are welcome.

## Password Hash

Password hashing is something you might want to change, default strategy is hmac
sha1 with a random string.

Available strategies are:

* plaintext
* sha1

## Fixtures

Simply insert fixtures.

```
app.use(require('express-users')({
    store: 'memory'
    data: [
        {username: 'themouette', pwd: '$3cr3t', email: 'mail@domain.ext'}
    ]
}));
```

Fixtures are processed the same as form data.

## Extend templates

Just provide a list of directories where templates are located.
Original templates are located in `views` dir.

```
app.use(require('express-users')({
    store: 'memory'
    views: ['views/layouts', 'views/users']
}));
```

`express-users` uses swig internally, but you can use whatever template engine
you want in your express appication.

## Protect your pages

Protections functions are available directly from user middleware.

## `requireAuthentication`

To go further, user MUST be authenticated

``` javascript
var user = require('express-users')();
app.use(users);
app.get('/my-protected-route',
    users.requireAuthentication()
    function (req, res) {
        res.send('User is authenticated');
    });
```

## `requireSudo`

To go further, user MUST have reauthenticated recently

``` javascript
var user = require('express-users')();
app.use(users);
app.get('/my-protected-route',
    users.requireSudo({
        // sessionLength: 5 * 60 * 1000,
        // message: 'Please provide your password to unlock this feature.',
        //success: 'Your password has been successfuly checked.'
    }),
    function (req, res) {
        res.send('User has proven he knows his password');
    });
```

### `resetSudo`

Reset sudo rights.

``` javascript
app.get('/my-route', users.resetSudo(), function (req, res) {
    res.send('Admin rights has been deactivated');
});
```

## Run samples

``` sh
$ npm run dev
$ npm start
```

## Run tests

``` sh
$ npm test
```
