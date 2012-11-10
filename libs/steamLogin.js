var mongoose = require('mongoose'),
    _ = require('underscore'),
    passport = require('passport'),
    Player = require('../models/player'),
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
	  Player.findOne({'steamID64': steamID64}, function(err, player) {
	    if(player) {
	    	return done(null, player);
	    } else {
	    	player = new Player({steamID64: steamID64});
	  		player.save();
	  		return done(null, player);
	    }
	  });      
    });
  }
));

var createLoginRoutes =function(app) {
	app.get('/login',
	  passport.authenticate('steam', { failureRedirect: '/' }),
	  function(req, res) {
	    res.redirect('/');
	  });

	app.get('/auth/steam/return',
	  passport.authenticate('steam', { failureRedirect: '/' }),
	  function(req, res) {
	    res.redirect('/');
	  });

	app.get('/logout', function(req, res){
	  req.logout();
	  res.redirect('/');
	});
	
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/')
}    

module.exports = createLoginRoutes;