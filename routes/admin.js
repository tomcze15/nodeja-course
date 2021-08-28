const express = require('express');
const path = require('path');
const rootDir = require('../util/path');

const rotuer = express.Router();

const products = [];

rotuer.get('/add-product', (req, res, next) => {
  res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});

rotuer.post('/add-product', (req, res, next) => {
  products.push({ title: req.body.title });
  res.redirect('/');
});

module.exports.routes = rotuer;
module.exports.products = products;
