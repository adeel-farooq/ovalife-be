const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat/index");
const auth = require("../middleware/auth");

router.post("/create-message", auth, chatController.createChat);
router.get("/messages-list", auth, chatController.getAll);
router.get("/by/:id", auth, chatController.getById);
router.put("/update-message/:id", auth, chatController.updateChat);
router.delete("/delete-message/:id", auth, chatController.deleteChat);
module.exports = router;
