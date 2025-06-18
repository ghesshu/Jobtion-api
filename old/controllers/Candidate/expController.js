const {getConnectionPool,closeConnectionPool}  = require("../../db/connection.js");
const Response = require("../../utils/standardResponse.js");
const logger = require ('../../utils/logger.js');


const addUserExp = async (req, res) => {
  try {
    let connection;
      connection = await getConnectionPool().getConnection();

      const [result] = await connection.execute(
        "INSERT INTO experience(user_id,exp,created_at,updated_at) VALUES (?,?,?,?)",
        [
          res.locals.user_id.id,
          req.body.exp,
          new Date(),
          new Date(),
        ]
      );

      if (result.affectedRows > 0) {
        const [result] = await connection.execute(
          "SELECT id, exp FROM experience  WHERE user_id = ? ",
          [
            res.locals.user_id.id,
          ]
        );
        console.log("added");
        res.status(201).json(
          Response({
            success: true,
            message: "Exp Added",
            data:result
          })
        );
      } else {
        logger("add_user_exp").error('Bug : ', result)
        res.status(417).json(
          Response({
            success: false,
            message: "Bad request",
          })
        );
      }

  } catch (error) {
    // console.log(error)
    logger("add_user_exp").error('System Error : ',  error)
    res.status(500).json(
      Response({
        success: false,
        message: "System Error",
      })
    );
  }
};

const editUserExp = async (req, res) => {
  try {
    let connection;
      connection = await getConnectionPool().getConnection();

      const [result] = await connection.execute(
        "UPDATE experience SET exp = ?  WHERE id = ? AND user_id = ? ",
        [
          req.body.exp,
          req.body.id,
          res.locals.user_id.id,
        ]
      );

      if (result.affectedRows > 0) {
        const [result] = await connection.execute(
          "SELECT id, exp FROM experience  WHERE user_id = ? ",
          [
            res.locals.user_id.id,
          ]
        );
        res.status(201).json(
          Response({
            success: true,
            message: "Exp Updated",
            data:result
          })
        );
      } else {
        logger("edit_user_exp").error('Bug : ', result)
        res.status(417).json(
          Response({
            success: false,
            message: "Bad request, No Exp Found",
          })
        );
      }
  } catch (error) {
    // console.log(error)
    logger("edit_user_exp").error('System Error : ',  error)
    res.status(500).json(
      Response({
        success: false,
        message: "System Error",
      })
    );
  }
};

const delUserExp = async (req, res) => {
  try {
    let connection;
      connection = await getConnectionPool().getConnection();

      const [result] = await connection.execute(
        "DELETE FROM experience WHERE id = ? AND user_id = ? ",
        [
          req.body.id,
          res.locals.user_id.id,
        ]
      );

      if (result.affectedRows > 0) {
        const [result] = await connection.execute(
          "SELECT id, exp FROM experience  WHERE user_id = ? ",
          [
            res.locals.user_id.id,
          ]
        );
        res.status(201).json(
          Response({
            success: true,
            message: "Exp Deleted",
            data:result
          })
        );
      } else {
        logger("del_user_exp").error('Bug : ', result)
        res.status(417).json(
          Response({
            success: false,
            message: "Bad request, No Exp Found",
          })
        );
      }
  } catch (error) {
    // console.log(error)
    logger("del_user_exp").error('System Error : ',  error)
    res.status(500).json(
      Response({
        success: false,
        message: "System Error",
      })
    );
  }
};

const fetch = async (req, res) => {
  try {
    let connection;
      connection = await getConnectionPool().getConnection();

        const [result] = await connection.execute(
          "SELECT id, exp FROM experience  WHERE user_id = ? ",
          [
            res.locals.user_id.id,
          ]
        );

        res.status(201).json(
          Response({
            success: true,
            message: "Exp Fetched",
            data:result
          })
        );

  } catch (error) {
    // console.log(error)
    logger("del_user_exp").error('System Error : ',  error)
    res.status(500).json(
      Response({
        success: false,
        message: "System Error",
      })
    );
  }
};


module.exports = { addUserExp, editUserExp, delUserExp, fetch  };
