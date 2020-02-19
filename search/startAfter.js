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
    output('startedAfter', inputs.query.startAfter(inputs.snapshot));
  }
  else control('no_connection');
});
