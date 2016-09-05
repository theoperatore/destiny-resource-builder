'use strict';

let base = 'https://www.bungie.net/platform/destiny';
let xur = `${base}/advisors/xur/?definitions=true`;
let player = `${base}/searchDestinyPlayer/%t/%m`;
let stats = `${base}/%t/Account/%m/Summary/?definitions=true`;
let character = `${base}/Stats/%t/%m/%c/?definitions=true`;
let activities = `${base}/%t/Account/%m/Character/%c/Activities?definitions=true`;

function clean(str) {
  return str
    .trim()
    .replace(/\'/g,'')
    .replace(/\"/g, '');
}

exports.getActivityUrl = function getActivityUrl(accountType, membershipId, character) {
  return activities
    .replace('%t', accountType)
    .replace('%m', clean(membershipId))
    .replace('%c', clean(character));
};

exports.getCharacterUrl = function getCharacterUrl(accontType, membershipId, characterId) {
  return character
    .replace('%t', accountType)
    .replace('%m', clean(membershipId))
    .replace('%c', clean(character));
}

exports.getPlayerUrl = function getPlayerUrl(accountType, membershipId) {
  return player
    .replace('%t', accountType)
    .replace('%m', clean(membershipId));
};

exports.getStatsUrl = function getStatsUrl(accountType, membershipId) {
  return stats
    .replace('%t', accountType)
    .replace('%m', clean(membershipId));
}

exports.getXurUrl = function getXurUrl() {
  return xur;
}
