const {getConnectionPool,closeConnectionPool} = require("../db/connection.js");
const db = require('../db/connection_new.js');

//* If email already exists in database
const fetchUserByEmailOrID = async (data, isEmail = true) => {
  const sql = "SELECT * FROM `users` WHERE `email` = ?";
  const values = [data];

  const result = await db.query(sql, values);

  return result;
};

// const fetchUserByEmailOrID = async (data, isEmail = true) => {
//   let sql = "SELECT * FROM `users` WHERE `email`=?";
//   let connection;
//   connection = await getConnectionPool().getConnection();
//   if (!isEmail) sql = "SELECT * FROM `users` WHERE `email`= ? ";
//   const [row] = await connection.execute(sql, [data]);

//   connection.release();
//   return row;
// };

// const fetchUserByEmailOrID = async (data, isEmail = true) => {
//   let sql = "SELECT * FROM `users` WHERE `email`=?";
//   if (!isEmail) sql = "SELECT * FROM `users` WHERE `id`= ? ";
//   let connection;
//   try {
//     connection = await getConnectionPool().getConnection();
//     const [row] = await connection.execute(sql, [data]);
//     return row;
//   } catch (error) {
//     // Handle error
//     console.error('Error fetching user:', error);
//     return null; // Or handle the error accordingly
//   } finally {
//     if (connection) {
//       console.log("releasing connection")
//       // connection.release(); // Release the connection back to the pool
//     }
//   }
// };

module.exports = { fetchUserByEmailOrID };