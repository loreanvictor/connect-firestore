const platform = require('connect-platform');

const formater = require('../../util/formater');
const cache = require('../redis');

platform.core.node({
  path: '/firestore/cache/expire/collection',
  public: false,
  inputs: ['collection', 'ttl'],
  outputs: [],
  controlOutputs: ['done'],
}, (inputs, output, control) => {
  const key = formater.removeTrailingSlashes(inputs.collection);
  cache.expire(key, inputs.ttl).then(() => {
    control('done');
  });
});
