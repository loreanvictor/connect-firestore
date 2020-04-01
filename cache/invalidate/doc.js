const platform = require('connect-platform');

const formater = require('../../util/formater');
const cache = require('../redis');

platform.core.node({
  path: '/firestore/cache/invalidate/doc',
  public: false,
  inputs: ['collection', 'id'],
  outputs: [],
  controlOutputs: ['done'],
}, (inputs, output, control) => {
  const key = formater.format(inputs.collection, inputs.id);
  cache.del(key).then(() => {
    control('done');
  });
});
