var request = require('request');
var memCache = {};
var Cache = require('./../models/cache');

module.exports = function(url, cb){

    if (memCache[url]){
        cb.call(null, null, {body: memCache[url] });
        return;
    }

    Cache.findOne({url: url}, function(err, results){
        if (err || !results){
            request(url, function(err, data){
                new Cache({
                    url: url,
                    body: data.body
                }).save();

                cb.call(null, err, data);
                memCache[url] = data.body;
            });
        } else {
//            console.log('Cache hit', url);
            cb.call(null, null, {body: results.body });
            memCache[url] = results.body;
        }
    });
};