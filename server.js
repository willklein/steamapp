var express = require('express'),
    mongoose = require('mongoose'),
    _ = require('underscore'),
    passport = require('passport'),
    Game = require('./models/game'),
    app = express(),
    steamLogin = require('./libs/steamLogin');

app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
    app.use(express.bodyParser());
    express.cookieParser()
    express.session({ secret: 'keepguessing'})
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
    Game.find({}, function(err, games) {
        res.render('index', {games: games, user:req.user} );
    });
});

app.listen(process.env.PORT || 3000);