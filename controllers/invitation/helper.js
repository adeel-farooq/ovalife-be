const { Op } = require("sequelize");

/**
 * Prepare where clause for filtering email invitations
 * @param {Object} query - Query parameters
 * @returns {Object} - Sequelize where clause
 */
const prepareWhereClause = (query) => {
  const whereClause = {};

  if (query.status) {
    whereClause.status = query.status;
  }

  if (query.invitation_type) {
    whereClause.invitation_type = query.invitation_type;
  }

  if (query.recipient_role) {
    whereClause.recipient_role = query.recipient_role;
  }

  if (query.sender_id) {
    whereClause.sender_id = query.sender_id;
  }

  if (query.recipient_email) {
    whereClause.recipient_email = {
      [Op.iLike]: `%${query.recipient_email}%`,
    };
  }

  // Date range filtering
  if (query.sent_from || query.sent_to) {
    whereClause.sent_at = {};
    if (query.sent_from) {
      whereClause.sent_at[Op.gte] = query.sent_from;
    }
    if (query.sent_to) {
      whereClause.sent_at[Op.lte] = query.sent_to;
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

/**
 * Generate unique invitation link
 * @param {string} type - Invitation type (parent, donor, etc.)
 * @param {string} id - Invitation ID
 * @returns {string} - Invitation link
 */
const generateInvitationLink = (type, id) => {
  const baseUrl = process.env.APP_BASE_URL || "https://ovalife.me";
  return `${baseUrl}/${type}/id/${id}`;
};

/**
 * Calculate expiration date
 * @param {number} days - Number of days until expiration
 * @returns {Date} - Expiration date
 */
const calculateExpirationDate = (days = 7) => {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + days);
  return expirationDate;
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Is valid email
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone format
 * @param {string} phone - Phone to validate
 * @returns {boolean} - Is valid phone
 */
const isValidPhone = (phone) => {
  if (!phone) return true; // Phone is optional
  const phoneRegex = /^\+?[\d\s\-()]+$/;
  return phoneRegex.test(phone);
};

module.exports = {
  prepareWhereClause,
  generateInvitationLink,
  calculateExpirationDate,
  isValidEmail,
  isValidPhone,
};
