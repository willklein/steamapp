var xml2js = require('xml2js');
var readProfile = require('./readProfile');
var readGames = require('./readGames');
var readGroup = require('./readGroup');
var readFriends = require('./readFriends');
var request = require('./request');

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
    getGroup: function(groupURL) {
        return 'http://steamcommunity.com/groups/' + groupURL + '/memberslistxml';
    },
    getGroupByID64: function(groupID64) {
        return 'http://steamcommunity.com/gid/' + groupID64 + '/memberslistxml';
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
        
        var parser = new xml2js.Parser();
        parser.parseString(data.body, function (err, result) {
            if (err) {
                cb({ error: "xml2js Parser Error: " + err });
            }
            var player = readProfile(result);
            cb(null, player);
        });
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

        var parser = new xml2js.Parser();
        parser.parseString(data.body, function (err, result) {
            if (err) {
                cb({ error: "xml2js Parser Error: " + err });
            }
            var games = readGames(result);
            cb(null, games);
        });
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
        
        var parser = new xml2js.Parser();
        parser.parseString(data.body, function (err, result) {
            if (err) {
                cb({ error: "xml2js Parser Error: " + err });
            }
            var friends = readFriends(result);
            cb(null, friends);
        });
    });
};

var group = function(groupKey, cb) {
    var url = groupKey.groupURL
        ? steamCommunity.getGroup(groupKey.groupURL)
        : steamCommunity.getGroupByID64(groupKey.groupID64);

    request(url, function(err, data) {
        if (err) {
            cb({ error: "steamCommunity API Error: " + err });
        }

        var parser = new xml2js.Parser();
        parser.parseString(data.body, function (err, result) {
            if (err) {
                cb({ error: "xml2js Parser Error: " + err });
            }
            var group = readGroup(result);
            cb(null, group);
        });
    });
};



var steamQuery = function() {
    return {
        player: player,
        games: games,
        group: group,
        friends: friends
    };
};

// sample usage

//var playerKey = {
////    steamID64: '76561197972886336'
////    steamID64: '76561197992317700' // user w/ single game
//    steamID64: '76561197992633349'
////  , customURL: 'willscience'
//};
//var groupKey = {
//    groupID64: '103582791429570843'
////    , groupURL: 'fallbrawlers'
//};
//var query = steamQuery();
//
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

//query.group(groupKey, function(err, result) {
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