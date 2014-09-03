express-users
=============

`express-users` is a drop in user management middleware.

Just add **login**, **registration**, **profile** and **password reset** in a single line.

``` bash
app.use(require('express-users')({store: 'memory'}));
```

## Stores

`express-users` provides several storage strategies.

* memory
* mongodb

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

## Run samples

``` sh
$ npm run dev
$ npm start
```

## Run tests

``` sh
$ npm test
```
