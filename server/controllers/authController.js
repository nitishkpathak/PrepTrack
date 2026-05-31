const bcrypt =
  require("bcryptjs");

const jwt =
  require("jsonwebtoken");

const User =
  require("../models/User");

const TempUser =
  require("../models/TempUser");

const sendVerificationEmail =
  require(
    "../utils/sendVerificationEmail"
  );

// ============================
// REGISTER USER
// ============================

const registerUser =
  async (req, res) => {

    try {

      const {

        name,
        email,
        password,

      } = req.body;

      // Check Existing User
      const existingUser =
        await User.findOne({
          email,
        });

      if (existingUser) {

        return res
          .status(400)
          .json({

            message:
              "User already exists",

          });
      }

      // Hash Password
      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      // Create User directly as verified
      const user =
        await User.create({

          name,
          email,

          password:
            hashedPassword,

          isVerified: true, // Automatically verify user on signup

        });

      // Generate Token
      const token =
        jwt.sign(

          {
            id: user._id,
          },

          process.env.JWT_SECRET,

          {
            expiresIn: "30d",
          }

        );

      // Response
      res.status(201).json({

        token,

        user: {

          _id:
            user._id,

          name:
            user.name,

          email:
            user.email,

          role:
            user.role,

          bio:
            user.bio,

          profilePic:
            user.profilePic || "",

          createdAt:
            user.createdAt,

          isVerified:
            user.isVerified,

          streak:
            user.streak,

          lastSolvedDate:
            user.lastSolvedDate,

        },

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
// LOGIN USER
// ============================

const loginUser =
  async (req, res) => {

    try {

      const {
        email,
        password,
      } = req.body;

      // Find User
      const user =
        await User.findOne({
          email,
        });

      // Check User
      if (!user) {

        return res
          .status(400)
          .json({

            message:
              "Invalid Credentials",

          });
      }

      // Compare Password
      const isMatch =
        await bcrypt.compare(

          password,

          user.password

        );

      // Wrong Password
      if (!isMatch) {

        return res
          .status(400)
          .json({

            message:
              "Invalid Credentials",

          });
      }

      // EMAIL VERIFY CHECK
      if (!user.isVerified) {

        return res
          .status(401)
          .json({

            message:
              "Please verify your email first",

          });
      }

      // Generate Token
      const token =
        jwt.sign(

          {
            id: user._id,
          },

          process.env.JWT_SECRET,

          {
            expiresIn: "30d",
          }

        );

      // Response
      res.status(200).json({

        token,

        user: {

          _id:
            user._id,

          name:
            user.name,

          email:
            user.email,

          role:
            user.role,

          bio:
            user.bio,

          profilePic:
            user.profilePic || "",

          createdAt:
            user.createdAt,

          isVerified:
            user.isVerified,

          streak:
            user.streak,

          lastSolvedDate:
            user.lastSolvedDate,

        },

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
// VERIFY EMAIL
// ============================

const verifyEmail =
  async (req, res) => {

    try {

      const {

        email,
        otp,

      } = req.body;

      const tempUser =
        await TempUser.findOne({
          email,
        });

      if (!tempUser) {
        // Check if already verified and created
        const alreadyUser = await User.findOne({ email });
        if (alreadyUser) {
          return res
            .status(400)
            .json({
              message: "Email already verified. Please login.",
            });
        }

        return res
          .status(404)
          .json({

            message:
              "Registration session expired or not found. Please register again.",

          });
      }

      // Verify OTP
      if (

        tempUser.otp !== otp ||

        tempUser.otpExpire <
        Date.now()

      ) {

        return res
          .status(400)
          .json({

            message:
              "Invalid or Expired OTP",

          });
      }

      // Create permanent user account
      await User.create({
        name: tempUser.name,
        email: tempUser.email,
        password: tempUser.password,
        isVerified: true,
      });

      // Clear the temporary registration record
      await TempUser.deleteOne({ email });

      res.status(200).json({

        message:
          "Email Verified Successfully",

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
// RESEND VERIFY OTP
// ============================

const resendVerifyOTP =
  async (req, res) => {

    try {

      const { email } =
        req.body;

      const tempUser =
        await TempUser.findOne({
          email,
        });

      if (!tempUser) {
        // Check if already user
        const alreadyUser = await User.findOne({ email });
        if (alreadyUser) {
          return res
            .status(400)
            .json({
              message: "Email already verified. Please login.",
            });
        }

        return res
          .status(404)
          .json({

            message:
              "Registration session not found. Please register again.",

          });
      }

      // Generate New OTP
      const otp =
        Math.floor(

          100000 +

          Math.random() *
          900000

        ).toString();

      tempUser.otp =
        otp;

      tempUser.otpExpire =
        Date.now() +
        5 * 60 * 1000;

      await tempUser.save();

      // Send Mail
      await sendVerificationEmail(

        email,
        otp

      );

      res.status(200).json({

        message:
          "OTP Resent Successfully",

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
// EXPORTS
// ============================

module.exports = {

  registerUser,

  loginUser,

  verifyEmail,

  resendVerifyOTP,

};