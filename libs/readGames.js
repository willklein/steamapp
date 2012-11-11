var readGames = function(data) {
    var game, games;
    var gamesList = data.gamesList;
    var gamesResult = [];

    if (gamesList.error){
        return {
            steamID64: gamesList.steamID64[0],
            games: gamesResult
        };
    }
    games = (gamesList.games[0] && gamesList.games[0].game) || [];

    
    if (games.length === undefined) {
        games = [games];
    }
    
    for (var i in games) {
        game = games[i];

        gamesResult.push({
            appID: game.appID[0],
            hoursLast2Weeks: (game.hoursLast2Week && game.hoursLast2Weeks[0]) || '0.0',
            hoursOnRecord: (game.hoursOnRecord && game.hoursOnRecord[0]) || '0.0'
        });
    }

    return {
        steamID64: gamesList.steamID64[0],
        games: gamesResult
    };
};

module.exports = readGames;