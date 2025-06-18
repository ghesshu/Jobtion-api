const mysql = require('mysql2');
const { config } = require('dotenv');

let pool;

const createPool = () => {
    config();
    const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
    return mysql.createPool({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
    });
};

const getConnectionPool = () => {
    if (!pool) {
        pool = createPool().promise();
    }
    return pool;
};

const closeConnectionPool = () => {
    if (pool) {
        pool.end((err) => {
            if (err) {
                console.error('Error closing the connection pool:', err);
            } else {
                console.log('Connection pool closed successfully.');
            }
        });
    }
};

module.exports = {
    getConnectionPool,
    closeConnectionPool,
};