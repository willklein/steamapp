var readGames = function(data) {
    var gamesList = data.gamesList;
    var games = (gamesList.games && gamesList.games.game) || [];
    var gamesResult = [];
    
    for (var i in games) {
        game = games[i];

        gamesResult.push({
            appID: game.appID.toString(),
            hoursLast2Weeks: game.hoursLast2Weeks || 0,
            hoursOnRecord: game.hoursOnRecord || 0
        });
    }

    return {
        steamID64: gamesList.steamID64.toString(),
        games: gamesResult
    };
};

module.exports = readGames;