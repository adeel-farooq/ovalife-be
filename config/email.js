const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === "true" || false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Email configuration defaults
const emailConfig = {
  from: process.env.EMAIL_FROM || '"Ovalife" <noreply@ovalife.com>',
  replyTo: process.env.EMAIL_REPLY_TO || "support@ovalife.com",
};

module.exports = {
  createTransporter,
  emailConfig,
};
