var mongoose = require('mongoose');
var ugSchema = mongoose.Schema({
        userID: String,
        userName:String,
        userContent: Array
});

module.exports = mongoose.model('userGallery', ugSchema);
