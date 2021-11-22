const mongodb = require('mongodb');
const { getDb } = require("../util/database");

const ObjectId = mongodb.ObjectId;
const _collection = 'users';

class User {
  constructor(username, email, id) {
    this.name = username;
    this.email = email;
    this.id = id;
  }

  save() {
    const db = getDb();

    db.collection(collection)
      .insertOne(this)
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
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