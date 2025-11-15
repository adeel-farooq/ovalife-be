const express = require("express");
const router = express.Router();
const Controller = require("../controllers/emailTemplate");
const authenticateToken = require("../middleware/auth");

// Create new email template
router.post("/create", authenticateToken, Controller.createTemplate);

// Get all email templates with filters
router.get("/list", authenticateToken, Controller.getTemplates);

// Get single email template by ID
router.get("/by/:id", authenticateToken, Controller.getTemplate);

// Update email template
router.put("/:id", authenticateToken, Controller.updateTemplate);

// Delete email template (soft delete)
router.delete("/:id", authenticateToken, Controller.deleteTemplate);

// Update template status (draft/active)
router.patch("/:id/status", authenticateToken, Controller.updateTemplateStatus);

module.exports = router;
