const platform = require('connect-platform');
const instance = require('../instance');

const cache = require('../cache/redis');
const formater = require('../util/formater');

const hash = require('object-hash');

platform.core.node({
  path: '/firestore/search/resolve',
  public: false,
  inputs: ['query'],
  outputs: ['result', 'db_error'],
  controlOutputs: ['not_found', 'no_connection'],
}, (inputs, output, control) => {
  if (instance) {
    const collection = formater.removeTrailingSlashes(inputs.query.cache.collection);
    const h = hash(inputs.query.cache);
    
    cache.hjget(collection, h)
    .then((res) => {
      if(res !== null) {
        output('result', res);
        
        return Promise.reject('Result from cache');
      }
      
      if('afterId' in inputs.query) {
        return platform.call('/firestore/getSnapshot', { collection: collection, id: inputs.query.afterId }).then((res) => {
          if(
            ('control' in res) &&
            res.control === 'not_found'
          ) {
            control('not_found');

            return Promise.reject(1);
          }

          return inputs
          .query
          .firestore
          .startAfter(res.data)
          .get();
        });
      }

      return inputs
        .query
        .firestore
        .get();
    })
    .then(snapshot => {
      let results = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
      return cache.hjset(collection, h, results);
    })
    .then((res) => {
      output('result', res);
    })
    .catch((err) => {
      output('db_error', err.details);
    });
  }
  else control('no_connection');
});
