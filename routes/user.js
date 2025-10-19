const express = require("express");
const router = express.Router();

const additionalDetails = require("../controllers/additionalDetail");
const auth = require("../middleware/auth");

router.post("/additional-details", auth, additionalDetails.create);
router.get("/additional-details", auth, additionalDetails.get);
router.post("/filter", auth, additionalDetails.filterSave);
router.get("/filter", auth, additionalDetails.filterGet);

module.exports = router;
