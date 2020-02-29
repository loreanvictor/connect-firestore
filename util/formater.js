
const formater = {
  format: (collection, id) => {
    if (id === undefined) id = "";
    const collectionWithoutSlash = collection.replace(/^\/|\/$/g, '');
    return collectionWithoutSlash + '/' + id;
  }
}

module.exports = formater;