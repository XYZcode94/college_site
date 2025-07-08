const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  roll: { type: String, required: true, unique: true },
  name: String,
  department: String,
  marks: Number,
  grade: String,
  status: String, // e.g. "Pass", "Fail"
  updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Result", resultSchema);
