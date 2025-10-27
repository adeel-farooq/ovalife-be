const express = require("express");
const router = express.Router();

router.get("/hello", (req, res) => {
  res.json({ msg: "Hello from ovalife-node API" });
});

// Mount module routes
const authRoutes = require("./auth");
const userRoutes = require("./user");
const taskRoutes = require("./task");

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/task", taskRoutes);

module.exports = router;
