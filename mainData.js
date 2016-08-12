var mongoose = require('mongoose');
var mainSchema = mongoose.Schema({
        listOfUsers: Array
});

module.exports = mongoose.model('main', mainSchema);
