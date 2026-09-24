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

const sendAccountDeletedEmail = async ({ email, name }) => {
  const userName = name || email.split("@")[0];
  const timing = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "short",
  });

  const deleteText = `Hello ${userName},

Your PrepTrack account (${email}) and all associated DSA questions, analytics, and streak history have been permanently deleted.

If you did not perform this action, please contact our support team immediately.

👤 Account Name: ${userName} (${email})
⏰ Deleted On: ${timing}`;

  const deleteHtml = `
    <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.8; color: #1f2937;">
      <h2 style="color: #dc2626; margin-bottom: 15px;">Account Deletion Confirmation ⚠️</h2>
      <p style="font-size: 15px;">Hello <strong>${userName}</strong>,</p>
      <p style="font-size: 15px;">Your PrepTrack account (<strong>${email}</strong>) and all associated DSA questions, difficulty data, and streak history have been <strong>permanently deleted</strong> as per your request.</p>
      <p style="font-size: 14px; color: #6b7280; margin-top: 15px;">We're sorry to see you go! If you ever wish to return, you can create a new account anytime at <a href="https://preptrack.vercel.app" style="color: #2563eb;">PrepTrack</a>.</p>
      <div style="background-color: #fef2f2; padding: 12px; border-radius: 6px; font-size: 13px; color: #991b1b; margin-top: 20px; border: 1px solid #fecaca;">
        <p style="margin: 3px 0;">👤 <strong>Account Name:</strong> ${userName} (${email})</p>
        <p style="margin: 3px 0;">⏰ <strong>Deleted On:</strong> ${timing}</p>
      </div>
    </div>
  `;

  try {
    if (process.env.EMAILJS_SERVICE_ID && process.env.EMAILJS_PUBLIC_KEY) {
      await sendEmailJS({
        email: email,
        name: userName,
        timing: timing,
        subject: "PrepTrack Account Deletion Confirmation ⚠️",
        otp: "DELETED",
        message: deleteText,
        html: deleteText,
      });
      return;
    } else {
      throw new Error("EmailJS not configured. Falling back to SMTP.");
    }
  } catch (emailjsError) {
    console.warn("EmailJS delete account email failed, trying Nodemailer SMTP:", emailjsError.message);
    try {
      await sendEmail({
        email: email,
        name: userName,
        timing: timing,
        subject: "PrepTrack Account Deletion Confirmation ⚠️",
        text: deleteText,
        html: deleteHtml,
      });
    } catch (smtpError) {
      console.error("Delete account email SMTP also failed:", smtpError.message);
    }
  }
};

const sendDataResetEmail = async ({ email, name }) => {
  const userName = name || email.split("@")[0];
  const timing = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "short",
  });

  const resetText = `Hello ${userName},

All your registered DSA questions, analytics, difficulty metrics, and daily practice streak history on PrepTrack have been successfully reset to zero.

Your account remains active and ready for a fresh start!

👤 Account Name: ${userName} (${email})
⏰ Reset On: ${timing}`;

  const resetHtml = `
    <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.8; color: #1f2937;">
      <h2 style="color: #2563eb; margin-bottom: 15px;">All Account Data Reset Successfully 🧹</h2>
      <p style="font-size: 15px;">Hello <strong>${userName}</strong>,</p>
      <p style="font-size: 15px;">All your registered DSA questions, difficulty metrics, analytics, and daily practice streak on PrepTrack have been <strong>successfully reset to zero</strong>.</p>
      <p style="font-size: 14px; color: #4b5563; margin-top: 15px;">Your account remains active! You can now start fresh and build a new streak at <a href="https://preptrack.vercel.app" style="color: #2563eb; font-weight: bold;">PrepTrack Dashboard</a>.</p>
      <div style="background-color: #eff6ff; padding: 12px; border-radius: 6px; font-size: 13px; color: #1e40af; margin-top: 20px; border: 1px solid #bfdbfe;">
        <p style="margin: 3px 0;">👤 <strong>Account Name:</strong> ${userName} (${email})</p>
        <p style="margin: 3px 0;">⏰ <strong>Reset On:</strong> ${timing}</p>
      </div>
    </div>
  `;

  try {
    if (process.env.EMAILJS_SERVICE_ID && process.env.EMAILJS_PUBLIC_KEY) {
      await sendEmailJS({
        email: email,
        name: userName,
        timing: timing,
        subject: "PrepTrack Data Reset Confirmation 🧹",
        otp: "RESET",
        message: resetText,
        html: resetText,
      });
      return;
    } else {
      throw new Error("EmailJS not configured. Falling back to SMTP.");
    }
  } catch (emailjsError) {
    console.warn("EmailJS data reset email failed, trying Nodemailer SMTP:", emailjsError.message);
    try {
      await sendEmail({
        email: email,
        name: userName,
        timing: timing,
        subject: "PrepTrack Data Reset Confirmation 🧹",
        text: resetText,
        html: resetHtml,
      });
    } catch (smtpError) {
      console.error("Data reset email SMTP also failed:", smtpError.message);
    }
  }
};

module.exports = { sendOtpEmail, sendWelcomeEmail, sendAccountDeletedEmail, sendDataResetEmail };
