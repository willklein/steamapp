var steamQuery = require('./../libs/steamQuery')(),
    async = require('async'),
    Party = require('./../models/party');

var getGames = function(callback){
    steamQuery.games(this, function(err, data){
        callback(err, data);
    });
};

var getPlayers = function(callback){
    steamQuery.group(this, function(err, data){
        callback(err, data);
    });
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
    var called = {}, games = {}, getGamesFn = [], playersResult = [];

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
                games[game.appID] = games[game.appID] || { count: 0 };
                games[game.appID].count += 1;
                playerObj.games[game.appID] = game;
                playerObj.gamesCount += 1;
            });
            playersResult.push(playerObj);
        });

        cb(null, {games: games, players: playersResult});
    });
};


module.exports = function(app){
    app.get('/party/show/:id', function(req, res){
        // get party id
        var id = req.params.id;
        var groups, players;
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
                    console.log(data);

                    // lookup gameData
                    // Filter

                    // sort games based on how many people are playing each game
                    // sort players based on how many games they have


                    // create data to use when rendering
                    // render page
                    res.render('index', { user: req.user, groups: groups });
                });
            });
        });

    });

    app.post('/party/new', function(req, res){
        // Get All Users of group
        var groupIds = req.body.groupIds || [];
        var playerIds = req.body.playerIds || [];

        var party = new Party({
            groups: groupIds
//            players: playerIds
        });

        party.save(function(err){
            if (err) {
                console.log('Save Error:', err);
                return err;
            }
            res.redirect('/party/show/' + party.id);
        });
    });

    app.post('/party/edit', function(err, data){

    });
};