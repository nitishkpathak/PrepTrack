const sendEmail = require("./sendEmail");
const sendEmailJS = require("./sendEmailJS");

const sendOtpEmail = async ({ email, subject, otp, title }) => {
  try {
    if (process.env.EMAILJS_SERVICE_ID && process.env.EMAILJS_PUBLIC_KEY) {
      await sendEmailJS({
        email: email,
        subject: subject,
        otp: otp,
        html: `Your PrepTrack verification code is: ${otp}. It is valid for 10 minutes.`,
      });
      return;
    } else {
      throw new Error("EmailJS not configured. Falling back to SMTP.");
    }
  } catch (emailjsError) {
    console.warn("EmailJS failed, falling back to Nodemailer SMTP:", emailjsError.message);
    try {
      await sendEmail({
        email: email,
        subject: subject,
        otp: otp,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px;">
            <h2 style="color: #2563eb;">${title} 🚀</h2>
            <p>Please use the following One-Time Password (OTP) to complete your request:</p>
            <div style="font-size: 24px; font-weight: bold; color: #2563eb; letter-spacing: 4px; padding: 15px; background-color: #eff6ff; text-align: center; border-radius: 5px; margin: 20px 0;">
              ${otp}
            </div>
            <p style="font-size: 12px; color: #666;">This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
          </div>
        `,
      });
    } catch (smtpError) {
      console.error("SMTP also failed:", smtpError.message);
      throw new Error(`Email dispatch failed. EmailJS: ${emailjsError.message}. SMTP: ${smtpError.message}`);
    }
  }
};

module.exports = { sendOtpEmail };
