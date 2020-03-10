function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

function mergeDeep(target, source) {
  let output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target))
          Object.assign(output, { [key]: source[key] });
        else
          output[key] = mergeDeep(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

function getDotNotationObject(newObject) {
  const returnObject = {};
  const keys = Object.keys(newObject);

  for(let i in keys) {
    const key = keys[i];
    const sliced = key.split('.');

    if(sliced.length > 1) {
      let previousPart = returnObject;
      let referencePart = {};

      for (let j in sliced) {
        j = parseInt(j);
        const slice = sliced[j];
        previousPart[slice] = {};
        
        if(j === (sliced.length - 1)) {
          previousPart[slice] = newObject[key];
        }
        previousPart = previousPart[slice];
      }
      
      delete newObject[key];
    }
  }

  return returnObject;
}

module.exports = function merge(originalObject, newObject, update = false) {
  if(update) {
    const dotNotationObject = getDotNotationObject(newObject);

    return mergeDeep(
      { ...originalObject, ...newObject },
      dotNotationObject
    );
  } else {
    return mergeDeep(originalObject, newObject);
  }
};