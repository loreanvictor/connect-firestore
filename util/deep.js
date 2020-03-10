function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

function deep(obj, checkFunc, initial = false) {
  let returnVal = initial;
  Object.keys(obj).forEach(function (k) {
    const el = obj[k];
    
    if( isObject(el) ) {
      returnVal = returnVal || checkFunc(el) || deep(el, checkFunc);
    }

    returnVal = returnVal || checkFunc(el);
  });

  return returnVal;
}

module.exports = deep;