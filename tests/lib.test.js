'use strict';

require('localenv');
const test = require('tape');

const createDestinyResource = require('../lib');
const PSN_TYPE = 2;

test('can build output object with character properties', t => {
  t.plan(5);

  createDestinyResource(process.env.DESTINY_API_KEY)
    .loadPlayer('abersoto', PSN_TYPE)
    .getMembershipId()
    .getCharacterIds()
    .getCharacterStats()
    .getResource(output => {
      t.equal(output.membershipId, '4611686018428573870', 'membership ids match');
      t.notEqual(output.characterIds.length, 0, 'found characterIds');
      t.equal(output.characterIds.length, 3, 'found correct number of characterIds');
      t.equal(output.characterStats.length, 3, 'found correct number of characterStats');
      t.ok(output.characterStatsDefinitions, 'found definitions for character stats');
    })
    .catch(t.end);
});
