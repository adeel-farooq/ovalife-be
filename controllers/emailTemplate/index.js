const EmailTemplate = require("../../models/email_template");
const User = require("../../models/user");
const Helpers = require("./helper");

/**
 * Create new email template
 */
const createTemplate = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized access." });
    }

    const {
      template_name,
      template_type,
      subject,
      body,
      sender_email,
      cta_text,
      cta_url,
      check_account_text,
      check_account_email,
      social_twitter_url,
      social_facebook_url,
      social_instagram_url,
      status = "draft",
    } = req.body;

    // Validate required fields
    if (!template_name || !template_type || !subject || !body) {
      return res.status(400).json({
        message:
          "template_name, template_type, subject, and body are required.",
      });
    }

    // Validate template type
    if (!Helpers.isValidTemplateType(template_type)) {
      return res.status(400).json({
        message:
          "Invalid template_type. Must be: Checklist, Welcome, Affiliate, or Match",
      });
    }

    // Validate emails
    if (sender_email && !Helpers.isValidEmail(sender_email)) {
      return res.status(400).json({ message: "Invalid sender_email format." });
    }
    if (check_account_email && !Helpers.isValidEmail(check_account_email)) {
      return res
        .status(400)
        .json({ message: "Invalid check_account_email format." });
    }

    // Validate URLs
    if (cta_url && !Helpers.isValidUrl(cta_url)) {
      return res.status(400).json({ message: "Invalid cta_url format." });
    }
    if (social_twitter_url && !Helpers.isValidUrl(social_twitter_url)) {
      return res
        .status(400)
        .json({ message: "Invalid social_twitter_url format." });
    }
    if (social_facebook_url && !Helpers.isValidUrl(social_facebook_url)) {
      return res
        .status(400)
        .json({ message: "Invalid social_facebook_url format." });
    }
    if (social_instagram_url && !Helpers.isValidUrl(social_instagram_url)) {
      return res
        .status(400)
        .json({ message: "Invalid social_instagram_url format." });
    }

    // Get user info for created_by_name
    const user = await User.findByPk(user_id);
    const created_by_name = user
      ? `${user.first_name} ${user.last_name}`.trim() || user.email
      : "admin name";

    const template = await EmailTemplate.create({
      template_name,
      template_type,
      subject,
      body,
      sender_email,
      cta_text,
      cta_url,
      check_account_text,
      check_account_email,
      social_twitter_url,
      social_facebook_url,
      social_instagram_url,
      status,
      created_by_name,
      created_by: user_id,
      created_at: new Date(),
    });

    return res.status(201).json({
      message: "Email template created successfully.",
      template,
    });
  } catch (error) {
    console.error("Create email template error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * Get all email templates with filters
 */
const getTemplates = async (req, res) => {
  try {
    const whereClause = Helpers.prepareWhereClause(req.query);

    const templates = await EmailTemplate.findAll({
      where: whereClause,
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({
      message: "Email templates retrieved successfully.",
      count: templates.length,
      templates,
    });
  } catch (error) {
    console.error("Get email templates error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * Get single email template by ID
 */
const getTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    const template = await EmailTemplate.findOne({
      where: { id, is_active: true },
    });

    if (!template) {
      return res.status(404).json({ message: "Email template not found." });
    }

    return res.status(200).json({
      message: "Email template retrieved successfully.",
      template,
    });
  } catch (error) {
    console.error("Get email template error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * Update email template
 */
const updateTemplate = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized access." });
    }

    const { id } = req.params;
    const {
      template_name,
      template_type,
      subject,
      body,
      sender_email,
      cta_text,
      cta_url,
      check_account_text,
      check_account_email,
      social_twitter_url,
      social_facebook_url,
      social_instagram_url,
      status,
    } = req.body;

    const template = await EmailTemplate.findOne({
      where: { id, is_active: true },
    });

    if (!template) {
      return res.status(404).json({ message: "Email template not found." });
    }

    // Validate template type if provided
    if (template_type && !Helpers.isValidTemplateType(template_type)) {
      return res.status(400).json({
        message:
          "Invalid template_type. Must be: Checklist, Welcome, Affiliate, or Match",
      });
    }

    // Validate emails if provided
    if (
      sender_email !== undefined &&
      sender_email &&
      !Helpers.isValidEmail(sender_email)
    ) {
      return res.status(400).json({ message: "Invalid sender_email format." });
    }
    if (
      check_account_email !== undefined &&
      check_account_email &&
      !Helpers.isValidEmail(check_account_email)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid check_account_email format." });
    }

    // Validate URLs if provided
    if (cta_url !== undefined && cta_url && !Helpers.isValidUrl(cta_url)) {
      return res.status(400).json({ message: "Invalid cta_url format." });
    }
    if (
      social_twitter_url !== undefined &&
      social_twitter_url &&
      !Helpers.isValidUrl(social_twitter_url)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid social_twitter_url format." });
    }
    if (
      social_facebook_url !== undefined &&
      social_facebook_url &&
      !Helpers.isValidUrl(social_facebook_url)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid social_facebook_url format." });
    }
    if (
      social_instagram_url !== undefined &&
      social_instagram_url &&
      !Helpers.isValidUrl(social_instagram_url)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid social_instagram_url format." });
    }

    const updateData = {
      updated_by: user_id,
      updated_at: new Date(),
    };

    if (template_name !== undefined) updateData.template_name = template_name;
    if (template_type !== undefined) updateData.template_type = template_type;
    if (subject !== undefined) updateData.subject = subject;
    if (body !== undefined) updateData.body = body;
    if (sender_email !== undefined) updateData.sender_email = sender_email;
    if (cta_text !== undefined) updateData.cta_text = cta_text;
    if (cta_url !== undefined) updateData.cta_url = cta_url;
    if (check_account_text !== undefined)
      updateData.check_account_text = check_account_text;
    if (check_account_email !== undefined)
      updateData.check_account_email = check_account_email;
    if (social_twitter_url !== undefined)
      updateData.social_twitter_url = social_twitter_url;
    if (social_facebook_url !== undefined)
      updateData.social_facebook_url = social_facebook_url;
    if (social_instagram_url !== undefined)
      updateData.social_instagram_url = social_instagram_url;
    if (status !== undefined) updateData.status = status;

    await template.update(updateData);

    return res.status(200).json({
      message: "Email template updated successfully.",
      template,
    });
  } catch (error) {
    console.error("Update email template error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * Delete email template (soft delete)
 */
const deleteTemplate = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized access." });
    }

    const { id } = req.params;

    const [updated] = await EmailTemplate.update(
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
      return res.status(404).json({ message: "Email template not found." });
    }

    return res.status(200).json({
      message: "Email template deleted successfully.",
    });
  } catch (error) {
    console.error("Delete email template error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * Update template status (draft/active)
 */
const updateTemplateStatus = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized access." });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "status is required." });
    }

    // Validate status
    const validStatuses = ["draft", "active"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value. Must be: draft or active",
        validStatuses,
      });
    }

    const [updated] = await EmailTemplate.update(
      {
        status,
        updated_by: user_id,
        updated_at: new Date(),
      },
      {
        where: { id, is_active: true },
      }
    );

    if (!updated) {
      return res.status(404).json({ message: "Email template not found." });
    }

    const updatedTemplate = await EmailTemplate.findOne({ where: { id } });

    return res.status(200).json({
      message: "Template status updated successfully.",
      template: updatedTemplate,
    });
  } catch (error) {
    console.error("Update template status error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  createTemplate,
  getTemplates,
  getTemplate,
  updateTemplate,
  deleteTemplate,
  updateTemplateStatus,
};
