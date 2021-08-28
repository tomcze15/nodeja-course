const express = require('express');
const path = require('path');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const rootDir = require('./util/path');

const app = express();

// app.set('view engine', 'pug');
app.set('view engine', 'ejs');
app.set('viees', 'views');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).render('404', { pageTitle: 'Page Not Found' });
});

app.listen(3000);
