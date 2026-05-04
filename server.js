const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");

const app = express();

// ---------------- MIDDLEWARE ----------------
app.use(express.json());

app.use(cors({
  origin: "*", // for testing; later you can restrict to your domain
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

// ---------------- RESEND SETUP ----------------
const resend = new Resend(process.env.RESEND_API_KEY);

// ---------------- TEST ROUTE ----------------
app.get("/", (req, res) => {
  res.send("🔥 Backend is running successfully");
});

// ---------------- CONTACT ROUTE ----------------
app.post("/contact", async (req, res) => {
  const { name, email, phone, message } = req.body;

  console.log("🔥 CONTACT HIT:", req.body);

  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "armanshaik5120@gmail.com", // 👈 CHANGE THIS TO YOUR REAL EMAIL
      subject: "New Contact Form Submission",
      html: `
        <h2>New Lead Received</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Message:</b> ${message}</p>
      `
    });

    console.log("📩 EMAIL SENT SUCCESSFULLY:", response);

    res.json({
      success: true,
      message: "Form submitted and email sent successfully"
    });

  } catch (error) {
    console.log("❌ EMAIL ERROR:", error);

    res.json({
      success: false,
      message: "Form received but email failed",
      error: error.message
    });
  }
});

// ---------------- SERVER START ----------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});