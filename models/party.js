var mongoose = require('mongoose');

//var groups = new mongoose.Schema({
//    groupID64  : String
//});
//
//var players = new mongoose.Schema({
//    steamID64  : String
//});

var PartySchema = new mongoose.Schema({
    name: String,
    groups: [String],
    players: [String],
    steamID64: String
});

module.exports = mongoose.model('Party', PartySchema);