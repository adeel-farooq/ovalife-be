const { Op } = require("sequelize");

/**
 * Prepare where clause for filtering email templates
 * @param {Object} query - Query parameters
 * @returns {Object} - Sequelize where clause
 */
const prepareWhereClause = (query) => {
  const whereClause = {};

  if (query.template_type) {
    whereClause.template_type = query.template_type;
  }

  if (query.status) {
    whereClause.status = query.status;
  }

  if (query.template_name) {
    whereClause.template_name = {
      [Op.iLike]: `%${query.template_name}%`,
    };
  }

  if (query.sender_email) {
    whereClause.sender_email = {
      [Op.iLike]: `%${query.sender_email}%`,
    };
  }

  if (query.created_by) {
    whereClause.created_by = query.created_by;
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
 * Validate template type
 * @param {string} type - Template type
 * @returns {boolean} - Is valid
 */
const isValidTemplateType = (type) => {
  const validTypes = ["Checklist", "Welcome", "Affiliate", "Match"];
  return validTypes.includes(type);
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Is valid email
 */
const isValidEmail = (email) => {
  if (!email) return true; // Email is optional
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} - Is valid URL
 */
const isValidUrl = (url) => {
  if (!url) return true; // URL is optional
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

module.exports = {
  prepareWhereClause,
  isValidTemplateType,
  isValidEmail,
  isValidUrl,
};
