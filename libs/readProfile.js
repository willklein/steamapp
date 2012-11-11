var readGroups = function(data) {
    var group;
    var groups = data.group || [];
    var result = [];
    
    for (var i in groups) {
        group = groups[i];
        
        if (!group.groupName || !group.groupURL) {
            continue;
        }
        
        result.push({
            groupID64: group.groupID64[0],
            groupName: group.groupName[0],
            groupURL: group.groupURL[0],
            avatarIcon: group.avatarIcon[0]
        });
    }
    
    return result;
};

var readProfile = function(data) {
    var profile = data.profile;
    
    return {
        steamID64: profile.steamID64[0],
        customURL: profile.customURL[0],
        steamID: profile.steamID[0],
        avatarIcon: profile.avatarIcon[0],
        privacyState: profile.privacyState[0],
        steamRating: profile.steamRating[0],
        hoursPlayed2Wk: profile.hoursPlayed2Wk[0],
        groups: readGroups(profile.groups[0])
    };
};

module.exports = readProfile;