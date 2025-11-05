const User = require("../../models/user");
const Helper = require("./helper");
const { Op } = require("sequelize");
const ContactInfo = require("../../models/contact_information");
const PhysicalCharacteristics = require("../../models/physical_characteristics");
const UserFilters = require("../../models/filter");
const { sequelize } = require("../../db");

const create = async (req, res) => {
  try {
    // Extract user_id from JWT token (set by auth middleware)
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized access." });
    }

    const { contact_info, physical_characteristics } = req.body;

    // Validate and process contact information
    const contactInfo = await ContactInfo.create({
      created_by: user_id,
      ...contact_info,
    });

    // Validate and process physical characteristics
    const physicalTraits = await PhysicalCharacteristics.create({
      created_by: user_id,
      ...physical_characteristics,
    });

    res.status(201).json({
      message: "Additional details added successfully",
      contactInfo,
      physicalTraits,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const get = async (req, res) => {
  try {
    const { user_id } = req.query; // Assuming user_id is passed as a query parameter

    // Fetch contact information
    const contactInfo = await ContactInfo.findOne({ where: { user_id } });

    // Fetch physical characteristics
    const physicalTraits = await PhysicalCharacteristics.findOne({
      where: { user_id },
    });

    res.status(200).json({
      message: "Additional details fetched successfully",
      contactInfo,
      physicalTraits,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const filterSave = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized access." });
    }

    const now = new Date();
    let userFilters = await UserFilters.findOne({
      where: { user_id, is_active: true },
    });

    if (req.body.id || userFilters) {
      const [affectedRows, updatedFilter] = await UserFilters.update(
        {
          ...req.body,
          updated_by: user_id,
          updated_at: now,
        },
        {
          where: { id: req.body.id || userFilters.id },
          returning: true,
        }
      );

      if (!updatedFilter || updatedFilter.length === 0) {
        return res
          .status(404)
          .json({ message: "No matching filter found to update." });
      }

      userFilters = updatedFilter[0]; // Directly use returned updated record
    } else {
      userFilters = await UserFilters.create({
        ...req.body,
        created_by: user_id,
        created_at: now,
        updated_by: user_id,
        updated_at: now,
      });
    }

    return res.status(200).json({
      message: "User filters saved successfully.",
      data: userFilters,
    });
  } catch (error) {
    console.error("Filter save error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
const filterGet = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized access." });
    }
    const userFilters = await UserFilters.findOne({ where: { user_id } });

    return res.status(200).json({
      message: "User filters fetched successfully.",
      data: userFilters,
    });
  } catch (error) {
    console.error("Filter get error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const getFilteredUsers = async (req, res) => {
  try {
    const {
      ethnicity,
      hair_color,
      eye_color,
      skin_tone,
      blood_type,
      height_min,
      height_max,
      weight_min,
      weight_max,
      page = 1,
      limit = 10,
    } = req.query;

    const offset = (page - 1) * limit;

    const query = `
      SELECT *
      FROM physical_characteristics
      WHERE
        ($1 IS NULL OR ethnicity = $1)
        AND ($2 IS NULL OR hair_color = $2)
        AND ($3 IS NULL OR eye_color = $3)
        AND ($4 IS NULL OR skin_tone = $4)
        AND ($5 IS NULL OR blood_type = $5)
        AND ($6 IS NULL OR height >= $6)
        AND ($7 IS NULL OR height <= $7)
        AND ($8 IS NULL OR weight >= $8)
        AND ($9 IS NULL OR weight <= $9)
      ORDER BY created_at DESC
      LIMIT $10 OFFSET $11;
    `;

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM physical_characteristics
      WHERE
        ($1 IS NULL OR ethnicity = $1)
        AND ($2 IS NULL OR hair_color = $2)
        AND ($3 IS NULL OR eye_color = $3)
        AND ($4 IS NULL OR skin_tone = $4)
        AND ($5 IS NULL OR blood_type = $5)
        AND ($6 IS NULL OR height >= $6)
        AND ($7 IS NULL OR height <= $7)
        AND ($8 IS NULL OR weight >= $8)
        AND ($9 IS NULL OR weight <= $9);
    `;

    const params = [
      ethnicity || null,
      hair_color || null,
      eye_color || null,
      skin_tone || null,
      blood_type || null,
      height_min || null,
      height_max || null,
      weight_min || null,
      weight_max || null,
      limit,
      offset,
    ];

    const [dataResult, countResult] = await Promise.all([
      sequelize.query(query, params),
      sequelize.query(countQuery, params.slice(0, 9)), // last 2 params (limit, offset) skip
    ]);

    return res.json({
      success: true,
      total: Number(countResult.rows[0].total),
      currentPage: Number(page),
      totalPages: Math.ceil(countResult.rows[0].total / limit),
      data: dataResult.rows,
    });
  } catch (err) {
    console.error("❌ Filter Query Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getRecommendedUsers = async (req, res) => {
  try {
    const { user_id, limit = 10, page = 1 } = req.query;
    const offset = (page - 1) * limit;

    // 1️⃣ Get current user's attributes
    const userQuery = `
      SELECT ethnicity, hair_color, eye_color, skin_tone, blood_type
      FROM physical_characteristics
      WHERE user_id = $1
      LIMIT 1;
    `;
    const userRes = await pool.query(userQuery, [user_id]);
    if (userRes.rows.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const u = userRes.rows[0];

    // 2️⃣ Find similar users with matching traits (calculate similarity score)
    const matchQuery = `
      SELECT
        user_id,
        ethnicity,
        hair_color,
        eye_color,
        skin_tone,
        blood_type,
        (
          (CASE WHEN ethnicity = $2 THEN 1 ELSE 0 END) +
          (CASE WHEN hair_color = $3 THEN 1 ELSE 0 END) +
          (CASE WHEN eye_color = $4 THEN 1 ELSE 0 END) +
          (CASE WHEN skin_tone = $5 THEN 1 ELSE 0 END) +
          (CASE WHEN blood_type = $6 THEN 1 ELSE 0 END)
        ) AS similarity_score
      FROM physical_characteristics
      WHERE user_id != $1
      ORDER BY similarity_score DESC, created_at DESC
      LIMIT $7 OFFSET $8;
    `;

    const matchRes = await sequelize.query(matchQuery, {
      replacements: [
        user_id,
        u.ethnicity,
        u.hair_color,
        u.eye_color,
        u.skin_tone,
        u.blood_type,
        limit,
        offset,
      ],
    });

    return res.json({
      success: true,
      currentPage: Number(page),
      data: matchRes.rows,
    });
  } catch (err) {
    console.error("❌ Recommendation Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getUsers = async (req, res) => {
  try {
    let whereClause = {};
    if (req.query.type) {
      whereClause.type = req.query.type;
    }
    if (req.query.is_archived) {
      whereClause.is_archived = req.query.is_archived;
    }
    const users = await User.findAll({ where: whereClause });
    return res.status(200).json({
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
module.exports = {
  create,
  get,
  filterSave,
  filterGet,
  getFilteredUsers,
  getRecommendedUsers,
  getUsers,
};
