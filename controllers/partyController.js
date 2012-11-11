var steamQuery = require('./../libs/steamQuery')(),
    gameLookup = require('./../libs/gameLookup'),
    async = require('async'),
    Party = require('./../models/party');

var getGames = function(callback){
    steamQuery.games(this, callback);
};
var getPlayerProfile = function(callback){
    steamQuery.player(this, callback);
};

var getGameInfo = function(callback){
    gameLookup(this.appID, callback);
};

var getPlayers = function(callback){
    steamQuery.group(this, callback);
};

var getPlayersFromGroups = function(groupIds, cb){
    var getPlayersFn = [], players = [];
    groupIds.forEach(function(groupId){
        getPlayersFn.push(getPlayers.bind({groupID64: groupId}));
    });

    async.parallel(getPlayersFn, function(err, results){
        results = results || [];

        results.forEach(function(groupData){
            players = players.concat(groupData.members);
        });
        cb(null, players);
    });
};

var getGamesFromPlayers = function(players, cb){
    var called = {}, gamesHash = {}, getGamesFn = [], playersHash = {};

    players.forEach(function(player){
        if (!called[player.steamID64]){
            called[player.steamID64] = true;
            getGamesFn.push(getGames.bind(player));
        }
    });

    async.parallel(getGamesFn, function(err, results){
        results = results || [];

        results.forEach(function(result){
            var playerObj = {};
            playerObj.steamID64 = result.steamID64;
            playerObj.games = {};
            playerObj.gamesCount = 0;

            result.games = result.games || [];
            result.games.forEach(function(game){
                gamesHash[game.appID] = gamesHash[game.appID] || { count: 0, appID: game.appID };
                gamesHash[game.appID].count += 1;
                playerObj.games[game.appID] = game;
                playerObj.gamesCount += 1;
            });

            playersHash[playerObj.steamID64] = playerObj
        });

        cb(null, {gamesHash: gamesHash, playersHash: playersHash});
    });
};

// TODO: Make function not affect data
var getGameData = function(data, cb){
    var games = data.gamesHash, getGameFns = [];

    for (var name in games){
        if (games.hasOwnProperty(name)){
            getGameFns.push(getGameInfo.bind(games[name]))
        }
    }
    console.log('Num of games to lookup', getGameFns.length);
    async.parallel(getGameFns, function(err, results){
        results.forEach(function(game){
            if (!game.isMultiplayer){
                delete data.gamesHash[game.appID];
            } else {
                // mixin
                for (var prop in game){
                    if (game.hasOwnProperty(prop)){
                        data.gamesHash[game.appID][prop] = game[prop];
                    }
                }
            }
        });

        cb(err, data);
    });
};

// TODO: Make function not affect data
var getPlayerInfo = function(data, cb){
    var players = data.playersHash, getPlayerProfileFns = [];

    for (var id in players){
        if (players.hasOwnProperty(id)){
            getPlayerProfileFns.push(getPlayerProfile.bind(players[id]))
        }
    }

    async.parallel(getPlayerProfileFns, function(err, results){
        results.forEach(function(player){
            // mixin
            for (var prop in player){
                if (player.hasOwnProperty(prop)){
                    data.playersHash[player.steamID64][prop] = player[prop];
                }
            }
        });

        cb(err, data);
    });
};

var getViewData = function(data){
    var gamesArr = [], playersArr = [], prop;

    for (prop in data.playersHash){
        if (data.playersHash.hasOwnProperty(prop)){
            playersArr.push(data.playersHash[prop]);
        }
    }

    for (prop in data.gamesHash){
        if (data.gamesHash.hasOwnProperty(prop)){
            gamesArr.push(data.gamesHash[prop]);
        }
    }

    playersArr.sort(function(a, b){
        return b.gamesCount - a.gamesCount;
    });

    gamesArr.sort(function(a, b){
        return b.count - a.count;
    });

    data.players = playersArr;
    data.games = gamesArr;

    return data;
};


module.exports = function(app){

    // http://localhost:3000/party/show/509fea579626e9601b000001
    app.get('/party/show/:id', function(req, res){
        // get party id
        var id = req.params.id;
        var groups, players, viewData;
        var startTime = Date.now();

        // look up party in DB
        Party.findOne({_id: id}, function(err, party){
            // Create member objects with steamId64
            players = party.players || [];
            groups = party.groups || [];

            // create playersArray based on groups and players indexed
            getPlayersFromGroups(groups, function(err, players){

                players = players.concat(players);

                // in parallel get all games people are playing
                getGamesFromPlayers(players, function(err, data){
                    async.parallel([
                        function(callback){
                            // lookup gameData
                            getGameData(data, function(err, data){
                                callback(err, data);
                            });
                        },
                        function(callback){
                            // lookup player info
                            getPlayerInfo(data, function(err, data){
                                callback(err, data);
                            });
                        }
                    ], function(err, results){
                        viewData = getViewData(results[0]);
                        console.log('Show time: ', id, ' ', Date.now() - startTime);
                        res.render('party/show', { user: req.user, groups: groups, data: data });
                    });
                });
            });
        });

    });

    app.post('/party/create', function(req, res){
        // Get All Users of group
//        var groupIds = req.body.groupIds || [];
//        var playerIds = req.body.playerIds || [];
        var steamID64 = req.user.steamID64 || '';

        var groupID64 = req.body.create;
        var party = new Party({
//            groups: groupIds,
            groups: [groupID64],
            steamID64: steamID64
//            players: playerIds
        });

        party.save(function(err){
            if (err) {
                console.log('Save Error:', err);
                return err;
            }
            console.log(party.id);
            res.redirect('/party/show/' + party.id);
        });
    });

    app.get('/party/new', function(req, res) {
        if (req.isAuthenticated()) {
            steamQuery.player(req.user, function(err, data) {
                if (err){
                    console.log(err);
                }
                
                var groups = (data && data.groups) || [];
                res.render('party/new', { user: req.user, groups: groups });
            });
        } else {
            req.redirect('/');
        }
    });

//    app.post('/party/delete', function(req, res){
//        if (req.isAuthenticated() && req.body.id){
//
//            Party.remove({steamID64: req.user.steamID64, _id: req.body.id }, function(err){
//                if (err){
//                    res.end('Error ' + err);
//                } else {
//                    res.end('Removed ' + req.body.id);
//                }
//            });
//        } else {
//            res.end('Not authenticated');
//        }
//    });

    app.get('/party/list', function(req, res){
        if (req.isAuthenticated()){
            Party.find({steamID64: req.user.steamID64}, function(err, data){
                res.send(data);
            });
        } else {
            req.redirect('/');
        }

    });

    app.post('/party/edit', function(req, res){

    });
};