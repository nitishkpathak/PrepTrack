const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
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
    otp: options.otp,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;