const platform = require('connect-platform');
const instance = require('./instance');

const cache = require('./cache/redis');
const formater = require('./util/formater');
const deep = require('./util/deep');

platform.core.node({
  path: '/firestore/set',
  public: false,
  inputs: ['doc', 'data'],
  outputs: ['res'],
  controlOutputs: ['no_connection', 'bad_input'],
}, (inputs, output, control) => {
  if (instance) {
    try {
      instance
        .doc(inputs.doc)
        .set(inputs.data)
        .then(res => {
          const key = formater.removeTrailingSlashes(inputs.doc);
          
          const hasTimestamp = deep(inputs.data, (el) => {
            return el.constructor.name === 'ServerTimestampTransform';
          });

          if(hasTimestamp) {
            cache.del(key);
          } else {
            cache.jset(key, { _id: inputs.id, ...inputs.data });
          }
          
          const components = formater.getComponents(key);
          cache.del(components.collection);

          output('res', res);
        });
    } catch(error) {
      console.log(error);
      control('bad_input');
    }
  }
  else control('no_connection');
});
