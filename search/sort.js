const platform = require('connect-platform');
const instance = require('../instance');


platform.core.node({
  path: '/firestore/search/sort',
  public: false,
  inputs: ['query', 'field', 'direction'],
  outputs: ['sorted'],
  controlOutputs: ['no_connection'],
}, (inputs, output, control) => {
  if (instance) {
    let direction = 'asc';
    if ( ['descending', 'desc'].includes(inputs.direction) ) direction = 'desc';

    const query = {
      ...inputs.query,
      firestore: inputs.query.firestore.orderBy(inputs.field, direction)
    };

    if( ! ( 'sort' in query.cache ) ) query.cache.sort = [];
    
    query.cache.sort.push([inputs.field, direction]);
    
    output('sorted', query);
  }
  else control('no_connection');
});
