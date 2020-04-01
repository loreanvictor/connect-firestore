const platform = require('connect-platform');
const instance = require('./instance');

platform.core.node({
  path: '/firestore/getInstance',
  public: false,
  inputs: [ ],
  outputs: ['instance'],
  controlOutputs: ['no_connection'],
}, (inputs, output, control) => {
  if (instance) {
    output('instance', instance);
  }
  else control('no_connection');
});
