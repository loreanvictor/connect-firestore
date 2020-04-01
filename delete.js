const platform = require('connect-platform');
const instance = require('./instance');

const formater = require('./util/formater');
const cache = require('./cache/redis');

platform.core.node({
  path: '/firestore/delete',
  public: false,
  inputs: ['collection', 'id'],
  outputs: [],
  controlOutputs: ['done', 'no_connection'],
}, (inputs, output, control) => {
  if (instance) {
    instance
      .collection(inputs.collection)
      .doc(inputs.id)
      .delete()
      .then((res) => {
        const key = formater.format(inputs.collection, inputs.id);

        cache.markMissing(key)
        .then((res) => {
          cache.del(inputs.collection);
          
          control('done');
        })
        .catch((err) => {
          console.log(err);
        });
      });
  }
  else control('no_connection');
});
