const platform = require('connect-platform');
const instance = require('./instance');


platform.core.node({
  path: '/firestore/getSnapshot',
  public: false,
  inputs: ['collection', 'id'],
  outputs: ['snapshot'],
  controlOutputs: ['not_found', 'no_connection'],
}, (inputs, output, control) => {
  if (instance) {
    instance
      .collection(inputs.collection)
      .doc(inputs.id)
      .get()
      .then(snapshot => {
        if (snapshot.exists) {
          output('snapshot', snapshot);
        }
        else {
          control('not_found');
        }
      });
  }
  else control('no_connection');
});
