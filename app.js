const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const rootDir = require('./util/path');
const sessionController = require('./controllers/session');
const errorController = require('./controllers/error');

const MONGODB_URI = 'mongodb+srv://tomaszczerwinski:zaq12wsx@maincluster.smocf.mongodb.net/Shop?retryWrites=true&w=majority';

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'session'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(
  express.urlencoded({ extended: false }),
  express.static(path.join(rootDir, 'public')),
  session(sessionController.initObj(store)),
  sessionController.createUser,
  ('/admin', adminRoutes),
  shopRoutes,
  authRoutes,
  errorController.get404
);

mongoose
  .connect(
    MONGODB_URI
  )
  .then(() => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });