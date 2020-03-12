const platform = require('connect-platform');

const formater = require('../../util/formater');
const cache = require('../redis');

platform.core.node({
  path: '/firestore/cache/invalidate/collection',
  public: false,
  inputs: ['collection'],
  outputs: [],
  controlOutputs: ['done'],
}, (inputs, output, control) => {
  const key = formater.removeTrailingSlashes(inputs.collection);
  cache.del(key).then(() => {
    control('done');
  });
});
