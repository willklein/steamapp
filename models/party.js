var mongoose = require('mongoose');

//var groups = new mongoose.Schema({
//    groupID64  : String
//});
//
//var players = new mongoose.Schema({
//    steamID64  : String
//});

var PartySchema = new mongoose.Schema({
    groups: [String],
    players: [String]
});

module.exports = mongoose.model('Party', PartySchema);