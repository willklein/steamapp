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
            groupID64: group.groupID64.toString(),
            groupName: group.groupName,
            groupURL: group.groupURL,
            avatarIcon: group.avatarIcon
        });
    }
    
    return result;
};

var readProfile = function(data) {
    var profile = data.profile;
    
    return {
        steamID64: profile.steamID64.toString(),
        customURL: profile.customURL,
        steamID: profile.steamID,
        avatarIcon: profile.avatarIcon,
        privacyState: profile.privacyState,
        steamRating: profile.steamRating,
        hoursPlayed2Wk: profile.hoursPlayed2Wk,
        groups: readGroups(profile.groups)
    };
};

module.exports = readProfile;