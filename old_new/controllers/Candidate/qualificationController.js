const {getConnectionPool,closeConnectionPool}  = require("../../db/connection.js");
const Response = require("../../utils/standardResponse.js");
const logger = require ('../../utils/logger.js');
const { getPathByFieldName } = require("../../utils/custom_function.js");


const add = async (req, res) => {
  try {
    let connection;
      connection = await getConnectionPool().getConnection();

    //   console.log(req.files)

      const { doc } =
      getPathByFieldName(
        req.files,
        "doc",
      );

      const [result] = await connection.execute(
        "INSERT INTO qualifications(user_id, qualification_type, upload_doc) VALUES (?,?,?)",
        [
          res.locals.user_id.id,
          req.body.qualification_type,
          doc
        ]
      );

      if (result.affectedRows > 0) {
        const [result] = await connection.execute(
          "SELECT id, qualification_type, upload_doc FROM qualifications  WHERE user_id = ? ",
          [
            res.locals.user_id.id,
          ]
        );

        res.status(201).json(
          Response({
            success: true,
            message: "Qualification Added",
            data:result
          })
        );
      } else {
        logger("add_user_qualification").error('Bug : ', result)
        res.status(422).json(
          Response({
            success: false,
            message: "Bad request",
          })
        );
      }

  } catch (error) {
    // console.log(error)
    logger("add_user_qualification").error('System Error : ',  error)
    res.status(500).json(
      Response({
        success: false,
        message: "System Error",
      })
    );
  }
};

const edit = async (req, res) => {
  try {
    let connection;
      connection = await getConnectionPool().getConnection();

      const { doc } =
      getPathByFieldName(
        req.files,
        "doc",
      );

      const [result] = await connection.execute(
        "UPDATE qualifications SET qualification_type = ?, upload_doc = ?  WHERE id = ? AND user_id = ? ",
        [
          req.body.qualification_type,
          doc,
          req.body.id,
          res.locals.user_id.id,
        ]
      );

      if (result.affectedRows > 0) {
        const [result] = await connection.execute(
          "SELECT id, qualification_type, upload_doc FROM qualifications  WHERE user_id = ? ",
          [
            res.locals.user_id.id,
          ]
        );

        res.status(201).json(
          Response({
            success: true,
            message: "Qualification Updated",
            data:result
          })
        );
      } else {
        logger("edit_user_qualification").error('Bug : ', result)
        res.status(422).json(
          Response({
            success: false,
            message: "Bad request, No Exp Found",
          })
        );
      }
  } catch (error) {
    // console.log(error)
    logger("edit_user_qualification").error('System Error : ',  error)
    res.status(500).json(
      Response({
        success: false,
        message: `System Error`,
      })
    );
  }
};

const del = async (req, res) => {
  try {
    let connection;
      connection = await getConnectionPool().getConnection();

      const [result] = await connection.execute(
        "DELETE FROM qualifications WHERE id = ? AND user_id = ? ",
        [
          req.body.id,
          res.locals.user_id.id,
        ]
      );

      if (result.affectedRows > 0) {
        const [result] = await connection.execute(
            "SELECT id, qualification_type, upload_doc FROM qualifications  WHERE user_id = ? ",
            [
              res.locals.user_id.id,
            ]
          );

        res.status(201).json(
          Response({
            success: true,
            message: "Qualification Deleted",
            data:result
          })
        );
      } else {
        logger("del_user_qualification").error('Bug : ', result)
        res.status(422).json(
          Response({
            success: false,
            message: "Bad request, No Exp Found",
          })
        );
      }
  } catch (error) {
    // console.log(error)
    logger("del_user_qualification").error('System Error : ',  error)
    res.status(500).json(
      Response({
        success: false,
        message: "System Error",
      })
    );
  }
};

const fetchSingle = async (req, res) => {
    try {
      let connection;
        connection = await getConnectionPool().getConnection();
  
        const [result] = await connection.execute(
          "SELECT id, qualification_type, upload_doc FROM qualifications  WHERE user_id = ? AND id = ? ",
          [
            res.locals.user_id.id,
            req.body.id
          ]
        );
  
          res.status(201).json(
            Response({
              success: true,
              message: "Qualification Fetched",
              data:result
            })
          );
  
    } catch (error) {
      // console.log(error)
      logger("fetch_user_qualification").error('System Error : ',  error)
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
        "SELECT id, qualification_type, upload_doc FROM qualifications  WHERE user_id = ? ",
        [
          res.locals.user_id.id,
        ]
      );

        res.status(201).json(
          Response({
            success: true,
            message: "Qualification Fetched",
            data:result
          })
        );

  } catch (error) {
    // console.log(error)
    logger("fetch_user_qualification").error('System Error : ',  error)
    res.status(500).json(
      Response({
        success: false,
        message: "System Error",
      })
    );
  }
};


module.exports = { add, edit, del, fetchSingle, fetch  };
