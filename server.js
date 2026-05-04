const express = require("express");
const cors = require("cors");

const app = express(); // ✅ MUST BE FIRST

app.use(express.json());
app.use(cors());

// ---------------- ROUTES ----------------

// Home route
app.get("/", (req, res) => {
  res.send("Server running");
});

// Contact route
app.post("/contact", async (req, res) => {
  console.log(req.body);
  res.send("Contact received");
});

// Webhook verification
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "ar_bot_123";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Webhook messages
app.post("/webhook", (req, res) => {
  console.log("📩 Message:", req.body);
  res.sendStatus(200);
});

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});