const bcrypt =
  require("bcryptjs");

const jwt =
  require("jsonwebtoken");

const User =
  require("../models/User");

const sendEmail =
  require("../utils/sendEmail");



// ============================
// REGISTER USER
// ============================

const registerUser = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if user already exists and is fully registered
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified && existingUser.password) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes valid

    // Send Verification Email FIRST
    await sendEmail({
      email: email,
      subject: "PrepTrack Account Verification OTP 🔐",
      otp: otp,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px;">
          <h2 style="color: #863bff;">Welcome to PrepTrack! 🚀</h2>
          <p>Please verify your email address by entering the following One-Time Password (OTP):</p>
          <div style="font-size: 24px; font-weight: bold; color: #863bff; letter-spacing: 4px; padding: 15px; background-color: #f7f3ff; text-align: center; border-radius: 5px; margin: 20px 0;">
            ${otp}
          </div>
          <p style="font-size: 12px; color: #666;">This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
        </div>
      `,
    });

    if (existingUser) {
      // Overwrite old OTP for unverified user
      existingUser.otp = otp;
      existingUser.otpExpires = otpExpires;
      existingUser.isVerified = false; // Reset to false to be safe
      await existingUser.save();
    } else {
      // Create a temporary unverified user
      await User.create({
        email,
        isVerified: false,
        otp,
        otpExpires,
      });
    }

    res.status(200).json({
      message: "OTP sent successfully to email.",
      email,
    });

  } catch (error) {
    console.error("Signup failed:", error);
    res.status(500).json({
      message: error.message || "Server Error",
    });
  }
};

// ============================
// VERIFY OTP (NEW)
// ============================
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // Find User by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if OTP matches
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP code ❌" });
    }

    // Check if OTP is expired
    if (new Date() > user.otpExpires) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one ⏰" });
    }

    // Mark user as verified, clear OTP fields
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.status(200).json({
      message: "Email verified successfully! Please complete your profile. 🚀",
      email,
    });

  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ============================
// COMPLETE SIGNUP (NEW)
// ============================
const completeSignup = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: "Email is not verified yet. Please verify OTP first." });
    }

    // Check if already completed
    if (user.password) {
      return res.status(400).json({ message: "Account setup is already complete. Please log in." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Complete profile
    user.name = name;
    user.password = hashedPassword;
    await user.save();

    // Generate login JWT token directly
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(200).json({
      message: "Account registered successfully! 🚀",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        profilePic: user.profilePic || "",
        createdAt: user.createdAt,
        isVerified: user.isVerified,
        streak: user.streak,
        lastSolvedDate: user.lastSolvedDate,
      },
    });

  } catch (error) {
    console.error("Complete signup failed:", error);
    res.status(500).json({ message: "Server Error" });
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
// EXPORTS
// ============================

module.exports = {

  registerUser,

  loginUser,
  
  verifyOTP,

  completeSignup,
};