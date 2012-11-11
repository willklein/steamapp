var ent = require('ent');

var readGroup = function(data) {
    var steamID64;
    var group = data.memberList;
    var groupDetails = group.groupDetails;
    var members = (group.members && group.members.steamID64) || [];
    var membersResult = [];

    for (var i in members) {
        steamID64 = members[i];

        membersResult.push({
            steamID64: steamID64.toString()
        });
    }
//
    return {
        groupID64: group.groupID64.toString(),
        groupName: ent.decode(groupDetails.groupName),
        groupURL: groupDetails.groupURL,
        avatarIcon: groupDetails.avatarIcon,
        members: membersResult
    };
};

module.exports = readGroup;