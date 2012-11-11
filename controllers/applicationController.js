var steamQuery = require('./../libs/steamQuery');

module.exports = function(app){
    app.get('/', function(req, res) {
        if (req.isAuthenticated()){
            steamQuery().player(req.user, function(err, data){
                var groups = (data && data.groups) || [];
                if (err){
                    console.log(err);
                }
                res.render('index', { user: req.user, groups: groups });
            });
        } else {
            res.render('index', { user: null, groups: [] });
        }
    });
};