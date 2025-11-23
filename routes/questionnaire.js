const express = require("express");
const router = express.Router();
const questionnaireController = require("../controllers/questionnaire/index");
const auth = require("../middleware/auth");
// Questionnaire routes
router.post("/create", auth, questionnaireController.createQuestionnaire);
router.put("/:id", auth, questionnaireController.updateQuestionnaire);
router.delete("/:id", auth, questionnaireController.deleteQuestionnaire);
router.get("/by/:id", auth, questionnaireController.getQuestionnaire);
router.get("/list", auth, questionnaireController.listQuestionnaires);

module.exports = router;
