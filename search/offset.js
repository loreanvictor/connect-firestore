const platform = require('connect-platform');
const instance = require('../instance');


platform.core.node({
  path: '/firestore/search/offset',
  public: false,
  inputs: ['query', 'offset'],
  outputs: ['offsetted'],
  controlOutputs: ['no_connection'],
}, (inputs, output, control) => {
  if (instance) {
    const query = {
      firestore: inputs.query.firestore.offset(parseInt(inputs.offset)),
      cache: { ...inputs.query.cache }
    };

    query.cache['offset'] = parseInt(inputs.offset);

    output('offsetted', query);
  }
  else control('no_connection');
});
