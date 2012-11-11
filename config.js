var express = require('express'),
    engine = require('ejs-locals'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    SteamStrategy = require('passport-steam').Strategy,
    MongoStore = require('connect-mongo')(express);

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
            profile.identifier = identifier;
            profile.steamID64 = identifier.substring(identifier.lastIndexOf('/') + 1);

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
        app.use(express.cookieParser()),
        app.use(express.session({
          secret: 'EWFEWFFfEWFFEWFEFWEF',
          maxAge: new Date(Date.now() + 3600000),
          store: new MongoStore({mongoose_connection: mongoose.connections[0] })
        }));
        app.use(express.bodyParser());
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(app.router);
        app.use(express.static(__dirname + '/public'));
    });
};