const platform = require('connect-platform');
const instance = require('../instance');


platform.core.node({
  path: '/firestore/search/filter',
  public: false,
  inputs: ['query', 'field', 'op', 'value'],
  outputs: ['filtered'],
  controlOutputs: ['no_connection'],
}, (inputs, output, control) => {
  if (instance) {
    const query = {
      ...inputs.query,
      firestore: inputs.query.firestore.where(inputs.field, inputs.op, inputs.value)
    };

    if( ! ( 'where' in query.cache ) ) query.cache.where = [];

    query.cache.where.push([inputs.field, inputs.op, inputs.value]);

    output('filtered', query);
  }
  else control('no_connection');
});
