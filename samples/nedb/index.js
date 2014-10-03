var debug         = require('debug')('users:samples:server');

var express       = require('express');     // call express
var app           = express();              // define our app using express
var bodyParser    = require('body-parser');
var cookieParser  = require('cookie-parser');
var methodOverride = require('method-override');
// var session       = require('express-session');
var session       = require('cookie-session');
var flash         = require('connect-flash');
var users         = require('../../index');
var path          = require('path');
var nunjucks      = require('nunjucks');

var resourcesPath = path.join(__dirname, '..', 'common');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// use cookie parser
app.use(cookieParser());
// configure session
app.use(session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'shhhh, very secret'
}));
app.use(methodOverride('_method'));
// override method from body too.
app.use(methodOverride(function(req, res){
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method;
        delete req.body._method;
        return method;
    }
}));
// Add the ability to use flash messages
app.use(flash());

nunjucks.configure(path.join(resourcesPath, 'views'), {
  autoescape: true,
  express   : app
});

app.use('/public', express.static(path.join(resourcesPath, 'public')));

// A simple middleware adding
// flash messages to template context.
// Simply access flash messages as `flash` variable
app.use(function (req, res, next) {
    var messages = {
        error: req.flash('error'),
        success: req.flash('success'),
        info: req.flash('info')
    };
    res.locals.flash  = messages;
    next();
});

var userRouter = users({
  store: 'nedb',
  nedb: {
    filename: path.join(__dirname, 'data')
  },
  data: [
        {id: "julien", username: "julien", password: "pwd", email: "julien@example.com"}
  ],
  // override some default views
  views: [ path.join(resourcesPath, 'views'), path.join(resourcesPath, '/views/users') ]
});

// initialize passport middleware
app.use(userRouter.passport.initialize());
app.use(userRouter.passport.session());
app.use(userRouter);
app.get('/app', userRouter.requireAuthentication(), function (req, res, next) {res.render('dashboard.html', {user: req.user});});
app.get('/', function (req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/app');
    }
    res.render('home.html');
});

module.exports = app;

// START THE SERVER
// =============================================================================
if (!module.parent) {
    var port = process.env.PORT || 8080;        // set our port
    app.listen(port);
    console.log('Magic happens on port ' + port);
}

