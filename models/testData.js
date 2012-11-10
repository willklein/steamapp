var mongoose = require('mongoose'),
	_ = require('underscore'),
	Player = require('./player'),
	Group = require('./group'),
	Game = require('./game');

var player, group, game;

//local 
//mongoose.connect('mongodb://localhost/hartfordJS');

//remote
mongoose.connect('mongodb://nodejitsu_nko3-hartfordjs:9aa90f39or8sli4vqocalti4t1@ds039257.mongolab.com:39257/nodejitsu_nko3-hartfordjs_nodejitsudb5976839638');

//games

Game.remove({}, function(err) { 
   console.log('all games removed');
});

Group.remove({}, function(err) { 
   console.log('all groups removed');
});

Player.remove({}, function(err) { 
   console.log('all players removed');
});

new Game({
    appID: "8930",
    gameName: "Sid Meier's Civilization V",
    logo: "http://media.steampowered.com/steamcommunity/public/images/apps/8930/2203f62bd1bdc75c286c13534e50f22e3bd5bb58.jpg"
}).save();

new Game({
    appID: "49520",
    gameName: "Borderlands 2",
    logo: "http://media.steampowered.com/steamcommunity/public/images/apps/49520/86b0fa5ddb41b4dfff7df194a017f3418130d668.jpg"
}).save();

new Game({
    appID: "730",
    gameName: "Counter-Strike: Global Offensive",
    logo: "http://media.steampowered.com/steamcommunity/public/images/apps/730/d0595ff02f5c79fd19b06f4d6165c3fda2372820.jpg"
}).save();

new Game({
    appID: "57300",
    gameName: "Amnesia: The Dark Descent",
    logo: "http://media.steampowered.com/steamcommunity/public/images/apps/57300/75b8a82acfb05abda97977ac4eb5af20e0dcf01e.jpg"
}).save();

// groups

new Group({
    groupID64: "103582791433743637",
    groupName: "HartfordJS",
    groupURL: "hartfordjs",
    avatarIcon: "http://media.steampowered.com/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg",
    members: [
        {
            steamID64: "76561197972886336"
        }
    ]
}).save();

//playes
new Player({
    steamID64: "76561197972886336",
    steamID: "WillSci",
    customURL: "willscience",
    avatarIcon: "http://media.steampowered.com/steamcommunity/public/images/avatars/a6/a6340d219beb553b9679d18a7b229620c59c39ad.jpg",
    games: [
        {
            appID: "8930"
        }
    ],

    groups: [
        {
            groupID64: "103582791433743637"
        }
    ]  
}).save();