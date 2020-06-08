const platform = require('connect-platform');
const instance = require('./instance');

const cache = require('./cache/redis');
const formater = require('./util/formater');

const merge = require('./util/merge');

const { hasServerSetProperties } = require('./util/checks');

const { normalize_arrays } = require('./util/normalize');

platform.core.node({
  path: '/firestore/update',
  public: false,
  inputs: ['collection', 'id', 'data'],
  outputs: [],
  controlOutputs: ['done', 'not_found', 'no_connection', 'bad_input'],
}, (inputs, output, control) => {
  if (instance) {
    try {
      normalize_arrays(inputs.data);

      const key = formater.format(inputs.collection, inputs.id);

      instance
        .collection(inputs.collection)
        .doc(inputs.id)
        .update(Object.assign({}, inputs.data))
        .then(() => cache.jget(key))
        .then((res) => {
          const docObj = formater.getComponents(key);

          let returnPromise = null;
          if(res == null) {
            returnPromise = platform.call('/firestore/get', docObj).then((res) => {
              return cache.jset(key, res.data);
            });
          } else {
            if( hasServerSetProperties(inputs.data) ) {
              returnPromise = cache.del(key);
            } else {
              returnPromise = cache.jset(key, merge(res, inputs.data, true));
            }
          }

          return returnPromise;
        })
        .then(() => {
          cache.del(inputs.collection);
          
          control('done');
        })
        .catch(error => {
          console.log(error);
          control('not_found');
        });
    }
    catch(error) {
      console.log(error);
      control('bad_input');
    }
  }
  else control('no_connection');
});
