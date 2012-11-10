var mongoose = require('mongoose');

var game = new Schema({
	appID  : String
});

var group = new Schema({
	groupID64  : String
});

var PlayerSchema = new mongoose.Schema({
	steamID64: String,
	steamID: String,
	customURL: String
	avatarIcon: String
	games: [game],
	groups: [group]
});

module.exports = mongoose.model('Player', PlayerSchema);

/*{
    "steamID64": "76561197972886336",
    "steamID": "WillSci",
    "customURL": "willscience",
    "avatarIcon": "http://media.steampowered.com/steamcommunity/public/images/avatars/a6/a6340d219beb553b9679d18a7b229620c59c39ad.jpg",
    // more fields
    
    "games": [
        {
            "appID": "8930"
        },
        {
            "appID": "49520"
        }
    ],

    "groups": [
        {
            "groupID64": "103582791429570843"
        },
        {
            "groupID64": "103582791429729126"
        }
    ]  
}*/