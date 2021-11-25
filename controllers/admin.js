const mongodb = require('mongodb');
const Product = require('../models/product');

const ObjectId = mongodb.ObjectId;

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res) => {
  const {
    title, imageUrl, price, description
  } = req.body;

  const { _id } = req.user;

  const product = new Product(title, price, description, imageUrl, null, _id);

  product.save()
    .then(result => {
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res) => {
  const editMode = (req.query.edit === 'true');
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if(!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product
      });
    })
    .catch(err => console.log(err));
  return null;
};

exports.postEditProduct = (req, res) => {
  const { productId, title, price, imageUrl, description } = req.body;

  const product = new Product(
    title,
    price,
    description,
    imageUrl,
    new ObjectId(productId)
  );

  product
    .save()
    .then(result => {
      console.log('UPDATED PRODUCT!');
      res.redirect('/admin/prodcuts');
    })
    .catch(err => console.log(err));

  res.redirect('/admin/products');
};

exports.getProducts = (req, res) => {
  Product.fetchAll()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      })
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res) => {
  const {productId} = req.body;
  Product.deleteById(productId)
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err))
};
