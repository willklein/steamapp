var mongoose = require('mongoose');
var CacheSchema = new mongoose.Schema({
    url: String,
    body: String
});

module.exports = mongoose.model('Cache', CacheSchema);