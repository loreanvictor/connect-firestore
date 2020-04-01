const platform = require('connect-platform');

const formater = require('../../util/formater');
const cache = require('../redis');

platform.core.node({
  path: '/firestore/cache/expire/doc',
  public: false,
  inputs: ['collection', 'id', 'ttl'],
  outputs: [],
  controlOutputs: ['done'],
}, (inputs, output, control) => {
  const key = formater.format(inputs.collection, inputs.id);
  cache.expire(key, inputs.ttl).then(() => {
    control('done');
  });
});
