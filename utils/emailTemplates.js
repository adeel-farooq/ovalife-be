/**
 * Email templates for Ovalife application
 */

/**
 * Welcome email template
 * @param {string} firstName - User's first name
 * @param {string} email - User's email
 * @returns {Object} - Subject and HTML content
 */
const welcomeEmail = (firstName, email) => {
  return {
    subject: "Welcome to Ovalife!",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Ovalife!</h1>
            </div>
            <div class="content">
              <h2>Hi ${firstName},</h2>
              <p>Thank you for joining Ovalife! We're excited to have you on board.</p>
              <p>Your account has been successfully created with the email: <strong>${email}</strong></p>
              <p>You can now log in and start exploring our platform.</p>
              <p>If you have any questions, feel free to reach out to our support team.</p>
            </div>
            <div class="footer">
              <p>&copy; 2025 Ovalife. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Welcome to Ovalife!\n\nHi ${firstName},\n\nThank you for joining Ovalife! We're excited to have you on board.\n\nYour account has been successfully created with the email: ${email}\n\nYou can now log in and start exploring our platform.\n\nIf you have any questions, feel free to reach out to our support team.\n\n© 2025 Ovalife. All rights reserved.`,
  };
};

/**
 * Password reset email template
 * @param {string} firstName - User's first name
 * @param {string} resetToken - Password reset token
 * @param {string} resetUrl - Password reset URL
 * @returns {Object} - Subject and HTML content
 */
