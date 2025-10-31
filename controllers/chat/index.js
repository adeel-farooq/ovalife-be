const Chat = require("../../models/Chat");
const { Op } = require("sequelize");

const createChat = async (req, res) => {
  try {
    const chat = await Chat.create(req.body);
    if (!chat) {
      return res.status(400).json({ message: "Failed to create chat." });
    }
    res.status(201).json({ message: "Chat created successfully", chat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAll = async (req, res) => {
  try {
    const { doctor_id, patient_id } = req.query;

    if (!doctor_id || !patient_id) {
      const missingFields = [];
      if (!doctor_id) missingFields.push("doctor_id");
      if (!patient_id) missingFields.push("patient_id");

      return res.status(400).json({
        message: `Missing required field${
          missingFields.length > 1 ? "s" : ""
        }: ${missingFields.join(", ")}.`,
      });
    }

    const chats = await Chat.findAll({
      where: {
        [Op.or]: [
          {
            [Op.and]: [{ sender_id: doctor_id }, { receiver_id: patient_id }],
          },
          {
            [Op.and]: [{ sender_id: patient_id }, { receiver_id: doctor_id }],
          },
        ],
      },
      order: [["created_at", "ASC"]],
    });

    res.status(200).json({ message: "Chats retrieved successfully", chats });
  } catch (error) {
    console.error("Chat fetch error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const chat = await Chat.findByPk(id);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    res.status(200).json({ message: "Chat retrieved successfully", chat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const updateChat = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Chat.update(req.body, {
      where: { id },
    });
    if (!updated) {
      return res.status(404).json({ message: "Chat not found" });
    }
    res.status(200).json({ message: "Chat updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const deleteChat = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Chat.destroy({
      where: { id },
    });
    if (!deleted) {
      return res.status(404).json({ message: "Chat not found" });
    }
    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createChat,
  getAll,
  getById,
  updateChat,
  deleteChat,
};
