var express = require('express'),
    mongoose = require('mongoose'),
    _ = require('underscore'),
    passport = require('passport'),
    Game = require('./models/game'),
    app = express(),
    engine = require('ejs-locals'),
    steamLogin = require('./libs/steamLogin'),
    user = {};

app.configure(function() {
    // use ejs-locals for all ejs templates:
    app.engine('ejs', engine);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
    app.use(express.bodyParser());
    express.cookieParser();
    express.session({ secret: 'keepguessing'});
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));    
});

//connect to the db
mongoose.connect(process.env.DB_URL || 'mongodb://localhost/hartfordJS');

//initialise steam login routes
steamLogin(app, user);

app.get('/', function(req, res) {
    Game.find({}, function(err, games) {
        console.log(user);
        res.render('index', {games: games, user: user} );
    });
});

app.listen(process.env.PORT || 3000);