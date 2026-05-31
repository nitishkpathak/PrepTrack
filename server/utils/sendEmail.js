const nodemailer = require("nodemailer");

const sendEmail =
  async (email, otp) => {

    const transporter =
      nodemailer.createTransport({

        service: "gmail",

        auth: {

          user:
            process.env.EMAIL_USER,

          pass:
            process.env.EMAIL_PASS,

        },

        family: 4, // Force IPv4 to prevent IPv6 network unreachable errors

      });

    const mailOptions = {

      from:
         `"PrepTrack 🚀" <${process.env.EMAIL_USER}>`,

      to: email,

      subject:
        "PrepTrack Password Reset OTP",

      html: `

        <h2>
          Your OTP:
          ${otp}
        </h2>

      `,

    };

    try {
      const info = await transporter.sendMail(
        mailOptions
      );
      console.log("PASSWORD RESET EMAIL SENT:", info);
    } catch (err) {
      console.log("SENDMAIL ERROR:", err);
      throw err;
    }
  };

module.exports =
  sendEmail;