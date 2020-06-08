const deep = require('./deep');

function hasServerSetProperties(data) {
  return deep(
    data,
    el =>
      [
        'ServerTimestampTransform',
        'NumericIncrementTransform',
        'DeleteTransform',
        'ArrayUnionTransform',
        'ArrayRemoveTransform'
      ].includes(el.constructor.name)
  );
}

module.exports.hasServerSetProperties = hasServerSetProperties;