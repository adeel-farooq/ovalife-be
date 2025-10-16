const User = require("../../models/user");
const Helper = require("./helper");
const { Op } = require("sequelize");
const ContactInfo = require("../../models/contact_information");
const PhysicalCharacteristics = require("../../models/physical_characteristics");

const Helper = require("./helper");
const { Op } = require("sequelize");

const addAdditionalDetails = async (req, res) => {
  try {
    const { user_id, contact_info, physical_characteristics } = req.body;

    // Validate and process contact information
    const contactInfo = await ContactInfo.create({
      user_id,
      ...contact_info,
    });

    // Validate and process physical characteristics
    const physicalTraits = await PhysicalCharacteristics.create({
      user_id,
      ...physical_characteristics,
    });

    res.status(201).json({
      message: "Additional details added successfully",
      contactInfo,
      physicalTraits,
    });
  } catch (error) {
    Helper.handleError(res, error);
  }
};
const getAdditionalDetails = async (req, res) => {
  try {
    const { user_id } = req.params; // Assuming user_id is passed as a URL parameter

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
    Helper.handleError(res, error);
  }
};
module.exports = {
  addAdditionalDetails,
  getAdditionalDetails,
};
