const express = require("express");
const router = express.Router();

router.get("/hello", (req, res) => {
  res.json({ msg: "Hello from ovalife-node API" });
});

// Mount module routes
const authRoutes = require("./auth");

router.use("/auth", authRoutes);

module.exports = router;