const passwordResetEmail = (firstName, resetToken, resetUrl) => {
  return {
    subject: "Password Reset Request - Ovalife",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #FF5722; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .button { display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
            .warning { background-color: #fff3cd; border: 1px solid #ffc107; padding: 10px; margin: 15px 0; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <h2>Hi ${firstName},</h2>
              <p>We received a request to reset your password for your Ovalife account.</p>
              <p>Click the button below to reset your password:</p>
              <a href="${resetUrl}" class="button">Reset Password</a>
              <p>Or copy and paste this link into your browser:</p>
              <p><a href="${resetUrl}">${resetUrl}</a></p>
              <div class="warning">
                <strong>Important:</strong> This link will expire in 1 hour for security reasons.
              </div>
              <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
            </div>
            <div class="footer">
              <p>&copy; 2025 Ovalife. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Password Reset Request - Ovalife\n\nHi ${firstName},\n\nWe received a request to reset your password for your Ovalife account.\n\nClick this link to reset your password:\n${resetUrl}\n\nThis link will expire in 1 hour for security reasons.\n\nIf you didn't request a password reset, please ignore this email or contact support if you have concerns.\n\n© 2025 Ovalife. All rights reserved.`,
  };
};

/**
 * Escrow created notification email
 * @param {string} recipientName - Recipient's name
 * @param {string} escrowNumber - Escrow number
 * @param {string} type - Escrow type (fresh_cycle or frozen_cycle)
 * @param {number} amount - Escrow amount
 * @returns {Object} - Subject and HTML content
 */
const escrowCreatedEmail = (recipientName, escrowNumber, type, amount) => {
  return {
    subject: `New Escrow Created - ${escrowNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .info-box { background-color: #e3f2fd; border-left: 4px solid #2196F3; padding: 15px; margin: 15px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Escrow Created</h1>
            </div>
            <div class="content">
              <h2>Hi ${recipientName},</h2>
              <p>A new escrow has been created for your transaction.</p>
              <div class="info-box">
                <strong>Escrow Details:</strong><br/>
                Escrow Number: <strong>${escrowNumber}</strong><br/>
                Type: <strong>${type}</strong><br/>
                Amount: <strong>$${amount}</strong>
              </div>
              <p>You can view the full details by logging into your Ovalife account.</p>
              <p>If you have any questions, please contact our support team.</p>
            </div>
            <div class="footer">
              <p>&copy; 2025 Ovalife. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Escrow Created\n\nHi ${recipientName},\n\nA new escrow has been created for your transaction.\n\nEscrow Details:\nEscrow Number: ${escrowNumber}\nType: ${type}\nAmount: $${amount}\n\nYou can view the full details by logging into your Ovalife account.\n\nIf you have any questions, please contact our support team.\n\n© 2025 Ovalife. All rights reserved.`,
  };
};

/**
 * Escrow status update notification email
 * @param {string} recipientName - Recipient's name
 * @param {string} escrowNumber - Escrow number
 * @param {string} oldStatus - Previous status
 * @param {string} newStatus - New status
 * @returns {Object} - Subject and HTML content
 */
const escrowStatusUpdateEmail = (
  recipientName,
  escrowNumber,
  oldStatus,
  newStatus
) => {
  return {
    subject: `Escrow Status Updated - ${escrowNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #673AB7; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .status-box { background-color: #f3e5f5; border-left: 4px solid #673AB7; padding: 15px; margin: 15px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Escrow Status Updated</h1>
            </div>
            <div class="content">
              <h2>Hi ${recipientName},</h2>
              <p>The status of your escrow has been updated.</p>
              <div class="status-box">
                <strong>Escrow Number:</strong> ${escrowNumber}<br/>
                <strong>Previous Status:</strong> ${oldStatus}<br/>
                <strong>New Status:</strong> ${newStatus}
              </div>
              <p>Log in to your Ovalife account to view complete details.</p>
            </div>
            <div class="footer">
              <p>&copy; 2025 Ovalife. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Escrow Status Updated\n\nHi ${recipientName},\n\nThe status of your escrow has been updated.\n\nEscrow Number: ${escrowNumber}\nPrevious Status: ${oldStatus}\nNew Status: ${newStatus}\n\nLog in to your Ovalife account to view complete details.\n\n© 2025 Ovalife. All rights reserved.`,
  };
};

/**
 * Task assignment notification email
 * @param {string} recipientName - Recipient's name
 * @param {string} taskTitle - Task title
 * @param {string} taskDate - Task date
 * @param {string} taskTime - Task time
 * @returns {Object} - Subject and HTML content
 */
const taskAssignmentEmail = (recipientName, taskTitle, taskDate, taskTime) => {
  return {
    subject: `New Task Assigned: ${taskTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #FF9800; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .task-box { background-color: #fff3e0; border-left: 4px solid #FF9800; padding: 15px; margin: 15px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Task Assigned</h1>
            </div>
            <div class="content">
              <h2>Hi ${recipientName},</h2>
              <p>You have been assigned a new task.</p>
              <div class="task-box">
                <strong>Task:</strong> ${taskTitle}<br/>
                <strong>Date:</strong> ${taskDate}<br/>
                <strong>Time:</strong> ${taskTime}
              </div>
              <p>Please log in to your account to view task details and take action.</p>
            </div>
            <div class="footer">
              <p>&copy; 2025 Ovalife. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `New Task Assigned\n\nHi ${recipientName},\n\nYou have been assigned a new task.\n\nTask: ${taskTitle}\nDate: ${taskDate}\nTime: ${taskTime}\n\nPlease log in to your account to view task details and take action.\n\n© 2025 Ovalife. All rights reserved.`,
  };
};

/**
 * Generic notification email
 * @param {string} recipientName - Recipient's name
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @returns {Object} - Subject and HTML content
 */
const genericNotificationEmail = (recipientName, title, message) => {
  return {
    subject: title,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #607D8B; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${title}</h1>
            </div>
            <div class="content">
              <h2>Hi ${recipientName},</h2>
              <p>${message}</p>
            </div>
            <div class="footer">
              <p>&copy; 2025 Ovalife. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `${title}\n\nHi ${recipientName},\n\n${message}\n\n© 2025 Ovalife. All rights reserved.`,
  };
};

/**
 * Platform invitation email template
 * @param {string} senderName - Name of person sending invitation
 * @param {string} recipientRole - Role (Donor, Parent, etc.)
 * @param {string} invitationLink - Unique invitation link
 * @returns {Object} - Subject and HTML content
 */
const invitationEmail = (senderName, recipientRole, invitationLink) => {
  return {
    subject: `You're invited to join Ovalife as a ${recipientRole}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .button { display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
            .link-box { background-color: #e3f2fd; border-left: 4px solid #2196F3; padding: 15px; margin: 15px 0; word-break: break-all; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>You're Invited to Ovalife!</h1>
            </div>
            <div class="content">
              <h2>Hello,</h2>
              <p><strong>${senderName}</strong> has invited you to join the Ovalife platform as a <strong>${recipientRole}</strong>.</p>
              <p>Ovalife is a fertility and reproductive services platform that connects donors, parents, and clinics.</p>
              <p>Click the button below to accept your invitation and get started:</p>
              <a href="${invitationLink}" class="button">Accept Invitation</a>
              <p>Or copy and paste this link into your browser:</p>
              <div class="link-box">
                ${invitationLink}
              </div>
              <p>This invitation link is unique to you and should not be shared with others.</p>
              <p>If you have any questions or didn't expect this invitation, please contact our support team.</p>
            </div>
            <div class="footer">
              <p>&copy; 2025 Ovalife. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `You're Invited to Ovalife!\n\nHello,\n\n${senderName} has invited you to join the Ovalife platform as a ${recipientRole}.\n\nOvalife is a fertility and reproductive services platform that connects donors, parents, and clinics.\n\nClick this link to accept your invitation:\n${invitationLink}\n\nThis invitation link is unique to you and should not be shared with others.\n\nIf you have any questions or didn't expect this invitation, please contact our support team.\n\n© 2025 Ovalife. All rights reserved.`,
  };
};

module.exports = {
  welcomeEmail,
  passwordResetEmail,
  escrowCreatedEmail,
  escrowStatusUpdateEmail,
  taskAssignmentEmail,
  genericNotificationEmail,
  invitationEmail,
};
