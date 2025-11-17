const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth/index");
const oauthController = require("../controllers/auth/oauth");
const passport = require("../config/passport");

const auth = require("../middleware/auth");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/profile", auth, authController.profile);
router.post("/forget-password", authController.forgetPassword);
router.post("/reset-password", authController.resetPassword);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/auth/google/failure",
    session: false,
  }),
  oauthController.googleAuthSuccess
);

router.get("/google/failure", oauthController.googleAuthFailure);
router.get("/google/profile", auth, oauthController.getOAuthProfile);

module.exports = router;
