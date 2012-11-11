var request = require('request');
var mongoose = require('mongoose');

var CacheSchema = new mongoose.Schema({
    url: String,
    body: String
});

var Cache = mongoose.model('Cache', CacheSchema);

module.exports = function(url, cb){
    Cache.findOne({url: url}, function(err, results){
        if (err || !results){
            request(url, function(err, data){
                new Cache({
                    url: url,
                    body: data.body
                }).save();

                cb.call(null, err, data)
            });
        } else {
            cb.call(null, null, {body: results.body });
        }
    });
};