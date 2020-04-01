const platform = require('connect-platform');
const instance = require('../instance');


platform.core.node({
  path: '/firestore/search/limit',
  public: false,
  inputs: ['query', 'limit'],
  outputs: ['limited'],
  controlOutputs: ['no_connection'],
}, (inputs, output, control) => {
  if (instance) {
    const query = {
      ...inputs.query,
      firestore: inputs.query.firestore.limit(parseInt(inputs.limit))
    };

    query.cache['limit'] = parseInt(inputs.limit);
    
    output('limited', query);
  }
  else control('no_connection');
});
