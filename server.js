app.post("/contact", async (req, res) => {
  const { name, email, phone, message } = req.body;

  console.log("🔥 CONTACT HIT:", req.body);

  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "armanshaik5120@gmail.com",

      subject: `🔥 New Lead from ${name} - AR Marketing Agency`,

      html: `
      <div style="font-family: Arial; background:#0f172a; padding:30px;">
        <div style="max-width:600px; margin:auto; background:#ffffff; padding:30px; border-radius:12px;">

          <h1 style="color:#111; margin-bottom:10px;">🚀 New Client Inquiry</h1>

          <p style="color:#555;">
            A potential client has submitted a request through your AR Marketing Agency website.
          </p>

          <div style="background:#f1f5f9; padding:15px; border-radius:8px; margin-top:20px;">
            <p><b>👤 Name:</b> ${name}</p>
            <p><b>📧 Email:</b> ${email}</p>
            <p><b>📞 Phone:</b> ${phone}</p>
          </div>

          <div style="margin-top:20px;">
            <h3>💬 Message</h3>
            <p style="background:#f8fafc; padding:15px; border-left:4px solid #6366f1;">
              ${message}
            </p>
          </div>

          <div style="margin-top:25px; font-size:12px; color:#888;">
            Powered by AR Marketing Automation System
          </div>

        </div>
      </div>
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