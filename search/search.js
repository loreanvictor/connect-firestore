const platform = require('connect-platform');
const instance = require('../instance');


platform.core.node({
  path: '/firestore/search',
  public: false,
  inputs: ['collection'],
  outputs: ['query'],
  controlOutputs: ['no_connection'],
}, (inputs, output, control) => {
  if (instance) {
    output('query',
      {
        firestore: instance.collection(inputs.collection),
        cache: {
          collection: inputs.collection
        }
      }
    );
  }
  else control('no_connection');
});
