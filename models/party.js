var mongoose = require('mongoose');

var member = new mongoose.Schema({
	steamID64  : String
});

var game = new mongoose.Schema({
	appID  : String
});

var PartySchema = new mongoose.Schema({
	games: [game],
	members: [member]
});

module.exports = mongoose.model('Party', PartySchema);
