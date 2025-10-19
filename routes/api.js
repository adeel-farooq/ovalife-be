const express = require("express");
const router = express.Router();

router.get("/hello", (req, res) => {
  res.json({ msg: "Hello from ovalife-node API" });
});

// Mount module routes
const authRoutes = require("./auth");
const userRoutes = require("./user");

router.use("/auth", authRoutes);
router.use("/user", userRoutes);

module.exports = router;
