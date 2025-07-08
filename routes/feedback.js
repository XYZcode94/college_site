const router = require("express").Router();
const Feedback = require("../models/Feedback");

router.post("/", async (req, res) => {
  try {
    const { name, message } = req.body;
    const fb = new Feedback({ name, message });
    await fb.save();
    res.json({ success: true, msg: "Feedback received!" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

router.get("/", async (req, res) => {
  const feedbacks = await Feedback.find().sort({ date: -1 });
  res.json(feedbacks);
});

module.exports = router;
