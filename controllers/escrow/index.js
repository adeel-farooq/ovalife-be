const Escrow = require("../../models/escrow");
const Helpers = require("./helper");

const createEscrow = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized access." });
    }

    // Generate unique escrow number if not provided
    const escrowNumber =
      req.body.escrow_number || Helpers.generateEscrowNumber();

    const escrowData = {
      ...req.body,
      escrow_number: escrowNumber,
      created_by: user_id,
      created_at: new Date(),
    };

    const escrow = await Escrow.create(escrowData);

    if (!escrow?.id) {
      return res.status(500).json({ message: "Escrow creation failed." });
    }

    return res.status(201).json({
      message: "Escrow created successfully.",
      escrow,
    });
  } catch (error) {
    console.error("Create escrow error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const updateEscrow = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized access." });
    }

    const { id } = req.params;

    const updateData = {
      ...req.body,
      updated_by: user_id,
      updated_at: new Date(),
    };

    const [updated] = await Escrow.update(updateData, {
      where: { id, is_active: true },
    });

    if (!updated) {
      return res.status(404).json({ message: "Escrow not found." });
    }

    const updatedEscrow = await Escrow.findOne({ where: { id } });

    return res.status(200).json({
      message: "Escrow updated successfully.",
      escrow: updatedEscrow,
    });
  } catch (error) {
    console.error("Update escrow error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const updateProcessStatus = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized access." });
    }

    const { id } = req.params;
    const { process_status } = req.body;

    if (!process_status) {
      return res.status(400).json({ message: "process_status is required." });
    }

    // Validate process_status values
    const validStatuses = [
      "initialized_payment",
      "pending_payment",
      "payment_received",
      "cycling",
      "escrow_complete",
    ];

    if (!validStatuses.includes(process_status)) {
      return res.status(400).json({
        message: "Invalid process_status value.",
        validStatuses,
      });
    }

    const [updated] = await Escrow.update(
      {
        process_status,
        updated_by: user_id,
        updated_at: new Date(),
      },
      {
        where: { id, is_active: true },
      }
    );

    if (!updated) {
      return res.status(404).json({ message: "Escrow not found." });
    }

    const updatedEscrow = await Escrow.findOne({ where: { id } });

    return res.status(200).json({
      message: "Escrow process status updated successfully.",
      escrow: updatedEscrow,
    });
  } catch (error) {
    console.error("Update process status error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const deleteEscrow = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized access." });
    }

    const { id } = req.params;

    // Soft delete
    const [updated] = await Escrow.update(
      {
        is_active: false,
        updated_by: user_id,
        updated_at: new Date(),
      },
      {
        where: { id, is_active: true },
      }
    );

    if (!updated) {
      return res.status(404).json({ message: "Escrow not found." });
    }

    return res.status(200).json({ message: "Escrow deleted successfully." });
  } catch (error) {
    console.error("Delete escrow error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const getEscrow = async (req, res) => {
  try {
    const { id } = req.params;

    const escrow = await Escrow.findOne({
      where: { id, is_active: true },
    });

    if (!escrow) {
      return res.status(404).json({ message: "Escrow not found." });
    }

    return res.status(200).json({
      message: "Escrow retrieved successfully.",
      escrow,
    });
  } catch (error) {
    console.error("Get escrow error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const getEscrows = async (req, res) => {
  try {
    const whereClause = Helpers.prepareWhereClause(req.query);

    const escrows = await Escrow.findAll({
      where: whereClause,
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({
      message: "Escrows retrieved successfully.",
      count: escrows.length,
      escrows,
    });
  } catch (error) {
    console.error("Get escrows error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  createEscrow,
  updateEscrow,
  updateProcessStatus,
  deleteEscrow,
  getEscrow,
  getEscrows,
};
