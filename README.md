# Destiny Resources

I got really fed up with interacting with a REST service and trying to string together different requests to pull some data out of the [Destiny API](https://www.bungie.net/platform/destiny/help/).

What needs to happen to just get character stats is 4 steps:

1. Get the player's `membershipId` by searching for either their `psn` or `gamertag`
2. Use the `membershipId` to query for player summary which yields an array of `characters`
3. For each `characterId` in the previous `characters` array, query another endpoint to get each character's stats
4. Map all of this data to some usable format

The code gets messy really quickly because you most likely want to keep data from the previous calls to build your final output. For instance you might want to remember the player's Bungie.net `displayName` from the player search query, or pick off only select properties from the character stats query. Also, because of the nature of promises, you can only resolve one object, so you must be constantly merging what you want with what exists already, big hassle!

## Fluent API

In my frustration, I *dropped* this:

```javascript
function getCharacterStats(playerName) {
  return getMembershipId(playerName)
    .then(response => {
      return {
        membershipId: extractId(response),
        displayName: extractName(response),
      };
    })
    .then(state => {
      return getPlayerSummary(state)
        .then(summary => {
          return {
            ...state,
            characterIds: extractCharacterIds(summary),
          }
        })
    })
    .then(state => {
      // ... an so on and so forth...
    })
}
```

And instead decided that I'll build up my entire querying response into a single object, then slice n' dice any way I please:

```javascript
const PSN_ACCOUNT_TYPE = 2;
const createDestinyResource = require('dsetiny-resource');

createDestinyResource(process.env.DESTINY_API_KEY)
  .loadPlayer('abersoto', PSN_ACCOUNT_TYPE)
  .getMembershipId()
  .getCharacterIds()
  .getCharacterStats()
  .getCharacterActivities()
  .getResource(resource => {
    console.log(resource.membershipId);              // player membershipId
    console.log(resource.characterIds);              // array of strings
    console.log(resource.characterStats);            // a huge object of characterStats
    console.log(resource.characterStatsDefinitions); // definitions for characterStats hashes
    console.log(resource.characterActivities);            // a huge object of characterActivities
    console.log(resource.characterActivitiesDefinitions); // definitions for characterActivities hashes

    // ... do cool stuff with the all of the data ...
  })
  .catch(err => console.log('A bad thing happened!', err));
```

### NOTE

Resources are queried in a "top down" manner, and since some resources depend upon others (e.g. need membershipId to query for characterIds, etc...) the order in which you build the object request is important.

### Other notes

This is still a *work in progress*! Good luck!

# License

MIT
