const { createTransporter, emailConfig } = require("../config/email");

/**
 * Generic function to send an email
 * @param {Object} options - Email options
 * @param {string|Array} options.to - Recipient email(s)
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text body
 * @param {string} options.html - HTML body
 * @param {string} options.from - Sender email (optional, uses default)
 * @param {Array} options.attachments - Attachments (optional)
 * @param {string|Array} options.cc - CC recipients (optional)
 * @param {string|Array} options.bcc - BCC recipients (optional)
 * @returns {Promise} - Resolves with info or rejects with error
 */
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: options.from || emailConfig.from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      cc: options.cc,
      bcc: options.bcc,
      attachments: options.attachments,
      replyTo: options.replyTo || emailConfig.replyTo,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return {
      success: true,
      messageId: info.messageId,
      response: info.response,
    };
  } catch (error) {
    console.error("Email send error:", error);
    throw error;
  }
};

/**
 * Send a simple text email
 * @param {string|Array} to - Recipient email(s)
 * @param {string} subject - Email subject
 * @param {string} message - Plain text message
 * @returns {Promise}
 */
const sendTextEmail = async (to, subject, message) => {
  return sendEmail({
    to,
    subject,
    text: message,
  });
};

/**
 * Send an HTML email
 * @param {string|Array} to - Recipient email(s)
 * @param {string} subject - Email subject
 * @param {string} htmlContent - HTML content
 * @returns {Promise}
 */
const sendHtmlEmail = async (to, subject, htmlContent) => {
  return sendEmail({
    to,
    subject,
    html: htmlContent,
  });
};

/**
 * Send email with attachment
 * @param {string|Array} to - Recipient email(s)
 * @param {string} subject - Email subject
 * @param {string} message - Email message (text or html)
 * @param {Array} attachments - Array of attachment objects
 * @param {boolean} isHtml - Whether message is HTML
 * @returns {Promise}
 */
const sendEmailWithAttachment = async (
  to,
  subject,
  message,
  attachments,
  isHtml = false
) => {
  const options = {
    to,
    subject,
    attachments,
  };

  if (isHtml) {
    options.html = message;
  } else {
    options.text = message;
  }

  return sendEmail(options);
};

/**
 * Send bulk emails (to multiple recipients)
 * @param {Array} recipients - Array of recipient emails
 * @param {string} subject - Email subject
 * @param {string} message - Email message
 * @param {boolean} isHtml - Whether message is HTML
 * @returns {Promise} - Array of results
 */
const sendBulkEmails = async (recipients, subject, message, isHtml = false) => {
  const emailPromises = recipients.map((recipient) => {
    const options = {
      to: recipient,
      subject,
    };

    if (isHtml) {
      options.html = message;
    } else {
      options.text = message;
    }

    return sendEmail(options).catch((error) => ({
      success: false,
      recipient,
      error: error.message,
    }));
  });

  return Promise.all(emailPromises);
};

/**
 * Verify email configuration
 * @returns {Promise<boolean>}
 */
const verifyEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log("Email configuration is valid and ready to send emails");
    return true;
  } catch (error) {
    console.error("Email configuration error:", error);
    return false;
  }
};

module.exports = {
  sendEmail,
  sendTextEmail,
  sendHtmlEmail,
  sendEmailWithAttachment,
  sendBulkEmails,
  verifyEmailConfig,
};
