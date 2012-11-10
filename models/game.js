var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
	appID: String,
	gameName: String,
	logo: String
});

module.exports = mongoose.model('Game', GameSchema);

/*{
    "appID": "8930",
    "gameName": "Sid Meier's Civilization V",
    "logo": "http://media.steampowered.com/steamcommunity/public/images/apps/8930/2203f62bd1bdc75c286c13534e50f22e3bd5bb58.jpg"
}*/