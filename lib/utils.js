'use strict';

exports.getDestinyResource = function getDestinyResource(apiKey, url) {
  return fetch(url, {
    headers: {
      'X-Api-Key': apiKey,
    },
  }).then(res => res.json());
};
