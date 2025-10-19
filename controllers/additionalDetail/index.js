const User = require("../../models/user");
const Helper = require("./helper");
const { Op } = require("sequelize");
const ContactInfo = require("../../models/contact_information");
const PhysicalCharacteristics = require("../../models/physical_characteristics");
const UserFilters = require("../../models/filter");

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

module.exports = {
  create,
  get,
  filterSave,
  filterGet,
};
