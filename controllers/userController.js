var passport = require('passport');

module.exports = function(app){
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
};