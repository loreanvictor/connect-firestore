const platform = require('connect-platform');
const instance = require('./instance');


platform.core.node({
  path: '/firestore/insert',
  public: false,
  inputs: ['collection', 'data'],
  outputs: ['id'],
  controlOutputs: ['no_connection', 'bad_input'],
}, (inputs, output, control) => {
  if (instance) {
    let data = inputs.data;
    data = JSON.parse(
      JSON.stringify(Object.assign({}, inputs.data))
    );

    try {
      instance
        .collection(inputs.collection)
        .add(data)
        .then(doc => {
          output('id', doc.id);
        });
    } catch(error) {
      console.log(error);
      control('bad_input');
    }
  }
  else control('no_connection');
});
