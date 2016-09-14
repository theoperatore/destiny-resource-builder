'use strict';

require('localenv');
const test = require('tape');

const createDestinyResource = require('../lib');
const PSN_TYPE = 2;

test('can build output object with character properties', t => {
  t.plan(8);

  createDestinyResource(process.env.DESTINY_API_KEY)
    .loadPlayer('abersoto', PSN_TYPE)
    .getMembershipId()
    .getCharacterIds()
    .getCharacterStats('warlock')
    .getHistoricalStats('warlock')
    .getResource(output => {

      const defs = output.characterStats.map(c => c.definitions);
      const filtered = defs.filter(d => d);

      t.equal(output.membershipId, '4611686018428573870', 'membership ids match');
      t.notEqual(output.characterIds.length, 0, 'found characterIds');
      t.equal(output.characterIds.length, 3, 'found correct number of characterIds');
      t.equal(output.characterStats.length, 1, 'found correct number of characterStats');
      t.equal(defs.length, 1, 'found correct number of definitions');
      t.equal(filtered.length, 1, 'found all definitions as defined');
      t.equal(output.characterStats[0].character.characterBase.classHash, 2271682572, 'got correct filtered class type');
      t.equal(output.historicalStats.length, 1, 'got correct number of historical stats');
    })
    .catch(t.end);
});
