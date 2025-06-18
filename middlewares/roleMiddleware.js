const db = require("../db/connection_new.js");

const getAllRoles = async (req, res) => {
    try {
        const details = await db.query(
          `SELECT * FROM roles ORDER BY id DESC`,
          []
        );
        const payload = await Promise.all(
            details.map(async (role) => {
              // **Fetch days session first
              const accessRows = await db.query(
                `SELECT id,access FROM roles_access WHERE role_id = ?`,
                [role.id]
              );

              return {
                id: role.id,
                role_name: role.role_name,
                role_description: role.role_description,
                access: accessRows.map((access) => access.access)
              };
            })
          );
    
        return payload;
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
      }
};

const getSingleRole = async (req, res) => {
    try {
        const details = await db.query(
          `SELECT * FROM roles WHERE id = ?`,
          [req.body.id]
        );

        const accessRows = await db.query(
            `SELECT id,access FROM roles_access WHERE role_id = ?`,
            [req.body.id]
          );

          return {
            id: details[0].id,
            role_name: details[0].role_name,
            role_description: details[0].role_description,
            access: accessRows.map((access) => access.access)
          };
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
      }
};

const getRole = async (id) => {
  try {
      const details = await db.query(
        `SELECT * FROM roles WHERE id = ?`,
        [id]
      );

      const accessRows = await db.query(
          `SELECT id,access FROM roles_access WHERE role_id = ?`,
          [id]
        );

        return {
          id: details[0].id,
          role_name: details[0].role_name,
          role_description: details[0].role_description,
          access: accessRows.map((access) => access.access)
        };
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
};

const deleteRole = async (req, res) => {
    try {
        const details = await db.query(
          `DELETE FROM roles WHERE id =?`,
          [req.body.id]
        );

        return details;
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
          
      }
    };

module.exports = {
    getAllRoles,
    getSingleRole,
    deleteRole,
    getRole, 
}