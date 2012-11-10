var request = require('request');
var cheerio = require('cheerio');

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


var getGameInfo = function(appId, cb){
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
            var $, specs, results;

            if (err){
                cb({ error: 'Something went bad'});
            }

            request('http://store.steampowered.com/app/' + appId, function(err, data){
                if (err){
                    cb({ error: 'Something went bad'});
                }

                $ = cheerio.load(data.body);
                specs = getDetailSpecs($);
                results = {
                    name: getName($),
                    generes: getGeneres($),
                    isMultiplayer: specs.isMultiplayer,
                    isCoop: specs.isCoop,
                    gameIcon: getGameIcon($),
                    metaScore: getMetaScore($) || null
                };

                cb(null, results);
            });
    });
};
//getGameInfo(4920);
//getGameInfo(49520);
//getGameInfo(218040);

module.exports = getGameInfo;