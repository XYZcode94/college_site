const router = require("express").Router();
const Contact = require("../models/Contact");

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const contact = new Contact({ name, email, message });
    await contact.save();
    res.json({ success: true, msg: "Message sent!" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
