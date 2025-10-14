const sendEmail = async ({ to, subject, text }) => {
  try {
    // Use a real email service in production (e.g., SendGrid, SES, etc.)
  } catch (error) {
    console.error("Send Email error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { sendEmail };
