var xml2json = require('xml2json');
var request = require('request');
var readProfile = require('./readProfile');
var readGames = require('./readGames');
var readFriends = require('./readFriends');

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
    getGamesByID64: function(steamID64) {
        return 'http://steamcommunity.com/profiles/' + steamID64 + '/games/?xml=1';
    },
    getFriends: function(customURL) {
        return 'http://steamcommunity.com/id/' + customURL + '/friends/?xml=1';
    },
    getFriendsByID64: function(steamID64) {
        return 'http://steamcommunity.com/profiles/' + steamID64 + '/friends/?xml=1';
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

var games = function(playerKey, cb) {
    var url = playerKey.customURL
        ? steamCommunity.getGames(playerKey.customURL)
        : steamCommunity.getGamesByID64(playerKey.steamID64);

    request(url, function(err, data) {
        if (err) {
            cb({ error: "steamCommunity API Error: " + err });
        }

        var result = xml2json.toJson(data.body, { object: true });
        var games = readGames(result);

        cb(null, games);
    });
};

var friends = function(playerKey, cb) {
    var url = playerKey.customURL
        ? steamCommunity.getFriends(playerKey.customURL)
        : steamCommunity.getFriendsByID64(playerKey.steamID64);

    request(url, function(err, data) {
        if (err) {
            cb({ error: "steamCommunity API Error: " + err });
        }

        var result = xml2json.toJson(data.body, { object: true });
        var friends = readFriends(result);

        cb(null, friends);
    });
};



var steamQuery = function() {
    return {
        player: player,
        games: games,
        friends: friends
    };
};

// sample usage

//var playerKey = {
//    steamID64: '76561197972886336'
////  , customURL: 'willscience'
//};
//var query = steamQuery();

//query.player(playerKey, function(err, result) {
//    if (err) {
//        console.log("Error: " + err);
//    }
//    console.log(result);
//});

//query.games(playerKey, function(err, result) {
//    if (err) {
//        console.log("Error: " + err);
//    }
//    console.log(result);
//});

//query.friends(playerKey, function(err, result) {
//    if (err) {
//        console.log("Error: " + err);
//    }
//    console.log(result);
//});

module.exports = steamQuery;