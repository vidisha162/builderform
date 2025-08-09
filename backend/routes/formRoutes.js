const express = require("express");
const router = express.Router();
const {
  createForm,
  getForms,
  getFormById,
} = require("../controllers/formController");


// Create a new form
router.post("/", createForm);

// Get all forms
router.get("/", getForms);

// Get a single form by ID
router.get("/:id", getFormById);

module.exports = router;
