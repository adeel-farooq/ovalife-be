const { Op } = require("sequelize");

const prepareWhereClause = (query) => {
  const whereClause = {};

  if (query.status) {
    whereClause.status = query.status;
  }

  if (query.process_status) {
    whereClause.process_status = query.process_status;
  }

  if (query.type) {
    whereClause.type = query.type;
  }

  if (query.donor_id) {
    whereClause.donor_id = query.donor_id;
  }

  if (query.parent_id) {
    whereClause.parent_id = query.parent_id;
  }

  if (query.clinic_id) {
    whereClause.clinic_id = query.clinic_id;
  }

  if (query.escrow_number) {
    whereClause.escrow_number = query.escrow_number;
  }

  // Date range filtering
  if (query.date_from || query.date_to) {
    whereClause.date_of_match = {};
    if (query.date_from) {
      whereClause.date_of_match[Op.gte] = query.date_from;
    }
    if (query.date_to) {
      whereClause.date_of_match[Op.lte] = query.date_to;
    }
  }

  // Active filter (default to true if not specified)
  if (query.is_active !== undefined) {
    whereClause.is_active = query.is_active === "true";
  } else {
    whereClause.is_active = true;
  }

  return whereClause;
};

const generateEscrowNumber = () => {
  // Generate a unique escrow number (can be enhanced with custom logic)
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `${timestamp}${random}`;
};

module.exports = {
  prepareWhereClause,
  generateEscrowNumber,
};
