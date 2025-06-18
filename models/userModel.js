const db = require('../db/connection_new.js');

//* If email already exists in database
const fetchUserByEmailOrID = async (data, isEmail = true) => {
  const sql = "SELECT * FROM `users` WHERE `email` = ?";
  const values = [data];

  const result = await db.query(sql, values);

  return result;
};

const fetchUserID = async (data) => {
  const sql = "SELECT * FROM `users` WHERE `id` = ?";
  const values = [data];

  const result = await db.query(sql, values);

  return result;
};

module.exports = { fetchUserByEmailOrID, fetchUserID };