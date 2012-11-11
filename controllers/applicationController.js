var steamQuery = require('./../libs/steamQuery');


module.exports = function(app){
    app.get('/', function(req, res) {
        var groups;

        // If users is authenticated

        if (req.isAuthenticated()){
            // get Groups
            console.log(req.user);
            steamQuery().player(req.user, function(err, data){
                console.log(data);
                res.render('index', { user: req.user, games: [], players: [] });
            });
        } else {
            res.render('index', { user: null, games: [], players: [] });
        }
    });
};