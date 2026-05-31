const sendVerificationEmail =
  async (email, otp) => {
    console.log("Sending verification OTP via EmailJS to:", email);
    console.log("OTP =", otp);

    const payload = {
      service_id: "service_s63d1qt",
      template_id: "template_lyy27ns",
      user_id: "t0hko6qmXDfjVglF2",
      template_params: {
        name: email.split("@")[0],
        email: email,
        subject: "PrepTrack Email Verification",
        message: `Your OTP for PrepTrack verification is: ${otp}. It is valid for 5 minutes.`,
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
      console.log("Verification email sent successfully via EmailJS!");
    } catch (err) {
      console.log("SENDMAIL ERROR:", err);
      throw err;
    }
  };

module.exports = sendVerificationEmail;