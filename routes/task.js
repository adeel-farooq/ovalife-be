const express = require("express");
const router = express.Router();
const authController = require("../controllers/task/index");

const auth = require("../middleware/auth");

router.post("/create", auth, authController.createTask);
router.put("/:id", auth, authController.updateTask);
router.delete("/:id", auth, authController.deleteTask);
router.get("/by/:id", auth, authController.getTask);
router.get("/list", auth, authController.getTasks);

module.exports = router;
