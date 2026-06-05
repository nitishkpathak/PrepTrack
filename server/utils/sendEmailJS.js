const sendEmailJS = async (options) => {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_OTP_TEMPLATE_ID || process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY; // Optional private key / accessToken

  if (!serviceId || !publicKey) {
    throw new Error("EmailJS credentials (EMAILJS_SERVICE_ID or EMAILJS_PUBLIC_KEY) are missing in environment variables.");
  }

  const payload = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    template_params: {
      to_email: options.email,
      email: options.email,
      subject: options.subject,
      message: options.html, // html/text message
      otp: options.otp || "", // 6-digit OTP code
    },
  };

  if (privateKey) {
    payload.accessToken = privateKey;
  }

  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`EmailJS HTTP API failed with status ${response.status}: ${errorText}`);
  }

  console.log("Email sent successfully via EmailJS HTTP REST API");
};

module.exports = sendEmailJS;
