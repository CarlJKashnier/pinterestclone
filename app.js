//Heroku powerful-coase-10378

var dotenv = require('dotenv').config();
var express = require('express');
var app = express();
var mongo = require('mongodb');
var passport = require('passport');
var mongoose = require('mongoose');
var session = require('express-session');
var bodyParser = require('body-parser');
var MongoStore = require('connect-mongostore')(session);
var path = require("path");
require('./passport.js');

mongoose.connect(process.env.MONGODB_URI,{authMechanism: 'ScramSHA1'});


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    cookie: {
        maxAge: 691200000
    },
    store: new MongoStore({
        mongooseConnection: mongoose.connection
      }),
    secret: 'anystringoftext',
    saveUninitialized: true,
    resave: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'ejs');
require('./routes.js')(app, passport);
require('./passport.js')(passport);

    app.use(express.static(__dirname + '/public/'));
var server = app.listen(process.env.PORT || 8888);
console.log("Server running on port: " + (process.env.PORT || 8888));
//Seeing if Git works
