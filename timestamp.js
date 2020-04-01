const platform = require('connect-platform');
const Firestore = require('@google-cloud/firestore');

platform.core.node({
  path: '/firestore/server/timestamp',
  public: false,
  inputs: [],
  outputs: ['timestamp'],
  controlOutputs: [],
}, (inputs, output, control) => {
  output('timestamp', Firestore.FieldValue.serverTimestamp());
});
