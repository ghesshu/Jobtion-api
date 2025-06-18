const getPathByFieldName = (array, ...variables) => {
    const paths = {};
  
    for (const file of array) {
      for (const variable of variables) {
        if (file.fieldname === variable) {
          paths[variable] = file.path;
        }
      }
    }
  
    return paths;
  }

  module.exports = { getPathByFieldName }
  