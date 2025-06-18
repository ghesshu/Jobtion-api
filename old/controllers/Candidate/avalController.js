const {getConnectionPool,closeConnectionPool}  = require("../../db/connection.js");
const Response = require("../../utils/standardResponse.js");
const logger = require ('../../utils/logger.js');
const executeQuery = require("../../db/serverless_connection.js");

const add = async (req, res) => {
  try {
    let connection;
      connection = await getConnectionPool().getConnection();

    if (res.locals.user_type === "Candidate") {
      //*****update the details of user */
      const [avail_result] = await connection.execute(
        "INSERT INTO availability(user_id,activity) VALUES (?,?)",
        [
          res.locals.user_id.id,
          req.body.available,
        ]
      );

      console.log(avail_result.insertId)

      if (avail_result.affectedRows > 0) {
        console.log(JSON.stringify(req.body.days, null, 2))
        let me = req.body.days;

        for (const preference of me) {
            console.log(preference)
          }

        req.body.days.forEach((day) => {
            console.log(`Day: ${day.day}, Start Time: ${day.start_time}, End Time: ${day.end_time}`);
          });
          
        
    //    const insert = req.body.days.forEach( (day) => {
    //     console.log(day)
    //     // const [result] = await connection.execute(
    //     //     "INSERT INTO availabilities_days(day,start_time,end_time,availability_id) VALUES (?,?,?,?)",
    //     //     [
    //     //       day.day,
    //     //       day.start_time,
    //     //       day.end_time,
    //     //       avail_result.insertId
    //     //     ]
    //     //   );

    //     //   return result
    //     })

    //     console.log(insert)
        // const [result] = await connection.execute(
        //     "SELECT id, exp FROM experience  WHERE user_id = ? ",
        //     [
        //       res.locals.user_id.id,
        //     ]
        //   );
        //   console.log("added");
        //   res.status(201).json(
        //     Response({
        //       success: true,
        //       message: "Exp Added",
        //       data:result
        //     })
        //   );

      } else {
        logger("add_user_exp").error('Bug : ', result)
        res.status(417).json(
          Response({
            success: false,
            message: "Bad request",
          })
        );
      }
    }
    else{
      console.log(res.locals.user_type)
  }
    }
   catch (error) {
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

const edit = async (req, res) => {
  try {
    let connection;
      connection = await getConnectionPool().getConnection();

    if (res.locals.user_type === "Candidate") {
      //*****update the details of user */
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

const del = async (req, res) => {
  try {
    let connection;
      connection = await getConnectionPool().getConnection();

    if (res.locals.user_type === "Candidate") {
      //*****update the details of user */
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
  
      if (res.locals.user_type === "Candidate") {
        //*****update the details of user */
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


module.exports = { add, edit, del, fetch  };
