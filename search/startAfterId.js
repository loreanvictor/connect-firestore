const platform = require('connect-platform');
const instance = require('../instance');


platform.core.node({
  path: '/firestore/search/startAfterId',
  public: false,
  inputs: ['query', 'id'],
  outputs: ['startedAfter'],
  controlOutputs: ['no_connection'],
}, (inputs, output, control) => {
  if (instance) {
    const query = {
      ...inputs.query,
      afterId: inputs.id
    };

    query.cache['startAfter'] = inputs.id;

    output('startedAfter', query);
  }
  else control('no_connection');
});
