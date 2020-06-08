const platform = require('connect-platform');
const instance = require('./instance');

const cache = require('./cache/redis');
const formater = require('./util/formater');
const merge = require('./util/merge');

const { normalize_arrays } = require('./util/normalize');

const { hasServerSetProperties } = require('./util/checks');

platform.core.node({
  path: '/firestore/mergeSet',
  public: false,
  inputs: ['doc', 'data'],
  outputs: ['res'],
  controlOutputs: ['no_connection', 'bad_input'],
}, (inputs, output, control) => {
  if (instance) {
    try {
      normalize_arrays(inputs.data);
      
      const key = formater.removeTrailingSlashes(inputs.doc);
      const docObj = formater.getComponents(key);
      let firebaseResult = null;
      let refreshData = false;
      instance
        .doc(inputs.doc)
        .set(inputs.data, {merge: true})
        .then(res => {
          firebaseResult = res;

          if( hasServerSetProperties(inputs.data) ) {
            return cache.del(key);
          }

          return true;
        })
        .then(() => {
          return cache.jget(key);
        })
        .then((cacheRes) => {
          if(cacheRes === null) {
            refreshData = true;

            return platform.call('/firestore/get', docObj).then((res) => res.data);
          } else {
            return cacheRes;
          }
        })
        .then ((res) => {
          if(refreshData) {
            return res;
          }

          return cache.jset(key, merge(res, inputs.data));
        })
        .then((res) => {
          return cache.del(docObj.collection);
        }).then((res) => {
          output('res', firebaseResult);
        });
    } catch(error) {
      console.log(error);
      control('bad_input');
    }
  }
  else control('no_connection');
});
