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
mongoose.connect(process.env.PORT || 'mongodb://localhost/hartfordJS');

app.get('/', function(req, res) {
    Game.find({}, function(err, games) {
        res.render('index', {games: games} );
    });
});

app.listen(process.env.PORT || 3000);