var TwitterStrategy = require('passport-twitter').Strategy;
var User = require("./users.js");

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use(new TwitterStrategy({
            consumerKey: process.env.twitter_api_key,
            consumerSecret: process.env.twitter_api_secret,
            callbackURL: process.env.callBackURL
        },


        function(accessToken, refreshToken, profile, callback) {
            process.nextTick(function() {
                User.findOne({
                    'twitter.id': profile.id
                }, function(err, user) {
                    if (err)
                        return callback(error);
                    if (user)
                        return callback(null, user);
                    else {
                      console.log(profile);
                        var newUser = new User();

                        newUser.twitter.id = profile.id;
                        newUser.twitter.token = accessToken;
                        newUser.twitter.name = profile.username;
                        newUser.twitter.displayName = profile.displayName;
                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return callback(null, newUser);
                        });
                    }
                });
                //Add user to the hook into mainData

            });
        }));
};
