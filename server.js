var express = require('express'),
    mongoose = require('mongoose'),
    _ = require('underscore'),
    Game = require('./models/game'),
    app = express();

app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.static(__dirname + '/public'));
    app.use(express.bodyParser());
    app.use(app.router);
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

//connect to the db
mongoose.connect('mongodb://nodejitsu_nko3-hartfordjs:9aa90f39or8sli4vqocalti4t1@ds039257.mongolab.com:39257/nodejitsu_nko3-hartfordjs_nodejitsudb5976839638');
//mongoose.connect('mongodb://localhost/hartfordJS');

app.get('/', function(req, res) {
    Game.find({}, function(err, games) {
        res.render('index', {games: games} );
    });
});

app.listen(8000);