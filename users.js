var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    twitter: {
        id: String,
        token: String,
        name: String,
        displayName: String
    }
});

module.exports = mongoose.model('user', userSchema);
