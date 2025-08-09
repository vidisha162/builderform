const Form = require("../models/Form");

// @desc    Create a new form
// @route   POST /api/forms
// @access  Public (can make it private later)
const createForm = async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({ message: "Title and questions are required" });
    }

    const newForm = await Form.create({
      title,
      description,
      questions,
    });

    res.status(201).json(newForm);
  } catch (error) {
    console.error("Error creating form:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all forms
// @route   GET /api/forms
// @access  Public
const getForms = async (req, res) => {
  try {
    const forms = await Form.find();
    res.status(200).json(forms);
  } catch (error) {
    console.error("Error fetching forms:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get a single form by ID
// @route   GET /api/forms/:id
// @access  Public
const getFormById = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.status(200).json(form);
  } catch (error) {
    console.error("Error fetching form:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createForm,
  getForms,
  getFormById,
};
