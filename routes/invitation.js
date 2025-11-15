const express = require("express");
const router = express.Router();
const invitationController = require("../controllers/invitation/index");
const auth = require("../middleware/auth");

// Send multiple invitations
router.post("/send", auth, invitationController.sendInvitations);

// Get all invitations with filters
router.get("/list", auth, invitationController.getInvitations);

// Get invitation statistics
router.get("/stats", auth, invitationController.getInvitationStats);

// Get single invitation by ID
router.get("/by/:id", auth, invitationController.getInvitation);

// Update invitation status
router.patch("/:id/status", auth, invitationController.updateInvitationStatus);

// Resend invitation
router.post("/:id/resend", auth, invitationController.resendInvitation);

// Delete invitation (soft delete)
router.delete("/:id", auth, invitationController.deleteInvitation);

module.exports = router;
