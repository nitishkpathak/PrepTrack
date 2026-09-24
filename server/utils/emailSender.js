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

const sendWelcomeEmail = async ({ email, name }) => {
  const welcomeHtml = `
    <div style="font-family: Arial, sans-serif; padding: 25px; border: 1px solid #e5e7eb; border-radius: 12px; max-width: 650px; background-color: #ffffff; color: #1f2937; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 25px;">
        <h1 style="color: #2563eb; margin: 0; font-size: 28px; font-weight: bold;">PrepTrack 🚀</h1>
        <p style="color: #6b7280; font-size: 14px; margin-top: 5px;">Track your DSA & Coding Progress Like a Professional</p>
      </div>

      <h2 style="color: #111827; font-size: 20px;">Welcome aboard, ${name || "Developer"}! 🎉</h2>
      <p style="font-size: 15px; line-height: 1.6; color: #374151;">
        Your PrepTrack account has been successfully created! We are thrilled to welcome you to a platform built to empower your Data Structures, Algorithms, and Coding Interview Preparation.
      </p>

      <div style="background-color: #f8fafc; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0; margin: 25px 0;">
        <h3 style="color: #2563eb; margin-top: 0; font-size: 16px;">💡 Key Features & Platform Benefits:</h3>
        <ul style="padding-left: 20px; font-size: 14px; line-height: 1.8; color: #374151; margin-bottom: 0;">
          <li><strong>🔥 Daily Practice Streaks:</strong> Build unbroken problem-solving habits with live streak tracking & calendar heatmaps.</li>
          <li><strong>⚡ Auto Link Scraper:</strong> Auto-extract question title, difficulty, and notes directly from LeetCode & GeeksforGeeks links.</li>
          <li><strong>📊 Interactive Analytics & Charts:</strong> Visual progress metrics broken down by Easy, Medium, and Hard difficulties.</li>
          <li><strong>📚 Curated DSA Cheat Sheets:</strong> Access Striver SDE sheet, Blind 75, and topic-wise DSA study roadmaps right inside your dashboard.</li>
          <li><strong>📲 Progressive Web App (PWA):</strong> Access your preparation dashboard seamlessly on Mobile and Desktop with offline support.</li>
        </ul>
      </div>

      <div style="margin: 25px 0; text-align: center;">
        <p style="font-size: 14px; color: #4b5563; margin-bottom: 15px;">Ready to add your first question and start your streak?</p>
        <a href="https://preptrack.vercel.app" style="background-color: #2563eb; color: #ffffff; padding: 12px 28px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block;">Go to PrepTrack Dashboard 🚀</a>
      </div>

      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;" />
      <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0;">
        Happy Coding! <br/>
        <strong>The PrepTrack Team</strong>
      </p>
    </div>
  `;

  try {
    if (process.env.EMAILJS_SERVICE_ID && process.env.EMAILJS_PUBLIC_KEY) {
      await sendEmailJS({
        email: email,
        subject: "Welcome to PrepTrack! 🚀 Your DSA Journey Begins",
        otp: "WELCOME",
        html: welcomeHtml,
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
        subject: "Welcome to PrepTrack! 🚀 Your DSA Journey Begins",
        html: welcomeHtml,
      });
    } catch (smtpError) {
      console.error("Welcome email SMTP also failed:", smtpError.message);
    }
  }
};

module.exports = { sendOtpEmail, sendWelcomeEmail };
