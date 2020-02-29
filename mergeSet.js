const platform = require('connect-platform');
const instance = require('./instance');

const cache = require('./cache/redis');
const formater = require('./util/formater');

function merge(originalObject, newObject) {
  console.log(originalObject);
  console.log(newObject);
  return {
    ...originalObject,
    ...newObject
  };
}

platform.core.node({
  path: '/firestore/mergeSet',
  public: false,
  inputs: ['doc', 'data'],
  outputs: ['res'],
  controlOutputs: ['no_connection', 'bad_input'],
}, (inputs, output, control) => {
  if (instance) {
    try {
      instance
        .doc(inputs.doc)
        .set(inputs.data, {merge: true})
        .then(res => {
          const key = formater.removeTrailingSlashes(inputs.doc);

          cache.hjget(key, 'get')
          .then((res) => {
            if(res == null) {
              const components = key.split("/");
              const id = components.pop();
              const collection = components.join("/");

              platform.call('/firestore/get', {
                collection: collection,
                id: id
              }).then((res) => {
                cache.hjset(key, 'get', merge(res.data, inputs.data));
              });
            } else {
              cache.hjset(key, 'get', merge(res, inputs.data));

              return Promise.reject('Result from cache');
            }

            return instance
            .collection(inputs.collection)
            .doc(inputs.id)
            .get();
          });

          output('res', res);
        });
    } catch(error) {
      console.log(error);
      control('bad_input');
    }
  }
  else control('no_connection');
});
