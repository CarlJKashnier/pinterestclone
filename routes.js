var User = require('./users.js');
var mongo = require('mongodb');
require('./passport.js');
module.exports = function(app, passport) {

    app.get('/', function(req, res) {
      if (req.user === undefined){
                  res.render('index.ejs', {
                  user: null,
                });
              } else {
                res.render('index.ejs', {
                user: req.user,
              });
              }
    });
    app.get('/About', function(req, res) {
      if (req.user === undefined){
                  res.render('about.ejs', {
                  user: null,
                });
              } else {
                res.render('about.ejs', {
                user: req.user,
              });
              }
    });

    
    app.get('/Manage/:uid', function(req, res) {
      if (req.user === undefined){
                  res.render('about.ejs', {
                  user: null,
                });
              } else {
                res.render('about.ejs', {
                user: req.user,
              });
              }
    });


    app.get('/auth/twitter', passport.authenticate('twitter'));

    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect: '/',
            failureRedirect: '/'
        }));

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/');
}
