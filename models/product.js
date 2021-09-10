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
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile((products) => {
      if (this.id) {
        const existingProductIndex = products.findIndex((prod) => prod.id === this.id);
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(pathToProductsJson, JSON.stringify(updatedProducts), (e) => {
          if (e) {
            products.pop();
          }
          console.log(e);
        });
      } else {
        this.id = Math.random().toString();
        if (products.find((product) => product.title === this.title)) {
          return;
        }
        products.push(this);
        fs.writeFile(pathToProductsJson, JSON.stringify(products), (e) => {
          if (e) {
            products.pop();
          }
          console.log(e);
        });
      }
    });
  }

  static fetchAll(callback) {
    getProductsFromFile(callback);
  }

  static findById(id, cb) {
    getProductsFromFile((products) => {
      cb(products.find((p) => p.id === id));
    });
  }
};
