const platform = require('connect-platform');
const instance = require('./instance');

const cache = require('./cache/redis');
const formater = require('./util/formater');

const { hasServerSetProperties } = require('./util/checks');

const { normalize_arrays } = require('./util/normalize');

platform.core.node({
  path: '/firestore/set',
  public: false,
  inputs: ['doc', 'data'],
  outputs: ['res'],
  controlOutputs: ['no_connection', 'bad_input'],
}, (inputs, output, control) => {
  if (instance) {
    try {
      normalize_arrays(inputs.data);
      
      instance
        .doc(inputs.doc)
        .set(inputs.data)
        .then(res => {
          const key = formater.removeTrailingSlashes(inputs.doc);

          const promises = [ res ];
          if( hasServerSetProperties(inputs.data) ) {
            promises.push(
              cache.del(key)
            );
          } else {
            promises.push(
              cache.jset(key, { _id: inputs.id, ...inputs.data })
            );
          }
          
          const components = formater.getComponents(key);
          promises.push(
            cache.del(components.collection)
          );

          return Promise.all(promises);
        }).then((res) => {
          output('res', res[0]);
        });
    } catch(error) {
      console.log(error);
      control('bad_input');
    }
  }
  else control('no_connection');
});
