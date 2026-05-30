const nodemailer =
  require("nodemailer");

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

    await transporter.sendMail(
      mailOptions
    );
  };

module.exports =
  sendEmail;