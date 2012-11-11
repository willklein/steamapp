var steamQuery = require('./../libs/steamQuery'),
    Party = require('./../models/party');

module.exports = function(app){
    app.get('/', function(req, res) {
        if (req.isAuthenticated()){
            Party.find({steamID64: req.user.steamID64}, function(err, data){
                res.render('index', { user: req.user, parties: data });
            });
        } else {
            res.render('index', { user: null, groups: [] });
        }
    });
};