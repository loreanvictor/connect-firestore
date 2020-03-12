const platform = require('connect-platform');
const instance = require('./instance');

const cache = require('./cache/redis');
const formater = require('./util/formater');
const merge = require('./util/merge');

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

          const docObj = formater.getComponents(key);

          cache.jget(key)
          .then((res) => {
            if(res == null) {
              platform.call('/firestore/get', docObj).then((res) => {
                cache.jset(key, merge(res.data, inputs.data));
              });
            } else {
              cache.jset(key, merge(res, inputs.data));

              return Promise.reject('Result from cache');
            }

            return instance
            .collection(docObj.collection)
            .doc(docObj.id)
            .get();
          });

          cache.del(docObj.collection);
          output('res', res);
        });
    } catch(error) {
      console.log(error);
      control('bad_input');
    }
  }
  else control('no_connection');
});
