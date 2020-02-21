const platform = require('connect-platform');
const instance = require('./instance');


platform.core.node({
  path: '/firestore/set',
  public: false,
  inputs: ['doc', 'data'],
  outputs: ['res'],
  controlOutputs: ['no_connection', 'bad_input'],
}, (inputs, output, control) => {
  if (instance) {
    try {
      instance
        .doc(inputs.doc)
        .set(inputs.data)
        .then(res => {
          output('res', res);
        });
    } catch(error) {
      console.log(error);
      control('bad_input');
    }
  }
  else control('no_connection');
});
