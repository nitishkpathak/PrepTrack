const nodemailer =
  require("nodemailer");

const sendVerificationEmail =
  async (email, otp) => {

    console.log("EMAIL_USER =", process.env.EMAIL_USER);
    console.log("EMAIL_PASS EXISTS =", !!process.env.EMAIL_PASS);
    console.log("OTP =", otp);

    const transporter =
      nodemailer.createTransport({

        service: "gmail",

        auth: {

          user:
            process.env.EMAIL_USER,

          pass:
            process.env.EMAIL_PASS,

        },

        family: 4,

      });

   try {

  await transporter.verify();

  console.log(
    "SMTP VERIFIED"
  );

} catch (err) {

  console.log(
    "VERIFY ERROR:",
    err
  );

  throw err;
}

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
    info
  );

} catch (err) {

  console.log(
    "SENDMAIL ERROR:",
    err
  );

  throw err;
}
  };

module.exports =
  sendVerificationEmail;