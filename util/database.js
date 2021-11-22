const mongodb = require('mongodb');

const { MongoClient } = mongodb;

let _db = null;

const mongoConnect = (callback) => {
  MongoClient.connect(
    'mongodb+srv://tomaszczerwinski:zaq12wsx@maincluster.smocf.mongodb.net/Shop?retryWrites=true&w=majority'
  )
    .then((client) => {
      console.log('Connected!');
      _db = client.db();
      callback();
    })
    .catch((err) => {
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw Error('No database found!');
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
