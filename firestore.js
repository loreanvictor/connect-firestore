const platform = require('connect-platform');
const Firestore = require('@google-cloud/firestore');

platform.core.node({
  path: '/firestore/firestore',
  public: false,
  inputs: [],
  outputs: ['firestore'],
  controlOutputs: [],
}, (inputs, output, control) => {
  output('firestore', Firestore);
});
