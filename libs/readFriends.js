var readFriends = function(data) {
    var steamID64;
    var friendsList = data.friendsList;
    var friends = (friendsList.friends && friendsList.friends.friend) || [];
    var friendsResult = [];

    for (var i in friends) {
        steamID64 = friends[i];

        friendsResult.push({
            steamID64: steamID64.toString()
        });
    }

    return {
        steamID64: friendsList.steamID64.toString(),
        friends: friendsResult
    };
};

module.exports = readFriends;