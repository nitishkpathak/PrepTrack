const sendEmail = async (options) => {
  // If EmailJS credentials are provided, use EmailJS HTTP API to bypass Render Free Tier SMTP block
  if (process.env.EMAILJS_SERVICE_ID && process.env.EMAILJS_PUBLIC_KEY) {
    const serviceId = process.env.EMAILJS_SERVICE_ID;
    // Use dedicated OTP template if set, otherwise fallback to standard template
    const templateId = process.env.EMAILJS_OTP_TEMPLATE_ID || process.env.EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.EMAILJS_PUBLIC_KEY;
    const privateKey = process.env.EMAILJS_PRIVATE_KEY; // Optional private key

    const payload = {
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: {
        to_email: options.email,
        email: options.email,
        subject: options.subject,
        message: options.html, // HTML body for fallback
        otp: options.otp || "", // OTP code for template
      },
    };

    if (privateKey) {
      payload.accessToken = privateKey;
    }

    try {
      const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log("Email sent successfully via EmailJS HTTP REST API");
        return;
      }

      const errorText = await response.text();
      console.warn(`EmailJS HTTP API failed (${response.status}: ${errorText}). Falling back to Nodemailer SMTP.`);
    } catch (e) {
      console.warn("EmailJS HTTP API connection failed. Falling back to Nodemailer SMTP.", e);
    }
  }

  // Fallback to Nodemailer SMTP (works locally or on paid Render servers)
  const nodemailer = require("nodemailer");
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // TLS port 587 requires secure: false
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"PrepTrack 🚀" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;