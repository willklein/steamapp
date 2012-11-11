var Player = require('./../models/player'),
    Game = require('./../models/game');

module.exports = function(app){
    app.get('/', function(req, res) {
        var user = req.user;
        Game.find({}, function(err, games) {
            Player.find({}, function(err, players) {
                res.render('index', {games: games, players: players, user: user} );
            });
        });
    });
};