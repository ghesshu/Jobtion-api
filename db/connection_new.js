const mysql = require("mysql2/promise");
const { config } = require("dotenv");
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
        connectionLimit: 10,
        queueLimit: 0,
        waitForConnections: true,
        idleTimeout: 300000,
        maxIdle: 10,
      });

      // Handle pool errors
      this.pool.on("connection", (connection) => {
        console.log("New connection established as id " + connection.threadId);
      });

      this.pool.on("error", (err) => {
        console.error("Database pool error:", err);
        if (err.code === "PROTOCOL_CONNECTION_LOST") {
          console.log("Database connection lost, reconnecting...");
        }
      });

      Database.instance = this;
    }

    return Database.instance;
  }

  async query(sql, values) {
    try {
      // Use the connection pool to execute queries
      const [rows, fields] = await this.pool.execute(sql, values);
      return rows;
    } catch (error) {
      console.error("Database query error:", error);
      throw error;
    }
  }

  async testConnection() {
    try {
      const connection = await this.pool.getConnection();
      await connection.ping();
      connection.release();
      console.log("Database connection test successful");
      return true;
    } catch (error) {
      console.error("Database connection test failed:", error);
      return false;
    }
  }
}

module.exports = new Database();
