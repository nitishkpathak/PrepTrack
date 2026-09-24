const sendEmail = require("./sendEmail");
const sendEmailJS = require("./sendEmailJS");

const sendOtpEmail = async ({ email, name, subject, otp, title }) => {
  const userName = name || email.split("@")[0];
  const timing = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "short",
  });

  const otpMessage = `Hello ${userName},

Your PrepTrack verification code is: ${otp}. It is valid for 10 minutes.

👤 Account Name: ${userName} (${email})
⏰ Requested On: ${timing}`;

  const otpHtml = `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px; color: #1f2937;">
      <h2 style="color: #2563eb; margin-top: 0;">${title || "PrepTrack Verification Code"} 🚀</h2>
      <p style="font-size: 15px;">Hello <strong>${userName}</strong>,</p>
      <p style="font-size: 14px;">Please use the following One-Time Password (OTP) to complete your request:</p>
      <div style="font-size: 26px; font-weight: bold; color: #2563eb; letter-spacing: 5px; padding: 15px; background-color: #eff6ff; text-align: center; border-radius: 8px; margin: 20px 0;">
        ${otp}
      </div>
      <div style="background-color: #f9fafb; padding: 12px; border-radius: 6px; font-size: 13px; color: #4b5563; margin-top: 15px;">
        <p style="margin: 3px 0;">👤 <strong>User:</strong> ${userName} (${email})</p>
        <p style="margin: 3px 0;">⏰ <strong>Timing:</strong> ${timing}</p>
        <p style="margin: 3px 0;">⌛ <strong>Validity:</strong> 10 Minutes</p>
      </div>
    </div>
  `;

  try {
    if (process.env.EMAILJS_SERVICE_ID && process.env.EMAILJS_PUBLIC_KEY) {
      await sendEmailJS({
        email: email,
        name: userName,
        timing: timing,
        subject: subject,
        otp: otp,
        message: otpMessage,
        html: otpMessage,
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
        name: userName,
        timing: timing,
        subject: subject,
        otp: otp,
        text: otpMessage,
        html: otpHtml,
      });
    } catch (smtpError) {
      console.error("SMTP also failed:", smtpError.message);
      throw new Error(`Email dispatch failed. EmailJS: ${emailjsError.message}. SMTP: ${smtpError.message}`);
    }
  }
};

const sendWelcomeEmail = async ({ email, name }) => {
  const userName = name || email.split("@")[0];
  const timing = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "short",
  });

  // Crisp 5-line welcome message with Name and Timing
  const welcomeText = `🎉 Welcome to PrepTrack, ${userName}! Your account has been created successfully.
🚀 PrepTrack helps you track your daily DSA problem-solving streak and build strong coding habits.
⚡ Easily auto-scrape problem details directly from LeetCode & GeeksforGeeks links.
📊 Access curated DSA Cheat Sheets, topic roadmaps, and real-time visual progress analytics.
🔥 Start your prep journey today at https://preptrack.vercel.app and level up your coding skills!

👤 Account Name: ${userName} (${email})
⏰ Joined On: ${timing}`;

  const welcomeHtml = `
    <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.8; color: #1f2937;">
      <h2 style="color: #2563eb; margin-bottom: 15px;">🎉 Welcome to PrepTrack, ${userName}!</h2>
      <p style="font-size: 15px; margin-bottom: 10px;">🚀 <strong>PrepTrack</strong> helps you track your daily DSA problem-solving streak and build strong coding habits.</p>
      <p style="font-size: 15px; margin-bottom: 10px;">⚡ Easily auto-scrape problem details directly from LeetCode & GeeksforGeeks links.</p>
      <p style="font-size: 15px; margin-bottom: 10px;">📊 Access curated DSA Cheat Sheets, topic roadmaps, and real-time visual progress analytics.</p>
      <p style="font-size: 15px; margin-top: 15px;">🔥 Start your prep journey today at <a href="https://preptrack.vercel.app" style="color: #2563eb; font-weight: bold;">https://preptrack.vercel.app</a> and level up your coding skills!</p>
      <div style="background-color: #f3f4f6; padding: 12px; border-radius: 6px; font-size: 13px; color: #4b5563; margin-top: 20px;">
        <p style="margin: 3px 0;">👤 <strong>Account Name:</strong> ${userName} (${email})</p>
        <p style="margin: 3px 0;">⏰ <strong>Joined On:</strong> ${timing}</p>
      </div>
    </div>
  `;

  try {
    if (process.env.EMAILJS_SERVICE_ID && process.env.EMAILJS_PUBLIC_KEY) {
      await sendEmailJS({
        email: email,
        name: userName,
        timing: timing,
        subject: "Welcome to PrepTrack! 🚀 Your DSA Journey Begins",
        otp: "WELCOME",
        message: welcomeText,
        html: welcomeText,
      });
      return;
    } else {
      throw new Error("EmailJS not configured. Falling back to SMTP.");
    }
  } catch (emailjsError) {
    console.warn("EmailJS welcome email failed, trying Nodemailer SMTP:", emailjsError.message);
    try {
      await sendEmail({
        email: email,
        name: userName,
        timing: timing,
        subject: "Welcome to PrepTrack! 🚀 Your DSA Journey Begins",
        text: welcomeText,
        html: welcomeHtml,
      });
    } catch (smtpError) {
      console.error("Welcome email SMTP also failed:", smtpError.message);
    }
  }
};

module.exports = { sendOtpEmail, sendWelcomeEmail };
