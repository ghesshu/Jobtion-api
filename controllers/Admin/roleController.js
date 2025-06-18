const Response = require("../../utils/standardResponse.js");
const logger = require("../../utils/logger.js");
const db = require("../../db/connection_new.js");
const {
  getAllRoles,
  getSingleRole,
  deleteRole,
} = require("../../middlewares/roleMiddleware.js");

/**
 * Add a new client to the system
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const addNewRole = async (req, res) => {
  try {
    const response = await db.query("SELECT * FROM roles WHERE role_name = ?", [
      req.body.role_name,
    ]);

    if (Array.isArray(response) && response.length > 0) {
      logger("admin_add_role").error(
        "Failed: Role already exists for:",
        req.body.role_name
      );
      return res.status(409).json(
        Response({
          success: false,
          message: "Role Already Exists",
        })
      );
    }

    const sql = `INSERT INTO roles (role_name, role_description) VALUES (?, ?)`;
    const values = [req.body.role_name, req.body.role_description];

    const result = await db.query(sql, values);

    if (result.affectedRows > 0) {
      const roleId = result.insertId;

      if (!!req.body.access) {
        //*******create role access */
        //*******loop through the access array and insert into role_access */
        let counter = req.body.access.length;
        req.body.access.forEach(async (access) => {
          const sql = `INSERT INTO roles_access (role_id, access) VALUES (?, ?)`;
          const values = [roleId, access];

          await db.query(sql, values);
          counter--;

          if (counter === 0) {
            res.status(201).json(
              Response({
                success: true,
                message: "Role Created Successfully",
              })
            );
          }
        });
      } else {
        res.status(201).json(
          Response({
            success: true,
            message: "Role Created Successfully",
          })
        );
      }
    } else {
      logger("admin_add_role").error("Database insertion failed:", result);
      res.status(417).json(
        Response({
          success: false,
          message: "Failed to create role",
        })
      );
    }
  } catch (error) {
    logger("admin_add_role").error("System Error:", error);
    res.status(500).json(
      Response({
        success: false,
        message: "Internal Server Error",
      })
    );
  }
};

/**
 * Fetch all candidates from the system
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getRoles = async (req, res) => {
  try {
    const data = await getAllRoles(req, res);
    res.status(200).json(
      Response({
        success: true,
        message: "Roles Fetched Successfully",
        data: data,
      })
    );
  } catch (error) {
    logger("fetch_roles").error("System Error:", error);
    res.status(500).json(
      Response({
        success: false,
        message: "Internal Server Error",
      })
    );
  }
};

/**
 * Fetch all clients from the system
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const fetchARole = async (req, res) => {
  try {
    const data = await getSingleRole(req, res);
    res.status(200).json(
      Response({
        success: true,
        message: "role Fetched Successfully",
        data: data,
      })
    );
  } catch (error) {
    logger("fetch_role").error("System Error:", error);
    res.status(500).json(
      Response({
        success: false,
        message: "Internal Server Error",
      })
    );
  }
};

/**
 * Update an existing client's information
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateRole = async (req, res) => {
  try {
    if (!req.body.id) {
      return res.status(400).json(
        Response({
          success: false,
          message: "Role ID is required",
        })
      );
    }

    const response = await db.query("SELECT * FROM roles WHERE id = ?", [
      req.body.id,
    ]);

    if (!Array.isArray(response) || response.length === 0) {
      logger("admin_role_update").error("Role not found:", req.body.id);
      return res.status(404).json(
        Response({
          success: false,
          message: "Role not found",
        })
      );
    }
    const sql = `UPDATE roles SET role_name = ?,  role_description = ? WHERE id = ?`;

    const values = [
      req.body.role_name?.trim() || response[0].role_name,
      req.body.role_description?.trim() || response[0].role_description,
      req.body.id,
    ];

    const result = await db.query(sql, values);

    if (result.affectedRows > 0) {
      if (!!req.body.access) {
        //*****first delete the existing access */
        await db.query("DELETE FROM roles_access WHERE role_id = ?", [
          req.body.id,
        ]);
        //*******create role access */
        //*******loop through the access array and insert into role_access */
        let counter = req.body.access.length;
        req.body.access.forEach(async (access) => {
          const sql = `INSERT INTO roles_access (role_id, access) VALUES (?, ?)`;
          const values = [req.body.id, access];

          await db.query(sql, values);
          counter--;

          if (counter === 0) {
            const updatedRole = await db.query(
              "SELECT * FROM roles WHERE id = ?",
              [req.body.id]
            );
            const accessRows = await db.query(
              `SELECT id,access FROM roles_access WHERE role_id = ?`,
              [req.body.id]
            );

            res.status(200).json(
              Response({
                success: true,
                message: "Role Updated Successfully",
                data: {
                  role_name: updatedRole[0].role_name,
                  role_description: updatedRole[0].role_description,
                  access: accessRows.map((access) => access.access),
                },
              })
            );
          }
        });
      }
      else{
        const updatedRole = await db.query("SELECT * FROM roles WHERE id = ?", [req.body.id]);
      const accessRows = await db.query(
        `SELECT id,access FROM roles_access WHERE role_id = ?`,
        [req.body.id]
      );

      res.status(200).json(
        Response({
          success: true,
          message: "Role Updated Successfully",
          data: {role_name: updatedRole[0].role_name, role_description: updatedRole[0].role_description, access: accessRows.map((access) => access.access)}
        })
      );
      }
    } else {
      logger("admin_role_update").error("Update failed:", result);
      res.status(417).json(
        Response({
          success: false,
          message: result,
        })
      );
    }
  } catch (error) {
    logger("admin_client_update").error("System Error:", error);
    res.status(500).json(
      Response({
        success: false,
        message: "Internal Server Error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      })
    );
  }
};

/**
 * Delete a client (soft delete)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteARole = async (req, res) => {
  try {
    const response = await db.query(
      "SELECT * FROM roles_access WHERE role_id = ?",
      [req.body.id]
    );

    if (Array.isArray(response) && response.length > 0) {
      await db.query("DELETE FROM roles_access WHERE role_id = ?", [
        req.body.id,
      ]);
      await deleteRole(req, res);
      res.status(200).json(
        Response({
          success: true,
          message: "Role Deleted Successfully",
        })
      );
    } else {
      await deleteRole(req, res);
      res.status(200).json(
        Response({
          success: true,
          message: "Role Deleted Successfully",
        })
      );
    }
  } catch (error) {
    logger("admin_delete_role").error("System Error:", error);
    res.status(500).json(
      Response({
        success: false,
        message: "Internal Server Error",
      })
    );
  }
};

module.exports = { addNewRole, getRoles, fetchARole, updateRole, deleteARole };
