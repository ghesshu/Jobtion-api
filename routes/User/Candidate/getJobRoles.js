const { Router } = require("express");
const db = require("../../../db/connection_new.js");
const Response = require("../../../utils/standardResponse.js");

const router = Router({ strict: true });

router.get("/", async (req, res, next) => {

    const getRoles = await db.query("SELECT role FROM job_role_data",[]);

    
    
    res.status(201).json(
        Response({
          success: true,
          message: "Fetched",
          data:getRoles
        })
      );
});

module.exports = router;
