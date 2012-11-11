var readFriends = function(data) {
    var steamID64;
    var friendsList = data.friendsList;
    var friends = (friendsList.friends && friendsList.friends[0].friend) || [];
    var friendsResult = [];

    for (var i in friends) {
        steamID64 = friends[i];

        friendsResult.push({
            steamID64: steamID64
        });
    }

    return {
        steamID64: friendsList.steamID64[0],
        friends: friendsResult
    };
};

module.exports = readFriends;