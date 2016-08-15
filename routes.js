var User = require('./users.js');
var mongo = require('mongodb');
var UserGallery = require('./userGallery.js');
var path = require("path");
require('./passport.js');
module.exports = function(app, passport) {

    app.get('/', function(req, res) {
      UserGallery.find({}, function(err,docs){
        if (!err){
          //do stuff
console.log(docs);
var usersToRender = docs.map(function(doc, i){
  return [doc.userName, doc.userID];
});

          if (req.user === undefined){
                      res.render('index.ejs', {
                      user: null,
                      mainPage: usersToRender
                    });
                  } else {
                    res.render('index.ejs', {
                    user: req.user,
                    mainPage: usersToRender
                  });
                  }
                  } else {
          throw err;
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
});

    app.get('/Manage/:uid', function(req, res) {
      console.log(req.user.twitter.id);
UserGallery.findOne({userID: req.user.twitter.id},function(err, gallery){
  if (err) {
      throw err;
    }
    console.log(gallery);
  if (gallery === null){
    res.render('manage.ejs', {
    user: req.user,
    userContent: [['#']]
  });
} else {
    res.render('manage.ejs', {
    user: req.user,
    userContent: gallery.userContent
  });
}
});
    });


    app.get('/Gallery/:uid', function(req, res) {
      console.log(req);
UserGallery.findOne({userID: req.params.uid},function(err, gallery){
  if (err) {
      throw err;
    }
    console.log(gallery);
    res.render('gallery.ejs', {
    user: req.user,
    gallery: gallery
  });
});
    });


    app.post('/api/addToUser', function(req, res) {
console.log(req.body.imgURL);
if(req.body.userID === req.user.twitter.id){
UserGallery.findOne({userID: req.user.twitter.id},function(err, gallery){
  if (err) {
      throw err;
    }
  if (gallery) {
    console.log("Gallery True");
    var uc = gallery.userContent;

    var uid = req.body.userID;
    var usrc = [req.body.imgURL];
    UserGallery.update({"userID": uid},{ $push: { "userContent" : usrc}},{upsert: true, new : true},function(err, model){
      if(err){console.log(err);}
    });


      res.send({status: "you good"});
  } else {
    console.log("Gallery not true");
var newgallery = new UserGallery();
newgallery.userName = req.user.twitter.displayName;
newgallery.userID = req.user.twitter.id;
newgallery.userContent = [[req.body.imgURL]];
newgallery.save();
    res.send({status: "you good"});
}});
}
});


app.post('/api/delFromUser', function(req, res) {
console.log(req.body.imgURL);
if(req.body.userID === req.user.twitter.id){
UserGallery.findOne({userID: req.user.twitter.id},function(err, gallery){
if (err) {
  throw err;
}
if (gallery) {
console.log("Gallery True");
var uc = gallery.userContent;

var uid = req.body.userID;
var usrc = [req.body.imgURL];
UserGallery.update({"userID": uid},{ $pull: { "userContent" : usrc}},{upsert: true, new : true},function(err, model){
  if(err){console.log(err);}
});


  res.send({status: "you good"});
} else {
res.send({status: "Gallery Does not exist, so the image can't"});
}});
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
