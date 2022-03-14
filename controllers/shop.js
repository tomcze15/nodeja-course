const Product = require('../models/product');
const Order = require('../models/order');
// const Cart = require('../models/cart');

exports.getProducts = (req, res) => {
  Product.find()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};

exports.getProduct = (req, res) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render('shop/product-details', {
        product: product,
        pageTitle: product.title,
        path: '/products',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res) => {
  console.log('isAuthenticated', req.session.isLoggedIn);

  Product.find()
    .then((products) => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: user.cart.items,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res) => {
  const prodId = req.body.productId;

  Product.findById(prodId)
    .then(product => {
      return  req.user.addToCart(product);
    })
    .then(() => res.redirect('/cart'))
    .catch(err => console.log(err));
};

exports.postCartDeleteProduct = (req, res) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(() => res.redirect('/cart'))
    .catch(err => console.log(err));
};

exports.getCheckout = (req, res) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
    isAuthenticated: req.isLoggedIn
  });
};

exports.postOrder = (req, res) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      console.log(user.cart.items);
      const products = user.cart.items.map(i => {
        console.log('i is ', i);
        return {
          quantity: i.quantity,
          product: { ...i.productId._doc }
        }
      });
      const order = new Order({
        user: {
          name:  req.user.name,
          userId:  req.user
        },
        products
      });
      order.save();
    })
    .then(() => req.user.clearCart())
    .then(() => res.redirect('/orders'))
    .catch(err => console.log(err));
}

exports.getOrders = (req, res) => {
  Order.find({'user.userId':  req.user._id})
    .then(orders => {
      console.log(orders);
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};
