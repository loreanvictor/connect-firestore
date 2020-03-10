const platform = require('connect-platform');
const instance = require('./instance');

const cache = require('./cache/redis');
const formater = require('./util/formater');
const deep = require('./util/deep');

const Firestore = require('@google-cloud/firestore');

platform.core.node({
  path: '/firestore/insert',
  public: false,
  inputs: ['collection', 'data'],
  outputs: ['id'],
  controlOutputs: ['no_connection', 'bad_input'],
}, (inputs, output, control) => {
  if (instance) {
    try {
      instance
        .collection(inputs.collection)
        .add(inputs.data)
        .then(doc => {
          const key = formater.format(inputs.collection, doc.id);
          
          const hasTimestamp = deep(inputs.data, (el) => {
            return el.constructor.name === 'ServerTimestampTransform';
          });

          if(! hasTimestamp) {
            cache.jset(key, { _id: doc.id, ...inputs.data });
          }

          cache.del(inputs.collection);

          output('id', doc.id);
        });
    } catch(error) {
      console.log(error);
      control('bad_input');
    }
  }
  else control('no_connection');
});
