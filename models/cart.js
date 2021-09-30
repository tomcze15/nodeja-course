const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');

const pathToCartJson = path.join(rootDir, 'data', 'cart.json');

module.exports = class Cart {
  static addProduct(id, productPrice) {
    fs.readFile(pathToCartJson, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }

      const existingProductIndex = cart.products.findIndex((prod) => prod.id === id);
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;

      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty += 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice += (+productPrice);
      fs.writeFile(pathToCartJson, JSON.stringify(cart), (e) => {
        console.log(e);
      });
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(pathToCartJson, (err, fileContent) => {
      if (err) {
        return null;
      }

      const updatedCart = { ...JSON.parse(fileContent) };
      const product = updatedCart.products.find((prod) => prod.id === id);

      if (!product) {
        return null;
      }

      updatedCart.products = updatedCart.products.filter((prod) => prod.id !== id);
      updatedCart.totalPrice -= productPrice * product.qty;

      if (updatedCart.totalPrice < 0.01) {
        updatedCart.totalPrice = 0;
      }

      return fs.writeFile(pathToCartJson, JSON.stringify(updatedCart), (e) => {
        console.log(e);
      });
    });
  }

  static getCart(cb) {
    fs.readFile(pathToCartJson, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      if (err) {
        cb(null);
      } else {
        cb(cart);
      }
    });
  }
};
