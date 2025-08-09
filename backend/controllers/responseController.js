const Response = require("../models/Response");
const Form = require("../models/Form");

// @desc    Submit a form response
// @route   POST /api/responses
// @access  Public
const submitResponse = async (req, res) => {
  try {
    const { formId, answers } = req.body;

    if (!formId || !answers) {
      return res.status(400).json({ message: "Form ID and answers are required" });
    }

    // Ensure form exists
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    const newResponse = await Response.create({
      formId,
      answers,
    });

    res.status(201).json({
      message: "Response submitted successfully",
      response: newResponse,
    });
  } catch (error) {
    console.error("Error submitting response:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all responses for a specific form
// @route   GET /api/responses/:formId
// @access  Public (can make private for admin)
const getResponsesByFormId = async (req, res) => {
  try {
    const responses = await Response.find({ formId: req.params.formId });

    if (!responses || responses.length === 0) {
      return res.status(404).json({ message: "No responses found for this form" });
    }

    res.status(200).json(responses);
  } catch (error) {
    console.error("Error fetching responses:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  submitResponse,
  getResponsesByFormId,
};
