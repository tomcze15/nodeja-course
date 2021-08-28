const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');

const pathToProductsJson = path.join(rootDir, 'data', 'products.json');

const getProductsFromFile = (callback) => {
  fs.readFile(pathToProductsJson, (err, fileContent) => {
    if (err) {
      return callback([]);
    }
    return callback(JSON.parse(fileContent));
  });
};

module.exports = class Product {
  constructor(title) {
    this.title = title;
  }

  save() {
    getProductsFromFile((products) => {
      if (products.find((product) => product.title === this.title)) {
        return;
      }

      products.push(this);

      fs.writeFile(pathToProductsJson, JSON.stringify(products), (e) => {
        if (e) {
          products.pop();
        }
      });
    });
  }

  static fetchAll(callback) {
    getProductsFromFile(callback);
  }
};
