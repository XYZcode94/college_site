const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: { type: String, enum: ["student", "faculty", "admin"], default: "student" }
});
module.exports = mongoose.model("User", userSchema);
