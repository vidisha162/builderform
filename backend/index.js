import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ----------------- MongoDB Connection -----------------
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ----------------- Models -----------------
const formSchema = new mongoose.Schema({
  title: String,
  fields: Array
}, { timestamps: true });

const Form = mongoose.model("Form", formSchema);

const responseSchema = new mongoose.Schema({
  formId: { type: mongoose.Schema.Types.ObjectId, ref: "Form", required: true },
  answers: { type: Object, required: true }
}, { timestamps: true });

const Response = mongoose.model("Response", responseSchema);

// ----------------- Routes -----------------

// Create a new form
app.post("/api/forms", async (req, res) => {
  try {
    const { title, fields } = req.body;
    const form = new Form({ title, fields });
    await form.save();
    res.status(201).json({ message: "Form created successfully", form });
  } catch (error) {
    res.status(500).json({ error: "Failed to create form" });
  }
});

// Get a form by ID
app.get("/api/forms/:id", async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ error: "Form not found" });
    res.json(form);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch form" });
  }
});

// Submit form responses
app.post("/api/forms/:formId/responses", async (req, res) => {
  try {
    const { formId } = req.params;
    const { answers } = req.body;

    const response = new Response({ formId, answers });
    await response.save();

    res.status(201).json({ message: "Response submitted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to submit response" });
  }
});

// Get all responses for a form
app.get("/api/forms/:formId/responses", async (req, res) => {
  try {
    const responses = await Response.find({ formId: req.params.formId });
    res.json(responses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch responses" });
  }
});

// ----------------- Start Server -----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
