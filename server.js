// ================= IMPORTS =================
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { Resend } = require("resend");

// ================= APP INIT =================
const app = express();
app.use(express.json());
app.use(cors());

// ================= ENV =================
const VERIFY_TOKEN = "ar_bot_123";
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const resend = new Resend(process.env.RESEND_API_KEY);

// ================= HOME ROUTE =================
app.get("/", (req, res) => {
  res.send("🔥 Backend is running successfully");
});

// ================= CONTACT ROUTE =================
app.post("/contact", async (req, res) => {
  const { name, email, phone, message } = req.body;

  console.log("🔥 CONTACT HIT:", req.body);

  try {
    // EMAIL SENDING (optional)
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "your-email@gmail.com",
      subject: `New Lead from ${name}`,
      html: `
        <h2>New Lead Received</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Message:</b> ${message}</p>
      `
    });

    res.json({ success: true });

  } catch (err) {
    console.log("❌ Email error:", err.message);
    res.json({ success: false });
  }
});

// ================= WHATSAPP VERIFY WEBHOOK =================
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    console.log("Webhook verified");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// ================= SEND WHATSAPP MESSAGE =================
async function sendMessage(to, text) {
  try {
    await axios.post(
      `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: to,
        type: "text",
        text: { body: text }
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (err) {
    console.log("❌ WhatsApp send error:", err.response?.data || err.message);
  }
}

// ================= WHATSAPP WEBHOOK (MAIN BOT) =================
// ================= WHATSAPP WEBHOOK (AUTO BOT) =================
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    const message = value?.messages?.[0];
    const from = message?.from;
    const text = message?.text?.body;

    console.log("📩 Incoming message:", text);

    if (from && text) {
      let reply = "";

      // 🔹 AUTOMATION LOGIC
      const userMsg = text.toLowerCase();

      if (userMsg.includes("hello") || userMsg.includes("hi")) {
        reply = "👋 Hi! Welcome to AR Marketing Agency.\nHow can I help you today?";
      } 
      else if (userMsg.includes("price")) {
        reply = "💰 Our pricing starts from ₹5000.\nWould you like full package details?";
      } 
      else if (userMsg.includes("services")) {
        reply = "🚀 We offer:\n• WhatsApp Bots\n• AI Marketing\n• Website Development\n\nWhich service are you interested in?";
      } 
      else if (userMsg.includes("yes") || userMsg.includes("interested")) {
        reply = "🔥 Great! Please share your name and phone number so our team can contact you.";
      }
      else {
        reply = "🤖 Thanks for your message! Our team will contact you soon.";
      }

      // 🔹 SEND REPLY
      await sendMessage(from, reply);
    }

    res.sendStatus(200);
  } catch (error) {
    console.log("❌ Webhook error:", error.message);
    res.sendStatus(200);
  }
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});