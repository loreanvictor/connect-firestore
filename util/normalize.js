function normalize_array(data) {
  for(let k in data) {
    if(Array.isArray(data[k])) {
      data[k] = [ ...data[k] ];
    } else if(typeof data[k] === 'object' && data[k] !== null) {
      normalize_array(data[k]);
    }
  }
}

module.exports.normalize_arrays = function(data) {
  normalize_array(data);
}