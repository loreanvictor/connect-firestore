const platform = require('connect-platform');
const instance = require('../instance');


platform.core.node({
  path: '/firestore/search/startAfter',
  public: false,
  inputs: ['query', 'snapshot'],
  outputs: ['startedAfter'],
  controlOutputs: ['no_connection'],
}, (inputs, output, control) => {
  if (instance) {
    const query = {
      ...inputs.query,
      firestore: inputs.query.firestore.startAfter(inputs.snapshot)
    };

    query.cache['startAfter'] = inputs.snapshot.id;

    output('startedAfter', query);
  }
  else control('no_connection');
});
