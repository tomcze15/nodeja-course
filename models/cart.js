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
      cart.totalPrice += +productPrice;
      fs.writeFile(pathToCartJson, JSON.stringify(cart), (e) => {
        console.log(e);
      });
    });
  }
  // static addProduct(id, price) {
  //   fs.readFile(pathToCartJson, (err, fileContent) => {
  //     let cart = { products: [], totalPrice: 0 };
  //     if (!err) {
  //       cart = JSON.parse(fileContent);
  //     }
  //     const exisitingProdIndex = cart.products.findIndex((item) => item.id === id);
  //     if (exisitingProdIndex !== -1) {
  //       cart.products[exisitingProdIndex].qty += 1;
  //     } else {
  //       cart.products.push({ id, qty: 1 });
  //     }
  //     cart.totalPrice += +price;
  //     fs.writeFile(pathToCartJson, JSON.stringify(cart), (e) => {
  //       console.log(e);
  //     });
  //   });
  // }
};
