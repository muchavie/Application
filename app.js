var    express = require('express'),
          path = require('path'),
        logger = require('morgan'),
  cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      passport = require('passport'),
 LocalStrategy = require('passport-local').Strategy,
         flash = require('connect-flash'),
        routes = require('./routes/index'),
         users = require('./routes/users'),
      nunjucks = require('nunjucks'),
           app = express();

//
//   Template Engine
//
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

//
//  EXPRESS Configuration
//
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(flash());
app.use(passport.session());
app.use(express.static('lib'));
app.use(express.static('public'));

//
//  ROUTES
//
app.use('/', routes);

//
// PASSPORT
//
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// MONGOOSE
mongoose.connect('mongodb://localhost/Application');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler - stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler - no stacktrace
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
