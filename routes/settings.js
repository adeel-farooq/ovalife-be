const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/settings/index");
const auth = require("../middleware/auth");

// Get all settings for current user
router.get("/", auth, settingsController.getSettings);

// Update basic information
router.put("/basic-info", auth, settingsController.updateBasicInfo);

// Update home address
router.put("/address", auth, settingsController.updateHomeAddress);

// Update partner information
router.put("/partner", auth, settingsController.updatePartnerInfo);

// Update password
router.put("/password", auth, settingsController.updatePassword);

// Update notification settings
router.put(
  "/notifications",
  auth,
  settingsController.updateNotificationSettings
);

// Update matching preferences
router.put(
  "/matching-preferences",
  auth,
  settingsController.updateMatchingPreferences
);

// Two-factor authentication
router.put("/two-factor", auth, settingsController.updateTwoFactor);
router.post("/two-factor/device", auth, settingsController.addTwoFactorDevice);
router.delete(
  "/two-factor/device/:id",
  auth,
  settingsController.removeTwoFactorDevice
);

module.exports = router;
