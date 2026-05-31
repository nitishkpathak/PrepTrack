const sendEmail =
  async (email, otp) => {
    console.log("Sending password reset OTP via EmailJS to:", email);
    console.log("OTP =", otp);

    const payload = {
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,
      user_id: process.env.EMAILJS_PUBLIC_KEY,
      template_params: {
        name: email.split("@")[0],
        email: email,
        subject: "PrepTrack Password Reset OTP",
        message: `Your OTP for resetting your PrepTrack password is: ${otp}. It is valid for 5 minutes.`,
        time: new Date().toLocaleString(),
      }
    };

    try {
      const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "origin": "http://localhost:3000"
        },
        body: JSON.stringify(payload)
      });

      const responseText = await res.text();
      if (res.status !== 200) {
        throw new Error(`EmailJS send failed: ${res.status} - ${responseText}`);
      }
      console.log("Password reset email sent successfully via EmailJS!");
    } catch (err) {
      console.log("SENDMAIL ERROR:", err);
      throw err;
    }
  };

module.exports = sendEmail;