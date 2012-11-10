var mongoose = require('mongoose');

var member = new Schema({
	steamID64  : String
});

var GroupSchema = new mongoose.Schema({
	groupID64: String,
	groupName: String,
	groupURL: String,
	avatarIcon: String,
	members: [member]
});

module.exports = mongoose.model('Group', GroupSchema);

/*{
    "groupID64": "103582791433743637",
    "groupName": "HartfordJS",
    "groupURL": "hartfordjs",
    "avatarIcon": "http://media.steampowered.com/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg",
    "members": [
        {
            "steamID64": "76561197972886336"
        }
    ]
}
*/