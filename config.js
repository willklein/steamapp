var express = require('express'),
    engine = require('ejs-locals'),
    passport = require('passport'),
    SteamStrategy = require('passport-steam').Strategy;


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new SteamStrategy({
        returnURL: process.env.REALM ? process.env.REALM + '/auth/steam/return' : 'http://localhost:3000/auth/steam/return',
        realm: process.env.REALM || 'http://localhost:3000/'
    },
    function(identifier, profile, done) {
        process.nextTick(function () {
            var steamID64 = identifier.substring(identifier.lastIndexOf('/')+1);
            profile.identifier = identifier;

            done(null, profile);
        });
    }
));

module.exports = function(app){
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
};

