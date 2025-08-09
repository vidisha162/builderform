import mongoose from "mongoose";

const fieldSchema = new mongoose.Schema({
  label: String,
  type: String,
  placeholder: String,
  options: [String], // For dropdowns, radios, checkboxes
});

const formSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fields: [fieldSchema],
}, { timestamps: true });

const Form = mongoose.model("Form", formSchema);

export default Form;
