const platform = require('connect-platform');
const instance = require('./instance');
const client = require('./cache/redis');
const formater = require('./util/formater');

platform.core.node({
  path: '/firestore/get',
  public: false,
  inputs: ['collection', 'id'],
  outputs: ['data'],
  controlOutputs: ['not_found', 'no_connection'],
}, (inputs, output, control) => {
  if (instance) {
    const key = formater.format(inputs.collection, inputs.id);

    client.hjget(key, 'get')
    .then((res) => {
      if(res != null) {
        output('data', res);

        return Promise.reject('Result from cache');
      }

      return instance
      .collection(inputs.collection)
      .doc(inputs.id)
      .get();
    }).then(snapshot => {
      if (snapshot.exists) {
        client.hjset(key, 'get', snapshot.data())
        .then((res) => {
          output('data', snapshot.data());
        })
        .catch((err) => {
          control('Caching error');
          console.error(err);
        });
      } else {
        control('not_found');
      }
    })
    .catch((err) => {
      control('Caching error');
      console.error(err);
    });
  }
  else control('no_connection');
});
