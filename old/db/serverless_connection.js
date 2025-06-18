const mysql = require('serverless-mysql');
const { config } = require('dotenv');

config();
const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
const dbconn = mysql({
    connectionLimit: 40,
    // waitForConnections: true,
    // queueLimit: 15,
    // host: "127.0.0.1",
    // user: "root",
    // password: "developer",
    // database: "fasthos1_APIS"
    config: {
        host: DB_HOST,
        port: 3306,
        database: DB_NAME,
        user: DB_USER,
        password: DB_PASSWORD,
      },
});


async function executeQuery({ query, values }) {
    try {
      const results = await dbconn.query(query, values);
      await dbconn.end();
  
      return results;
    } catch (error) {
      console.log(query)
      return { error };
    }
  }


module.exports = executeQuery;
