const mysql = require('mysql2');

const connection = mysql
.createPool({
        connectionLimit: 10,
        host: '127.0.0.1',
        database: 'ebook',
        user: 'root',
        password: 'root'
    }).promise();

module.exports = class Database {
    static getConnection () {
        return connection;
    }
} 