const EmailInvitation = require("../../models/email_invitation");
const User = require("../../models/user");
const Helpers = require("./helper");
const { sendEmail } = require("../../utils/emailHelper");
const { invitationEmail } = require("../../utils/emailTemplates");

/**
 * Send multiple email invitations
 */
const sendInvitations = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized access." });
    }

    const { invitations } = req.body;

    if (
      !invitations ||
      !Array.isArray(invitations) ||
      invitations.length === 0
    ) {
      return res.status(400).json({
        message: "invitations array is required and must not be empty.",
      });
    }

    // Get sender information
    const sender = await User.findByPk(user_id);
    if (!sender) {
      return res.status(404).json({ message: "Sender not found." });
    }

    const senderName = `${sender.first_name} ${sender.last_name}`.trim();
    const results = [];
    const now = new Date();

    // Process each invitation - handle emails and phones separately
    for (const invitation of invitations) {
      const {
        email,
        phone,
        role,
        type = "general",
        metadata = {},
      } = invitation;

      // Validate role (required for all)
      if (!role) {
        if (email) {
          results.push({
            recipient: email,
            type: "email",
            success: false,
            error: "Role is required",
          });
        }
        if (phone) {
          results.push({
            recipient: phone,
            type: "phone",
            success: false,
            error: "Role is required",
          });
        }
        continue;
      }

      // Process email invitation if provided
      if (email) {
        // Validate email
        if (!Helpers.isValidEmail(email)) {
          results.push({
            recipient: email,
            type: "email",
            success: false,
            error: "Invalid email format",
          });
        } else {
          try {
            // Create invitation record first (to get ID for link)
            const invitationRecord = await EmailInvitation.create({
              invitation_type: type,
              recipient_email: email,
              recipient_phone: null,
              recipient_role: role,
              sender_id: user_id,
              invitation_link: "temp", // Temporary, will update after getting ID
              status: "pending",
              sent_at: now,
              expires_at: Helpers.calculateExpirationDate(7),
              metadata: metadata,
              created_by: user_id,
              created_at: now,
            });

            // Generate invitation link with actual ID
            const invitationLink = Helpers.generateInvitationLink(
              type,
              invitationRecord.id
            );

            // Update invitation record with actual link
            await invitationRecord.update({
              invitation_link: invitationLink,
            });

            // Prepare email template
            const emailTemplate = invitationEmail(
              senderName,
              role,
              invitationLink
            );

            // Send email
            try {
              await sendEmail({
                to: email,
                subject: emailTemplate.subject,
                html: emailTemplate.html,
                text: emailTemplate.text,
              });

              // Update status to sent
              await invitationRecord.update({
                status: "sent",
                updated_by: user_id,
                updated_at: new Date(),
              });

              results.push({
                recipient: email,
                type: "email",
                success: true,
                invitation_id: invitationRecord.id,
                invitation_link: invitationLink,
              });
            } catch (emailError) {
              // Update status to failed with error message
              await invitationRecord.update({
                status: "failed",
                error_message: emailError.message,
                updated_by: user_id,
                updated_at: new Date(),
              });

              results.push({
                recipient: email,
                type: "email",
                success: false,
                error: `Failed to send email: ${emailError.message}`,
                invitation_id: invitationRecord.id,
              });
            }
          } catch (dbError) {
            console.error("Database error for email invitation:", dbError);
            results.push({
              recipient: email,
              type: "email",
              success: false,
              error: `Database error: ${dbError.message}`,
            });
          }
        }
      }

      // Process phone invitation if provided
      if (phone) {
        // Validate phone
        if (!Helpers.isValidPhone(phone)) {
          results.push({
            recipient: phone,
            type: "phone",
            success: false,
            error: "Invalid phone format",
          });
        } else {
          try {
            // Create invitation record for phone
            const invitationRecord = await EmailInvitation.create({
              invitation_type: type,
              recipient_email: null,
              recipient_phone: phone,
              recipient_role: role,
              sender_id: user_id,
              invitation_link: "temp",
              status: "pending",
              sent_at: now,
              expires_at: Helpers.calculateExpirationDate(7),
              metadata: metadata,
              created_by: user_id,
              created_at: now,
            });

            // Generate invitation link with actual ID
            const invitationLink = Helpers.generateInvitationLink(
              type,
              invitationRecord.id
            );

            // Update invitation record with actual link
            await invitationRecord.update({
              invitation_link: invitationLink,
            });

            // For phone, we just create the record
            // In the future, you can integrate SMS service here
            await invitationRecord.update({
              status: "sent",
              updated_by: user_id,
              updated_at: new Date(),
            });

            results.push({
              recipient: phone,
              type: "phone",
              success: true,
              invitation_id: invitationRecord.id,
              invitation_link: invitationLink,
              note: "SMS integration pending - record created",
            });
          } catch (dbError) {
            console.error("Database error for phone invitation:", dbError);
            results.push({
              recipient: phone,
              type: "phone",
              success: false,
              error: `Database error: ${dbError.message}`,
            });
          }
        }
      }

      // If neither email nor phone provided
      if (!email && !phone) {
        results.push({
          recipient: "N/A",
          type: "none",
          success: false,
          error: "At least one of email or phone is required",
        });
      }
    }

    // Calculate summary
    const summary = {
      total: results.length,
      successful: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
    };

    return res.status(200).json({
      message: "Invitations processed",
      summary,
      results,
    });
  } catch (error) {
    console.error("Send invitations error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * Get all invitations (with filters)
 */
const getInvitations = async (req, res) => {
  try {
    const whereClause = Helpers.prepareWhereClause(req.query);

    const invitations = await EmailInvitation.findAll({
      where: whereClause,
      order: [["sent_at", "DESC"]],
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id", "email", "first_name", "last_name"],
        },
      ],
    });

    return res.status(200).json({
      message: "Invitations retrieved successfully.",
      count: invitations.length,
      invitations,
    });
  } catch (error) {
    console.error("Get invitations error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * Get single invitation by ID
 */
const getInvitation = async (req, res) => {
  try {
    const { id } = req.params;

    const invitation = await EmailInvitation.findOne({
      where: { id, is_active: true },
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id", "email", "first_name", "last_name"],
        },
      ],
    });

    if (!invitation) {
      return res.status(404).json({ message: "Invitation not found." });
    }

    return res.status(200).json({
      message: "Invitation retrieved successfully.",
      invitation,
    });
  } catch (error) {
    console.error("Get invitation error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * Update invitation status (e.g., mark as opened or accepted)
 */
const updateInvitationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "status is required." });
    }

    // Validate status
    const validStatuses = ["sent", "opened", "accepted", "expired", "failed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value.",
        validStatuses,
      });
    }

    const updateData = {
      status,
      updated_at: new Date(),
    };

    // Set timestamp based on status
    if (status === "opened" && !updateData.opened_at) {
      updateData.opened_at = new Date();
    } else if (status === "accepted" && !updateData.accepted_at) {
      updateData.accepted_at = new Date();
    }

    const [updated] = await EmailInvitation.update(updateData, {
      where: { id, is_active: true },
    });

    if (!updated) {
      return res.status(404).json({ message: "Invitation not found." });
    }

    const updatedInvitation = await EmailInvitation.findOne({ where: { id } });

    return res.status(200).json({
      message: "Invitation status updated successfully.",
      invitation: updatedInvitation,
    });
  } catch (error) {
    console.error("Update invitation status error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * Resend invitation
 */
const resendInvitation = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized access." });
    }

    const { id } = req.params;

    const invitation = await EmailInvitation.findOne({
      where: { id, is_active: true },
    });

    if (!invitation) {
      return res.status(404).json({ message: "Invitation not found." });
    }

    // Get sender information
    const sender = await User.findByPk(invitation.sender_id);
    if (!sender) {
      return res.status(404).json({ message: "Sender not found." });
    }

    const senderName = `${sender.first_name} ${sender.last_name}`.trim();

    // Prepare email template
    const emailTemplate = invitationEmail(
      senderName,
      invitation.recipient_role,
      invitation.invitation_link
    );

    try {
      // Send email
      await sendEmail({
        to: invitation.recipient_email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text,
      });

      // Update invitation
      await invitation.update({
        status: "sent",
        sent_at: new Date(),
        error_message: null,
        updated_by: user_id,
        updated_at: new Date(),
      });

      return res.status(200).json({
        message: "Invitation resent successfully.",
        invitation,
      });
    } catch (emailError) {
      // Update status to failed
      await invitation.update({
        status: "failed",
        error_message: emailError.message,
        updated_by: user_id,
        updated_at: new Date(),
      });

      return res.status(500).json({
        message: "Failed to resend invitation.",
        error: emailError.message,
      });
    }
  } catch (error) {
    console.error("Resend invitation error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * Delete invitation (soft delete)
 */
const deleteInvitation = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized access." });
    }

    const { id } = req.params;

    const [updated] = await EmailInvitation.update(
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
      return res.status(404).json({ message: "Invitation not found." });
    }

    return res
      .status(200)
      .json({ message: "Invitation deleted successfully." });
  } catch (error) {
    console.error("Delete invitation error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * Get invitation statistics
 */
const getInvitationStats = async (req, res) => {
  try {
    const user_id = req.user?.id;

    const whereClause = { is_active: true };

    // If sender_id query param provided, filter by it
    if (req.query.sender_id) {
      whereClause.sender_id = req.query.sender_id;
    }

    const [total, sent, failed, opened, accepted] = await Promise.all([
      EmailInvitation.count({ where: whereClause }),
      EmailInvitation.count({ where: { ...whereClause, status: "sent" } }),
      EmailInvitation.count({ where: { ...whereClause, status: "failed" } }),
      EmailInvitation.count({ where: { ...whereClause, status: "opened" } }),
      EmailInvitation.count({ where: { ...whereClause, status: "accepted" } }),
    ]);

    return res.status(200).json({
      message: "Invitation statistics retrieved successfully.",
      stats: {
        total,
        sent,
        failed,
        opened,
        accepted,
        pending: total - sent - failed,
      },
    });
  } catch (error) {
    console.error("Get invitation stats error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  sendInvitations,
  getInvitations,
  getInvitation,
  updateInvitationStatus,
  resendInvitation,
  deleteInvitation,
  getInvitationStats,
};
