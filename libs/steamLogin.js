var mongoose = require('mongoose'),
    _ = require('underscore'),
    passport = require('passport'),
    SteamStrategy = require('passport-steam').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new SteamStrategy({
    returnURL: 'http://hartfordjs.nko3.jit.su/auth/steam/return',
    realm: 'http://hartfordjs.nko3.jit.su/'
  },
  function(identifier, profile, done) {
      process.nextTick(function () {
	  profile.identifier = identifier;
      return done(null, profile)
    });
  }
));

var createLoginRoutes =function(app) {
	app.get('/auth/openid',
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