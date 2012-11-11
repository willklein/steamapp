var readGroup = function(data) {
    var steamID64;
    var group = data.memberList;
    var groupDetails = group.groupDetails && group.groupDetails[0];
    var members = (group.members && group.members[0].steamID64) || [];
    var membersResult = [];

    for (var i in members) {
        steamID64 = members[i];

        membersResult.push({
            steamID64: steamID64
        });
    }
//
    return {
        groupID64: group.groupID64[0],
        groupName: groupDetails.groupName[0],
        groupURL: groupDetails.groupURL[0],
        avatarIcon: groupDetails.avatarIcon[0],
        members: membersResult
    };
};

module.exports = readGroup;