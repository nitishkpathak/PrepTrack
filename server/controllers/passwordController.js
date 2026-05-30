const bcrypt =
  require("bcryptjs");

const User =
  require("../models/User");

const sendEmail =
  require("../utils/sendEmail");

// ============================
// SEND OTP
// ============================

const sendOTP =
  async (req, res) => {

    try {

      const { email } =
        req.body;

      const user =
        await User.findOne({
          email,
        });

      if (!user) {

        return res
          .status(404)
          .json({

            message:
              "User not found",

          });
      }

      // Generate OTP
      const otp =
        Math.floor(
          100000 +
          Math.random() *
          900000
        ).toString();

      user.resetOTP =
        otp;

      user.otpExpire =
        Date.now() +
        5 * 60 * 1000;

      await user.save();

      // Send Email
      await sendEmail(
        email,
        otp
      );

      res.status(200).json({

        message:
          "OTP sent successfully",

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Server Error",

      });
    }
  };

// ============================
// RESET PASSWORD
// ============================

const resetPassword =
  async (req, res) => {

    try {

      const {

        email,
        otp,
        newPassword,

      } = req.body;

      const user =
        await User.findOne({
          email,
        });

      if (!user) {

        return res
          .status(404)
          .json({

            message:
              "User not found",

          });
      }

      // Verify OTP
      if (

        user.resetOTP !== otp ||

        user.otpExpire <
        Date.now()

      ) {

        return res
          .status(400)
          .json({

            message:
              "Invalid or Expired OTP",

          });
      }

      // Hash Password
      const hashedPassword =
        await bcrypt.hash(

          newPassword,

          10

        );

      user.password =
        hashedPassword;

      // Clear OTP
      user.resetOTP = "";
      user.otpExpire = "";

      await user.save();

      res.status(200).json({

        message:
          "Password Reset Successful",

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Server Error",

      });
    }
  };

module.exports = {

  sendOTP,

  resetPassword,

};