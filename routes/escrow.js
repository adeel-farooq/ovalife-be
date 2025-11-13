const express = require("express");
const router = express.Router();
const escrowController = require("../controllers/escrow/index");
const auth = require("../middleware/auth");

// Create new escrow
router.post("/create", auth, escrowController.createEscrow);

// Update escrow
router.put("/:id", auth, escrowController.updateEscrow);

// Update process status specifically
router.patch("/:id/process-status", auth, escrowController.updateProcessStatus);

// Delete escrow (soft delete)
router.delete("/:id", auth, escrowController.deleteEscrow);

// Get single escrow by ID
router.get("/by/:id", auth, escrowController.getEscrow);

// Get all escrows with filters
router.get("/list", auth, escrowController.getEscrows);

module.exports = router;
