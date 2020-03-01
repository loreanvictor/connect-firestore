const platform = require('connect-platform');
const instance = require('./instance');

const cache = require('./cache/redis');
const formater = require('./util/formater');

platform.core.node({
  path: '/firestore/get',
  public: false,
  inputs: ['collection', 'id'],
  outputs: ['data'],
  controlOutputs: ['not_found', 'no_connection'],
}, (inputs, output, control) => {
  if (instance) {
    const key = formater.format(inputs.collection, inputs.id);

    cache.jget(key)
    .then((res) => {
      if(res != null) {
        if(res == cache.CONSTANTS.NONE_EXISTING) {
          control('not_found');
        } else {
          output('data', res);
        }
        
        return Promise.reject('Result from cache');
      }

      return instance
      .collection(inputs.collection)
      .doc(inputs.id)
      .get();
    })
    .then(snapshot => {
      if (snapshot.exists) {
        const data = { _id: inputs.id, ...snapshot.data() };
        return cache.jset(key, data);
      } else {
        return cache.markMissing(key);
      }
    })
    .then((data) => {
      if(data == cache.CONSTANTS.NONE_EXISTING) {
        control('not_found');
      } else {
        output('data', data);
      }
    })
    .catch((err) => {
      console.error(err);
    });
  }
  else control('no_connection');
});
