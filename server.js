app.post("/contact", async (req, res) => {
  const { name, email, phone, message } = req.body;

  console.log("New lead:", req.body);

  try {
    // 1. EMAIL
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "armanshaik5120@gmail.com",
      subject: "New Lead",
      html: `<h3>${name}</h3><p>${email}</p><p>${message}</p>`
    });

    // 2. WHATSAPP ALERT
    await axios.post(
      `https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: "91XXXXXXXXXX",
        type: "text",
        text: { body: `New lead: ${name} (${phone})` }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({ success: true });

  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});