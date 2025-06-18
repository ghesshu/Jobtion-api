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

  const serviceCharge = (subtotal) => {
    if (subtotal > 50 && subtotal <= 100) {
        return 2.50;
    }
    if (subtotal > 101 && subtotal <= 199) {
        return 5;
    }
    if (subtotal > 199 && subtotal <= 299) {
        return 10;
    }
    if (subtotal > 299) {
        return 15;
    }

    return 0;
}

  module.exports = { getPathByFieldName, serviceCharge }
  