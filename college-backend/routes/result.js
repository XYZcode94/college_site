const router = require("express").Router();
const Result = require("../models/Result");
const jwt = require("jsonwebtoken");

// Middleware: admin only
function isAdmin(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") return res.status(403).json({ msg: "Access denied" });
    next();
  } catch (err) {
    res.status(400).json({ msg: "Invalid token" });
  }
}

// Public: Get result by roll number
router.get("/:roll", async (req, res) => {
  const result = await Result.findOne({ roll: req.params.roll.toUpperCase() });
  if (!result) return res.status(404).json({ msg: "Result not found" });
  res.json(result);
});

// Admin: Add/Update result
router.post("/", isAdmin, async (req, res) => {
  const { roll, name, department, marks, grade, status } = req.body;
  const updated = await Result.findOneAndUpdate(
    { roll },
    { roll, name, department, marks, grade, status },
    { upsert: true, new: true }
  );
  res.json({ msg: "Result saved", result: updated });
});

module.exports = router;
