
const formater = {
  removeTrailingSlashes: function(key) {
    return key.replace(/^\/|\/$/g, '');
  },
  getComponents: function(key) {
    const components = key.split("/");
    const id = components.pop();
    const collection = components.join("/");

    return {
      id: id,
      collection: collection
    }
  },
  format: function(collection, id = "") {
    const collectionWithoutSlash = collection.replace(/^\/|\/$/g, '');
    const idWithoutSlash = id.replace(/^\/|\/$/g, '');

    return collectionWithoutSlash + '/' + idWithoutSlash;
  }
}

module.exports = formater;