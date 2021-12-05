const mongodb = require('mongodb');
const { getDb } = require("../util/database");

const ObjectId = mongodb.ObjectId;
const _collectionUser = 'users';
const _collectionProducts = 'products';
const _collectionOrders = 'orders';

const collectionsMap = {
  user: _collectionUser,
  products: _collectionProducts,
  orders: _collectionOrders
}

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    const db = getDb();

    db.collection(collectionsMap.user)
      .insertOne(this)
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    });

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if(cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        quantity: newQuantity
      });
    }

    const updateCart = { items: updatedCartItems };

    return getDb()
      .collection(collectionsMap.user)
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: {cart: updateCart} }
      );
  }

  getCart() {
    const productIds = this.cart.items.map(i => i.productId);

    return getDb()
      .collection(collectionsMap.products)
      .find({_id: {$in: productIds}})
      .toArray()
      .then(products => {
        return products.map(p => {
          return {
            ...p,
            quantity: this.cart.items.find(i => {
              return i.productId.toString() === p._id.toString();
            }).quantity
          }
        })
      });
  }

  deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.items.filter(item => {
      return item.productId.toString() !== productId.toString();
    });

    return getDb()
      .collection(collectionsMap.user)
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: { items: updatedCartItems } } }
      );
  }

  addOrder() {
    const db = getDb();
    return this.getCart()
    .then(products => {
      const order = {
        items: products,
        user: {
          _id: new ObjectId(this._id),
          name: this.name
        }
      };
      return db.collection(collectionsMap.orders).insertOne(order);
    })
      .then(result => {
        this.cart = { items: [] }
        return db
          .collection(collectionsMap.user)
          .updateOne(
            { _id: new ObjectId(this._id) },
            { $set: { cart: { items: [] } } }
          )
      });
  }

  getOrders() {
    return getDb()
      .collection(collectionsMap.orders)
      .find({'user._id': new ObjectId(this._id)})
      .toArray();
  }

  static findById(userId) {
    return getDb().collection(collectionsMap.user)
      .findOne({_id: new ObjectId(userId)})
      .then(user => {
        console.log(user);
        return user;
      })
      .catch(err => console.log(err));
  }
}

module.exports = User;