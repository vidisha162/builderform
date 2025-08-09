const express = require("express");
const router = express.Router();
const {
  submitResponse,
  getResponsesByFormId,
} = require("../controllers/responseController");

// Submit a response to a form
router.post("/", submitResponse);

// Get all responses for a specific form
router.get("/:formId", getResponsesByFormId);

module.exports = router;
