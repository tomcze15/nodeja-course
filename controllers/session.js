const User = require('../models/user');

exports.initObj = (store) => ({
  secret: 'my secret',
  resave: false,
  saveUninitialized: false,
  store: store
});

exports.createUser = (req, res, next) => {
  if(!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
  .then(user => {
    req.user = user;
    next();
  })
  .catch(err => console.log(err));
}