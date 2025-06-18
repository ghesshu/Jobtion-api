const mysql = require('mysql2/promise');
const { config } = require('dotenv');
config();

const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

class Database {
  constructor() {
    //** Singleton pattern: create connection pool only if it doesn't exist
    if (!Database.instance) {
      this.pool = mysql.createPool({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
        connectionLimit: 10, // Adjust the limit based on your needs
      });

      Database.instance = this;
    }

    return Database.instance;
  }

  async query(sql, values) {
    // Use the connection pool to execute queries
    const [rows, fields] = await this.pool.execute(sql, values);
    
    return rows;
  }
}

module.exports = new Database();