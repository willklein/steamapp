var express = require('express'),
    mongoose = require('mongoose'),
    _ = require('underscore'),
    passport = require('passport'),
    Game = require('./models/game'),
    Player = require('./models/player'),
    app = express(),
    engine = require('ejs-locals'),
    steamLogin = require('./libs/steamLogin');

app.configure(function() {
    // use ejs-locals for all ejs templates:
    app.engine('ejs', engine);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
    app.use(express.cookieParser('keyboard cat'));
    app.use(express.session());
    app.use(express.bodyParser());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

//connect to the db
mongoose.connect(process.env.DB_URL || 'mongodb://localhost/hartfordJS');

//initialise steam login routes
steamLogin(app);

app.get('/', function(req, res) {
    var user = req.user;
    Game.find({}, function(err, games) {
        Player.find({}, function(err, players) {
            res.render('index', {games: games, players: players, user: user} );
        });
    });
});

app.listen(process.env.PORT || 3000);