// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/feedback", require("./routes/feedback"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/auth", require("./routes/auth"));

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ Mongo Error:", err));

app.get("/", (req, res) => res.send("College Backend Running!"));
app.listen(process.env.PORT, () => console.log(`🚀 Server on port ${process.env.PORT}`));

app.use("/api/results", require("./routes/result"));
