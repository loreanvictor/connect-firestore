const deep = require('./deep');

function hasServerSetProperties(data) {
  return deep(
    data,
    el =>
      [ 'ServerTimestampTransform' ].containers(el.constructor.name)
  );
}

module.exports.hasServerSetProperties = hasServerSetProperties;