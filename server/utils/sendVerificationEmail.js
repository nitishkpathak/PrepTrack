const nodemailer =
  require("nodemailer");

const sendVerificationEmail =
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
        "PrepTrack Email Verification",

      html: `

        <div
          style="
            font-family:sans-serif;
            padding:20px;
          "
        >

          <h2>
            Verify Your Email
          </h2>

          <p>
            Your OTP:
          </p>

          <h1
            style="
              color:#2563eb;
            "
          >
            ${otp}
          </h1>

          <p>
            OTP valid for 5 minutes.
          </p>

        </div>

      `,

    };

try {

  const info =
    await transporter.sendMail(
      mailOptions
    );

  console.log(
    "EMAIL SENT:",
    info.response
  );

} catch (error) {

  console.log(
    "EMAIL ERROR:",
    error
  );

  throw error;
}
  };

const mailOptions = {
  from: `"PrepTrack 🚀" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: "PrepTrack Email Verification",
  html: `...`
};

try {

  const info =
    await transporter.sendMail(
      mailOptions
    );

  console.log(
    "EMAIL SENT:",
    info.response
  );

} catch (error) {

  console.log(
    "EMAIL ERROR:",
    error
  );

  throw error;
}

module.exports =
  sendVerificationEmail;