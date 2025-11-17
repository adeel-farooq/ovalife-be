const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "ovalife";

/**
 * Handle successful Google OAuth authentication
 * Generates JWT token and returns user data
 */
const googleAuthSuccess = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed. No user data.",
      });
    }

    // Generate JWT token for the authenticated user
    const token = jwt.sign(
      {
        id: req.user.id,
        email: req.user.email,
        type: req.user.type,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Google authentication successful.",
      token,
      user: {
        id: req.user.id,
        email: req.user.email,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        profile_picture_url: req.user.profile_picture_url,
        type: req.user.type,
        oauth_provider: req.user.oauth_provider,
      },
    });
  } catch (error) {
    console.error("Google auth success handler error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during authentication.",
    });
  }
};

/**
 * Handle failed Google OAuth authentication
 */
const googleAuthFailure = (req, res) => {
  return res.status(401).json({
    success: false,
    message: "Google authentication failed. Please try again.",
  });
};

/**
 * Get OAuth user profile (for testing/debugging)
 */
const getOAuthProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated.",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: req.user.id,
        email: req.user.email,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        profile_picture_url: req.user.profile_picture_url,
        oauth_provider: req.user.oauth_provider,
        type: req.user.type,
      },
    });
  } catch (error) {
    console.error("Get OAuth profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

module.exports = {
  googleAuthSuccess,
  googleAuthFailure,
  getOAuthProfile,
};
