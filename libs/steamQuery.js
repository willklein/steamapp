(function() {
    var xml2json = require('xml2json');
    var request = require('request');
    
    var api = {
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
    
    
    var player = function(steamID64) {
        var request;
        var parser = xml2json.Parser();
        // mock data
        return {
            "steamID64": "76561197972886336",
            "steamID": "WillSci",
            "customURL": "willscience",
            "avatarIcon": "http://media.steampowered.com/steamcommunity/public/images/avatars/a6/a6340d219beb553b9679d18a7b229620c59c39ad.jpg",
            // more fields

            "games": [
                {
                    "appID": "8930"
                },
                {
                    "appID": "49520"
                }
            ],

            "groups": [
                {
                    "groupID64": "103582791429570843"
                },
                {
                    "groupID64": "103582791429729126"
                }
            ]
        };
    };
    
    var steamQuery = function() {
        return {
            player: player
        };
    };
    
    module.exports = steamQuery;
    
}).call(this);