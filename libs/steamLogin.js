var mongoose = require('mongoose'),
    _ = require('underscore'),
    passport = require('passport'),
    SteamStrategy = require('passport-steam').Strategy,
    userProfile;

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
	  userProfile = profile;
      return done(null, profile)
    });
  }
));

var createLoginRoutes =function(app, user) {
	app.get('/auth/openid',
	  passport.authenticate('steam', { failureRedirect: '/' }),
	  function(req, res) {
	  	user = userProfile;
	    res.redirect('/');
	  });

	app.get('/auth/steam/return',
	  passport.authenticate('steam', { failureRedirect: '/' }),
	  function(req, res) {
	  	user = userProfile;
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