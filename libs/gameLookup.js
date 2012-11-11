var request = require('request');
var req = require('./request');
var cheerio = require('cheerio');
var Cache = require('./../models/cache');

var getGeneres = function($){
    var results = [];
    $('.game_details a').each(function(){
        var $this = $(this);
         if ($this.attr('href').search('store.steampowered.com/genre/') !== -1) {
             results.push($this.text());
         }
    });
    return results;
};

var getName = function($){
    return $('.page_title_area .apphub_AppName').text();
};

var getGameIcon = function($){
    return $('.page_title_area .apphub_AppIcon img').attr('src');
};

var getMetaScore = function($){
    return $('#game_area_metascore').text().trim();
};

var getDetailSpecs = function($){
    var result = {
        isMultiplayer: false,
        isCoop: false
    };
    $('.game_area_details_specs').each(function(){
        $(this).find('.name').each(function(){
            var text = $(this).text();
            if (text === 'Multi-player'){
                result.isMultiplayer = true;
            }
            if (text === 'Co-op'){
                result.isCoop = true;
            }
        });
    });
    return result;
};

var memCache = {};

var parseBody = function(appId, body){
    var $, specs, results;
    $ = cheerio.load(body);
    specs = getDetailSpecs($);
    results = {
        appID: appId,
        name: getName($),
        generes: getGeneres($),
        isMultiplayer: specs.isMultiplayer,
        isCoop: specs.isCoop,
        gameIcon: getGameIcon($),
        metaScore: getMetaScore($) || null
    };
    return results;
};

var getGameInfo = function(appId, cb){
    var storeUrl = 'http://store.steampowered.com/app/' + appId;

    if (memCache[storeUrl]){
        cb.call(null, null, memCache[storeUrl]);
        return;
    }

    Cache.findOne({url: storeUrl}, function(err, cache){
        if (!err && cache){
            var results = parseBody(appId, cache.body);
            memCache[storeUrl] = results;
            cb(null, results);
            return;
        }

        request.post('http://store.steampowered.com/agecheck/app/' + appId,
            {
                form : {
                    snr: '1_agecheck_agecheck__age-gate',
                    ageDay: '1',
                    ageMonth: 'January',
                    ageYear: '1975'
                }
            },
            function(err){
                if (err){
                    cb('Something went bad');
                    return;
                }

                request(storeUrl, function(err, data){
                    if (err){
                        cb('Something went bad');
                        return;
                    }
                    var results = parseBody(appId, data.body);
                    memCache[storeUrl] = results;
                    cb(null, results);
                });
            }
        );
    });
};
//getGameInfo(4920);
//getGameInfo(49520);
//getGameInfo(218040);

module.exports = getGameInfo;