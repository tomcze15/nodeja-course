const mysql = require('mysql2');

const { PASSWORD } = require('../constants/passwd');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'node-complete',
  password: PASSWORD
});

module.exports = pool.promise();
