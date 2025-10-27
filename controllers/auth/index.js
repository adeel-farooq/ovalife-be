const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const UserClinic = require("../../models/user_clinic");
const Helper = require("./helper");
const { Op } = require("sequelize");
const crypto = require("crypto");
// Generate secure random token
const resetToken = crypto.randomBytes(32).toString("hex");
const hashedToken = crypto
  .createHash("sha256")
  .update(resetToken)
  .digest("hex");

const JWT_SECRET = process.env.JWT_SECRET || "ovalife";

const register = async (req, res) => {
  try {
    const { email, password, first_name, last_name, clinic_ids } = req.body;

    // Defensive field presence check
    if (!email?.trim() || !password?.trim()) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    // Hash password securely
    const salt = await bcrypt.genSalt(12); // Slightly stronger salt rounds
    const password_hash = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      email,
      password: password_hash,
      first_name,
      last_name,
      is_active: true,
      // created_by: req.user.id,
    });

    // Defensive check
    if (!user?.id) {
      return res.status(500).json({ message: "User creation failed." });
    }

    if (clinic_ids && Array.isArray(clinic_ids)) {
      const userClinicEntries = clinic_ids.map((clinic_id) => ({
        user_id: user.id,
        clinic_id,
      }));
      await UserClinic.bulkCreate(userClinicEntries);
    }

    // Success response
    return res.status(201).json({
      message: "User registered successfully.",
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        created_at: user.created_at,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    // Defensive check
    if (!email?.trim() || !password?.trim()) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Find user by email
    const user = await User.findOne({
      where: { email, is_active: true },
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // Optional: update last_login timestamp or audit field
    // await user.update({ updated_by: "self", updated_at: new Date() });

    // Success response
    return res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const profile = async (req, res) => {
  try {
    const userId = req?.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized access." });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Return only safe fields
    delete user.dataValues.password; // Remove sensitive info
    return res.status(200).json({
      user,
    });
  } catch (err) {
    console.error("Profile fetch error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email?.trim()) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await User.findOne({ where: { email, is_active: true } });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save token + expiry in DB for that specific user
    await user.update({
      reset_password_token: hashedToken,
      reset_password_expires: Date.now() + 60 * 60 * 1000, // 1 hour
    });

    // Prepare password reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Send email
    await Helper.sendEmail({
      to: email,
      subject: "Password Reset Request",
      text: `Click the link to reset your password: ${resetLink}`,
    });

    return res.status(200).json({
      message: "Password reset link sent to email.",
    });
  } catch (error) {
    console.error("Forget Password error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token?.trim() || !newPassword?.trim()) {
      return res.status(400).json({
        message: "Token and new password are required.",
      });
    }

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long." });
    }

    // Hash token to match stored hash
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find valid user
    const user = await User.findOne({
      where: {
        reset_password_token: hashedToken,
        reset_password_expires: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    const password_hash = await bcrypt.hash(newPassword, salt);

    // Update password and clear reset fields
    await user.update({
      password: password_hash,
      reset_password_token: null,
      reset_password_expires: null,
    });
    await Helper.sendEmail({
      to: user.email,
      subject: "Password Changed Successfully",
      text: "Your password has been updated successfully. If you didn’t request this, contact support immediately.",
    });

    return res
      .status(200)
      .json({ message: "Password has been reset successfully." });
  } catch (error) {
    console.error("Reset Password error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { register, login, profile, forgetPassword, resetPassword };
