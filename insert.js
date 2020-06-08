const platform = require('connect-platform');
const instance = require('./instance');

const cache = require('./cache/redis');
const formater = require('./util/formater');
const deep = require('./util/deep');

const { normalize_arrays } = require('./util/normalize');

const { hasServerSetProperties } = require('./util/checks');

platform.core.node({
  path: '/firestore/insert',
  public: false,
  inputs: ['collection', 'data'],
  outputs: ['id'],
  controlOutputs: ['no_connection', 'bad_input'],
}, (inputs, output, control) => {
  if (instance) {
    try {
      normalize_arrays(inputs.data);

      instance
        .collection(inputs.collection)
        .add(inputs.data)
        .then(doc => {
          const key = formater.format(inputs.collection, doc.id);

          const promises = [ doc ];
          if(! hasServerSetProperties(inputs.data) ) {
            promises.push(
              cache.jset(key, { _id: doc.id, ...inputs.data })
            );
          }

          promises.push(
            cache.del(inputs.collection)
          );

          return Promise.all(promises);
        })
        .then((res) => {
          const doc = res[0];

          output('id', doc.id);
        });
    } catch(error) {
      console.log(error);
      control('bad_input');
    }
  }
  else control('no_connection');
});
