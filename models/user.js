const mongodb = require('mongodb');
const { getDb } = require("../util/database");

const ObjectId = mongodb.ObjectId;
const _collection = 'users';

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    const db = getDb();

    db.collection(collection)
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
      .collection(_collection)
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: {cart: updateCart} }
      );
  }

  static findById(userId) {
    const db = getDb();
    return db.collection(_collection)
      .findOne({_id: new ObjectId(userId)})
      .then(user => {
        console.log(user);
        return user;
      })
      .catch(err => console.log(err));
  }
}

module.exports = User;