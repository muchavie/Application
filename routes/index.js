'use strict'

/* Sync Read package.json
*/
let fs = require('fs');
let config = JSON.parse(fs.readFileSync('./package.json'));
console.log(`Version ${config.version} (α)`);


var express = require('express'),
   passport = require('passport'),
    Account = require('../models/account'),
     router = express.Router();

router.get('/', function (req, res) {
    res.render('index', { user : req.user, title : 'Welcome'});
});

router.get('/register', function(req, res) {
    console.log('GET /register')
    res.render('register', {title: 'Register'});
});

router.post('/register', function(req, res, next) {
    console.log('POST /register')
    Account.register(new Account({ username : req.body.username }), req.body.password,
    function(err, account) {
        if (err) {
          return res.render('register', { error : err.message });
        }

        passport.authenticate('local')(req, res, function () {
            req.session.save(function (err) {
                if (err) {
                    return next(err);
                }
                res.redirect('/about');
            });
        });
    });
});


router.get('/login', function(req, res) {
    res.render('login', { user : req.user, title : 'Login', error : req.flash('error')});
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), function(req, res, next) {
    req.session.save(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/about');
    });
});

router.get('/logout', function(req, res, next) {
    req.logout();
    req.session.save(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

router.get('/about', function(req, res, next) {
    if (req.user == null) {
        res.redirect('/');
    } else {
        res.render('about', { title : 'About Me', user : req.user, version : config.version});
    }

});

router.get('/goal', function (req, res, next) {
    res.render('goal', {title : 'Goal', version : config.version});
});

router.get('/plan', function (req, res, next) {
    res.render('plan', {title : 'Plan', version : config.version});
});

router.get('/need', function (req, res, next) {
    res.render('need', {title : 'Need', version : config.version});
});

router.get('/essay', function (req, res, next) {
    res.render('essay', {title : 'Essay', version : config.version});
});

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

module.exports = router;
