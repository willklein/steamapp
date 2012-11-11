var steamQuery = require('./../libs/steamQuery')();
var async = require('async');

var getGames = function(callback){
    steamQuery.games(this, function(err, data){
        callback(err, data);
    });
};

module.exports = function(app){
    app.get('/party/show/:id', function(){
        // get users and games
        // get updated list of games from the players
    });

    app.post('/party/new', function(req, res){
        // Get All Users of group
        var groupID64 = req.body.groupId;
        var getGamesFns = [];
        steamQuery.group({
            groupID64: groupID64
        }, function(err, data){
            console.log(data);
            data.members.forEach(function(player){
                getGamesFns.push(getGames.bind(player));
            });
            async.parallel(getGamesFns, function(err, results){
                console.log(results);
            });
        });
        // Get All games form users
        // Save users and games


        // redirect to show based off id from database
    });

    app.post('/party/edit', function(err, data){

    });
};
