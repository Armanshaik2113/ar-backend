const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

// 🔥 EMAIL SETUP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "armanshaik5120@gmail.com",       // 👈 your email
    pass: "wauk ngue husm pxzc"     // 👈 app password
  }
});

// 📩 CONTACT ROUTE
app.post("/contact", async (req, res) => {
  const { name, email, phone, message } = req.body;

  console.log("🔥 CONTACT HIT:", req.body);

  try {
    await transporter.sendMail({
      from: `"ARk Agency Website" <armanshaik5120@gmail.com>`,
      to: "armanshaik5120@gmail.com", // 👈 where YOU receive leads
      subject: "🚀 New Lead from Website",
      html: `
        <h2>New Client Enquiry</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Message:</b> ${message}</p>
      `
    });

    res.json({ success: true });
  } catch (error) {
    console.error("❌ Email error:", error);
    res.status(500).json({ success: false });
  }
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});