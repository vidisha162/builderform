const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Form.questions", // reference to the question inside the form
    required: true,
  },
  answer: mongoose.Schema.Types.Mixed, // can be string, array, or object depending on type
});

const responseSchema = new mongoose.Schema(
  {
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
      required: true,
    },
    userName: { type: String }, // optional: if you want to track who submitted
    answers: [answerSchema],
    score: { type: Number }, // optional: calculated when checking answers
  },
  { timestamps: true }
);

module.exports = mongoose.model("Response", responseSchema);
