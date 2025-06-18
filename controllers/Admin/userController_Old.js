const Response = require("../../utils/standardResponse.js");
const logger = require("../../utils/logger.js");
const db = require("../../db/connection_new.js");
const {
  getAllCandidates,
  getAllClients,
  getSingleClients,
  deleteClients,
  bringBackClients,
} = require("../../middlewares/userMiddleware.js");
const { getPathByFieldName } = require("../../utils/custom_function.js");
const bcrypt = require("bcrypt");
const { fetchUserByEmailOrID, fetchUserID } = require("../../models/userModel.js");
const axios = require('axios')
const { config } = require("dotenv");
config();

/**
 * Add a new client to the system
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const addNewClient = async (req, res) => {
  try {

    const response = await fetchUserByEmailOrID(req.body.company_email, false);

    if (Array.isArray(response) && response.length > 0) {
      logger("admin_user_signup").error('Failed: Email already exists for:', req.body.company_email);
      return res.status(409).json(
        Response({
          success: false,
          message: "Email Already Exists",
        })
      );
    }

    const { profile_picture } = getPathByFieldName(req.files, "profile_picture");

    // Generate secure password hash
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash("password", saltRounds);

    const sql = `
      INSERT INTO users (
        profile_picture, email, company_name, first_name, last_name,
        company_job_title, phone_number, user_type, address, website,
        crn, urn, company_house_number, lat, lng, postcode, password,
        admin_verification, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      profile_picture === undefined ? "" : profile_picture,
      req.body.company_email.toLowerCase(),
      req.body.company_name,
      req.body.first_name,
      req.body.last_name,
      req.body.company_job_title || null,
      req.body.phone_number,
      "Client",
      req.body.address || null,
      req.body.website || null,
      req.body.crn || null,
      req.body.urn || null,
      req.body.company_reg_number || null,
      req.body.lat || null,
      req.body.lng || null,
      req.body.postcode || null,
      hashPassword,
      1,
      new Date(),
    ];

    const result = await db.query(sql, values);

    if (result.affectedRows > 0) {
      res.status(201).json(
        Response({
          success: true,
          message: "Account Created Successfully",
        })
      );
    } else {
      logger("create_user_client").error("Database insertion failed:", result);
      res.status(417).json(
        Response({
          success: false,
          message: "Failed to create account",
        })
      );
    }
  } catch (error) {
    logger("create_user_client").error("System Error:", error);
    res.status(500).json(
      Response({
        success: false,
        message: "Internal Server Error",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    );
  }
};

/**
 * Fetch all candidates from the system
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const fetchCandidates = async (req, res) => {
  try {
    const candidates = await getAllCandidates(req, res);
    res.status(200).json(
      Response({
        success: true,
        message: "Candidates Fetched Successfully",
        data: candidates,
      })
    );
  } catch (error) {
    logger("fetch_candidates").error("System Error:", error);
    res.status(500).json(
      Response({
        success: false,
        message: "Internal Server Error",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    );
  }
};

/**
 * Fetch all clients from the system
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const fetchClients = async (req, res) => {
  try {
    const clients = await getAllClients(req, res);
    res.status(200).json(
      Response({
        success: true,
        message: "Clients Fetched Successfully",
        data: clients,
      })
    );
  } catch (error) {
    logger("fetch_clients").error("System Error:", error);
    res.status(500).json(
      Response({
        success: false,
        message: "Internal Server Error",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    );
  }
};

/**
 * Fetch a single client by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const fetchSingleClient = async (req, res) => {
  try {
    const client = await getSingleClients(req, res);
    res.status(200).json(
      Response({
        success: true,
        message: "Client Fetched Successfully",
        data: client,
      })
    );
  } catch (error) {
    logger("fetch_single_client").error("System Error:", error);
    res.status(500).json(
      Response({
        success: false,
        message: "Internal Server Error",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    );
  }
};

/**
 * Update an existing client's information
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateNewClient = async (req, res) => {
  try {
    if (!req.body.id) {
      return res.status(400).json(
        Response({
          success: false,
          message: "Client ID is required",
        })
      );
    }

    const response = await fetchUserID(req.body.id);

    if (!Array.isArray(response) || response.length === 0) {
      logger("admin_client_update").error('Client not found:', req.body.id);
      return res.status(404).json(
        Response({
          success: false,
          message: "Client not found",
        })
      );
    }

    const { profile_picture } = getPathByFieldName(req.files, "profile_picture");

    const sql = `
      UPDATE users 
      SET profile_picture = ?, 
          email = ?, 
          company_name = ?, 
          first_name = ?, 
          last_name = ?, 
          company_job_title = ?, 
          phone_number = ?, 
          address = ?, 
          website = ?, 
          crn = ?, 
          urn = ?, 
          company_house_number = ?, 
          lat = ?, 
          lng = ?,
          postcode = ?
      WHERE id = ?
    `;

    const values = [
      profile_picture?.trim() || response[0].profile_picture,
      req.body.company_email?.trim() || response[0].email,
      req.body.company_name?.trim() || response[0].company_name,
      req.body.first_name?.trim() || response[0].first_name,
      req.body.last_name?.trim() || response[0].last_name,
      req.body.company_job_title?.trim() || response[0].company_job_title,
      req.body.phone_number?.trim() || response[0].phone_number,
      req.body.address?.trim() || response[0].address,
      req.body.website === undefined ? response[0].website : req.body.website,
      req.body.crn?.trim() || response[0].crn,
      req.body.urn?.trim() || response[0].urn,
      req.body.company_reg_number?.trim() || response[0].company_house_number,
      req.body.lat?.trim() || response[0].lat,
      req.body.lng?.trim() || response[0].lng,
      req.body.postcode?.trim() || response[0].postcode,
      req.body.id
    ];

    const result = await db.query(sql, values);

    if (result.affectedRows > 0) {
      const updatedClient = await fetchUserID(req.body.id);
      res.status(200).json(
        Response({
          success: true,
          message: "Client Updated Successfully",
          data: updatedClient[0]
        })
      );
    } else {
      logger("admin_client_update").error("Update failed:", result);
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
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    );
  }
};

/**
 * Delete a client (soft delete)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteClient = async (req, res) => {
  try {
    await deleteClients(req, res);
    res.status(200).json(
      Response({
        success: true,
        message: "Client Archived Successfully",
      })
    );
  } catch (error) {
    logger("delete_client").error("System Error:", error);
    res.status(500).json(
      Response({
        success: false,
        message: "Internal Server Error",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    );
  }
};

/**
 * Restore a previously deleted client
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const bringBackClient = async (req, res) => {
  try {
    await bringBackClients(req, res);
    res.status(200).json(
      Response({
        success: true,
        message: "Client Restored Successfully",
      })
    );
  } catch (error) {
    logger("restore_client").error("System Error:", error);
    res.status(500).json(
      Response({
        success: false,
        message: "Internal Server Error",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    );
  }
};

const fetchSingleCandidate = async (req, res) => {
  try {
    
    const Response_ = await axios.get(`${process.env.ENDPOINT}candidates/${req.body.id}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    // console.log("Response : ",Response_)

    if (Response_.data.candidate.length === 0) {
      // console.log("Error : ",Response_.data)
      return res.status(422).json(
        Response({
          success: false,
          message: Response_.data.errors,
          data: Response_.data.data
        })
      );
    }
    else {
      // console.log("okay ::;",Response_)
      res.status(200).json(
        Response({
          success: true,
          message: "Candidate Fetched Successfully",
          data: Response_.data.candidate
        })
      );
    }
  } catch (error) {
    console.log("Error : ",error.message)
    if(error.response.status === 404){
      return res.status(404).json(
        Response({
          success: false,
          message: "Candidate not found",
        })
      );
    }
    console.log("Error : ",error.message)
    // logger("fetch_single_candidate").error("System Error:", error);
    res.status(500).json(
      Response({
        success: false,
        message: `System Error : ${error}`,
      })
    );
  }
};

const fetchAdmins = async (req, res) => {
  try {
    const details = await db.query(
      `SELECT id,username,full_name,email,role_id FROM admin_users ORDER BY id DESC`,
      []
    );
    const payload = await Promise.all(
        details.map(async (data) => {
          // **Fetch days session first
          const role = await db.query(
            `SELECT role_name,role_description FROM roles WHERE id = ?`,
            [data.role_id]
          );
          const accessRows = await db.query(
            `SELECT id,access FROM roles_access WHERE role_id = ?`,
            [data.role_id]
          );

          return {
            ...data,
            role_name: role[0]?.role_name,
            role_description: role[0]?.role_description,
            access: accessRows.map((access) => access.access)
          };
        })
      );

    res.status(200).json(
      Response({
        success: true,
        message: "Admins Fetched Successfully",
        data: payload,
      }) 
    )
  } catch (error) {
    logger("fetch_admins").error("System Error:", error);
    res.status(500).json(
      Response({
        success: false,
        message: "Internal Server Error",
      })
    );
  }
}

module.exports = { 
  fetchCandidates, 
  fetchClients, 
  addNewClient,
  fetchSingleClient, 
  updateNewClient, 
  deleteClient, 
  bringBackClient,
  fetchAdmins,
  fetchSingleCandidate
};
