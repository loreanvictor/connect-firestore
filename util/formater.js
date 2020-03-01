
const formater = {
  removeTrailingSlashes: (key) => {
    return key.replace(/^\/|\/$/g, '');
  },
  format: (collection, id = "") => {
    const collectionWithoutSlash = collection.replace(/^\/|\/$/g, '');
    const idWithoutSlash = id.replace(/^\/|\/$/g, '');

    return collectionWithoutSlash + '/' + idWithoutSlash;
  }
}

module.exports = formater;