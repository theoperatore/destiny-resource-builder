'use strict';

require('es6-promise').polyfill();
require('isomorphic-fetch');

const {
  requestMembershipId,
  requestCharacterIds,
  requestCharacterStats,
  requestXur,
} = require('./service');

module.exports = function create(apiKey, opts) {
  let queue = [];
  let state = {};

  return {
    loadPlayer(accountId, accountType = 2) {
      state = Object.assign({}, state, { accountId, accountType });

      return {
        getResource(fn = () => {}) {
          let newState;
          if (queue.length > 0) {
            return queue.reduce((chain, req) => {
              return chain.then(chainedState => {
                return req(apiKey, chainedState);
              });
            }, Promise.resolve(state))
            .then(newState => {
              state = newState;
              queue.length = 0;
              fn.call(this, newState);
              return newState;
            });
          }

          fn.call(this, state);
          return Promise.resolve(state);
        },

        getMembershipId() {
          queue.push(requestMembershipId);
          return this;
        },

        getCharacterIds() {
          queue.push(requestCharacterIds);
          return this;
        },

        getCharacterStats(...classes) {
          queue.push(requestCharacterStats(classes));
          return this;
        },

        getXur() {
          queue.push(requestXur);
          return this;
        },
      };
    },

    // apply middleware?
    use() {
      return this;
    },
  };
};
