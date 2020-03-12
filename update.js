const platform = require('connect-platform');
const instance = require('./instance');

const cache = require('./cache/redis');
const formater = require('./util/formater');
const deep = require('./util/deep');

const merge = require('./util/merge');

platform.core.node({
  path: '/firestore/update',
  public: false,
  inputs: ['collection', 'id', 'data'],
  outputs: [],
  controlOutputs: ['done', 'not_found', 'no_connection', 'bad_input'],
}, (inputs, output, control) => {
  if (instance) {
    try {
      instance
        .collection(inputs.collection)
        .doc(inputs.id)
        .update(Object.assign({}, inputs.data))
        .then(() => {
          const key = formater.format(inputs.collection, inputs.id);

          cache.jget(key)
          .then((res) => {
            const docObj = formater.getComponents(key);

            if(res == null) {
              platform.call('/firestore/get', docObj).then((res) => {
                cache.jset(key, res.data);
              });
            } else {
              const hasTimestamp = deep(inputs.data, el => el.constructor.name === 'ServerTimestampTransform');

              if(hasTimestamp) {
                cache.del(key);
              } else {
                cache.jset(key, merge(res, inputs.data, true));
              }
            }

            return Promise.resolve(0);
          });
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
