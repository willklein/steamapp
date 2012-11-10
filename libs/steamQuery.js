var xml2json = require('xml2json');
var request = require('request');

var steamCommunity = {
    getProfile: function(customURL) {
        return 'http://steamcommunity.com/id/' + customURL + '/?xml=1';
    },
    getGames: function(customURL) {
        return 'http://steamcommunity.com/id/' + customURL + '/games/?xml=1';
    },
    getFriends: function(customURL) {
        return 'http://steamcommunity.com/id/' + customURL + '/friends/?xml=1';
    }
};

var getCustomURL = function(steamID64) {
    // make API call to get it
    
    return 'willscience';
};


var player = function(playerKey, cb) {
    if (!playerKey.customURL && playerKey.steamID64) {
        playerKey.customURL = getCustomURL(playerKey.steamID64);
    }
    
    request(steamCommunity.getProfile(playerKey.customURL), function(err, data) {
        if (err) {
            cb({ error: "steamCommunity API Error: " + err });
        }
        
        var result = xml2json.toJson(data.body);
        
        cb(null, result);
    });
};

var steamQuery = function() {
    return {
        player: player
    };
};

// sample usage

//var query = steamQuery();
//
//query.player({
//    steamID64: '76561197972886336',
//    customURL: 'willscience'
//}, function(err, result) {
//    if (err) {
//        console.log("Error: " + err);
//    }
//    
//    console.log(result);
//});

module.exports = steamQuery;