var xml2json = require('xml2json');
var request = require('request');
var readProfile = require('./readProfile');

var steamCommunity = {
    getProfile: function(customURL) {
        return 'http://steamcommunity.com/id/' + customURL + '/?xml=1';
    },
    getProfileByID64: function(steamID64) {
        return 'http://steamcommunity.com/profiles/' + steamID64 + '/?xml=1';
    },
    getGames: function(customURL) {
        return 'http://steamcommunity.com/id/' + customURL + '/games/?xml=1';
    },
    getFriends: function(customURL) {
        return 'http://steamcommunity.com/id/' + customURL + '/friends/?xml=1';
    }
};

var player = function(playerKey, cb) {
    var url = playerKey.customURL
            ? steamCommunity.getProfile(playerKey.customURL)
            : steamCommunity.getProfileByID64(playerKey.steamID64);
        
    request(url, function(err, data) {
        if (err) {
            cb({ error: "steamCommunity API Error: " + err });
        }
        
        var result = xml2json.toJson(data.body, { object: true });
        var profile = readProfile(result);
        
        cb(null, profile);
    });
};

var steamQuery = function() {
    return {
        player: player
    };
};

// sample usage

var query = steamQuery();

query.player({
    steamID64: '76561197972886336'
//  , customURL: 'willscience'
}, function(err, result) {
    if (err) {
        console.log("Error: " + err);
    }
    
    console.log(result);
});

module.exports = steamQuery;