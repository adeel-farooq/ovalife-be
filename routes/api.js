const express = require("express");
const router = express.Router();

router.get("/hello", (req, res) => {
  res.json({ msg: "Hello from ovalife-node API" });
});

// Mount module routes
const authRoutes = require("./auth");
const userRoutes = require("./user");
const taskRoutes = require("./task");
const chatRoutes = require("./chat");
const escrowRoutes = require("./escrow");
const invitationRoutes = require("./invitation");
const settingsRoutes = require("./settings");
const emailTemplateRoutes = require("./emailTemplate");
const questionnaireRoutes = require("./questionnaire");

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/task", taskRoutes);
router.use("/chat", chatRoutes);
router.use("/escrow", escrowRoutes);
router.use("/invitation", invitationRoutes);
router.use("/settings", settingsRoutes);
router.use("/email-template", emailTemplateRoutes);
router.use("/questionnaire", questionnaireRoutes);

module.exports = router;
