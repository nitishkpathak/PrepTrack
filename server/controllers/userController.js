const User =
  require("../models/User");
const bcrypt =
  require("bcryptjs");

// ============================
// GET PROFILE
// ============================

const getProfile =
  async (req, res) => {

    try {

      // Find User
      const user =
        await User.findById(
          req.user.id
        ).select("-password");

      // Check User
      if (!user) {

        return res
          .status(404)
          .json({

            message:
              "User not found",

          });
      }

      // Response
      res.status(200).json({

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

         streak: 
            user.streak,
            
          longestStreak:
            user.longestStreak || 0,

          lastSolvedDate: 
            user.lastSolvedDate,

          dailyGoal:
            user.dailyGoal,

          preferredPlatform:
            user.preferredPlatform,

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
// UPDATE PROFILE
// ============================

const updateProfile =
  async (req, res) => {

    try {

      const {

        name,
        role,
        bio,
        profilePic,

      } = req.body;

      // Find User
      const user =
        await User.findById(
          req.user.id
        );

      // Check User
      if (!user) {

        return res
          .status(404)
          .json({

            message:
              "User not found",

          });
      }

      // Update Fields
      user.name =
        name || user.name;

      user.role =
        role || user.role;

      user.bio =
        bio || user.bio;

      user.profilePic =
        profilePic ||
        user.profilePic;

      // Save User
      await user.save();

      // Response
    res.status(200).json({

      message:
        "Profile Updated Successfully",

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

        streak:
          user.streak,

        longestStreak:
          user.longestStreak || 0,

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
// UPDATE PREFERENCES
// ============================
const updatePreferences = async (req, res) => {
  try {
    const { dailyGoal, preferredPlatform } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.dailyGoal = dailyGoal !== undefined ? dailyGoal : user.dailyGoal;
    user.preferredPlatform = preferredPlatform || user.preferredPlatform;

    await user.save();

    res.status(200).json({
      message: "Preferences updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        profilePic: user.profilePic || "",
        createdAt: user.createdAt,
        streak: user.streak,
        longestStreak: user.longestStreak || 0,
        lastSolvedDate: user.lastSolvedDate,
        dailyGoal: user.dailyGoal,
        preferredPlatform: user.preferredPlatform,
      }
    });
  } catch (error) {
    console.error("Update preferences failed:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ============================
// CHANGE PASSWORD
// ============================
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    // Hash & save new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password updated successfully 🚀" });
  } catch (error) {
    console.error("Change password failed:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ============================
// EMAIL CHANGE STEP 1: REQUEST OTP FOR CURRENT EMAIL
// ============================
const requestChangeEmailCurrent = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.emailChangeOtp = otp;
    user.emailChangeOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    user.currentEmailVerifiedForChange = false; // Reset previous verification if any
    await user.save();

    // Send OTP to current email
    const { sendOtpEmail } = require("../utils/emailSender");
    await sendOtpEmail({
      email: user.email,
      subject: "PrepTrack Email Change Request - Current Email OTP 🔐",
      otp: otp,
      title: "Confirm Your Email Change Request",
    });

    res.status(200).json({ message: "Verification OTP sent to your current email! 📩" });
  } catch (error) {
    console.error("Request email change current failed:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

// ============================
// EMAIL CHANGE STEP 2: VERIFY CURRENT EMAIL OTP
// ============================
const verifyChangeEmailCurrent = async (req, res) => {
  try {
    const { otp } = req.body;
    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate OTP
    if (
      user.emailChangeOtp !== otp ||
      !user.emailChangeOtpExpires ||
      user.emailChangeOtpExpires < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP ❌" });
    }

    // Mark as verified
    user.currentEmailVerifiedForChange = true;
    user.emailChangeOtp = null;
    user.emailChangeOtpExpires = null;
    await user.save();

    res.status(200).json({ message: "Current email verified successfully! Proceed to add new email. 🚀" });
  } catch (error) {
    console.error("Verify email change current failed:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ============================
// EMAIL CHANGE STEP 3: INPUT NEW EMAIL & SEND OTP TO NEW EMAIL
// ============================
const requestChangeEmailNew = async (req, res) => {
  try {
    const { newEmail } = req.body;
    if (!newEmail) {
      return res.status(400).json({ message: "New email is required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if current email verified
    if (!user.currentEmailVerifiedForChange) {
      return res.status(400).json({ message: "Please verify your current email first ❌" });
    }

    // Check if new email is already registered
    const existingUser = await User.findOne({ email: newEmail.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered by another account ❌" });
    }

    // Generate OTP for new email
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.emailChangeOtp = otp;
    user.emailChangeOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    user.tempNewEmail = newEmail.toLowerCase();
    await user.save();

    // Send OTP to new email
    const { sendOtpEmail } = require("../utils/emailSender");
    await sendOtpEmail({
      email: newEmail,
      subject: "PrepTrack Email Change Request - New Email Verification OTP 🔐",
      otp: otp,
      title: "Verify Your New Email Address",
    });

    res.status(200).json({ message: "Verification OTP sent to your new email! 📩" });
  } catch (error) {
    console.error("Request email change new failed:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

// ============================
// EMAIL CHANGE STEP 4: VERIFY NEW EMAIL OTP & SAVE
// ============================
const verifyChangeEmailNew = async (req, res) => {
  try {
    const { otp } = req.body;
    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if current email was verified
    if (!user.currentEmailVerifiedForChange || !user.tempNewEmail) {
      return res.status(400).json({ message: "Verification flow was interrupted. Please start over ❌" });
    }

    // Validate OTP
    if (
      user.emailChangeOtp !== otp ||
      !user.emailChangeOtpExpires ||
      user.emailChangeOtpExpires < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP ❌" });
    }

    // Finalize update
    user.email = user.tempNewEmail;
    user.tempNewEmail = "";
    user.currentEmailVerifiedForChange = false;
    user.emailChangeOtp = null;
    user.emailChangeOtpExpires = null;
    await user.save();

    res.status(200).json({
      message: "Email address changed successfully! 🎉",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        profilePic: user.profilePic || "",
        createdAt: user.createdAt,
        streak: user.streak,
        longestStreak: user.longestStreak || 0,
        lastSolvedDate: user.lastSolvedDate,
        dailyGoal: user.dailyGoal,
        preferredPlatform: user.preferredPlatform,
      }
    });
  } catch (error) {
    console.error("Verify email change new failed:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ============================
// ACCOUNT DELETION STEP 1: REQUEST OTP
// ============================
const requestDeleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.deleteAccountOtp = otp;
    user.deleteAccountOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    // Send OTP to user email
    const { sendOtpEmail } = require("../utils/emailSender");
    await sendOtpEmail({
      email: user.email,
      subject: "PrepTrack Account Deletion Request - OTP Verification ⚠️",
      otp: otp,
      title: "Verify Your Account Deletion",
    });

    res.status(200).json({ message: "Verification OTP sent to your registered email! 📩" });
  } catch (error) {
    console.error("Request account delete failed:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

// ============================
// ACCOUNT DELETION STEP 2: CONFIRM OTP & PASSWORD & DELETE
// ============================
const confirmDeleteAccount = async (req, res) => {
  try {
    const { otp, password } = req.body;
    if (!otp || !password) {
      return res.status(400).json({ message: "OTP and password are required ❌" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found ❌" });
    }

    // 1. Verify OTP
    if (!user.deleteAccountOtp || user.deleteAccountOtp !== otp) {
      return res.status(400).json({ message: "Invalid verification OTP code ❌" });
    }

    if (new Date() > user.deleteAccountOtpExpires) {
      return res.status(400).json({ message: "Verification OTP code has expired ❌" });
    }

    // 2. Verify Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password! Deletion cancelled ❌" });
    }

    // 3. Delete user data (questions)
    const Question = require("../models/Question");
    await Question.deleteMany({ user: user._id });

    // 4. Delete user account
    await User.findByIdAndDelete(user._id);

    res.status(200).json({ message: "Account and associated data deleted successfully! 🧹" });
  } catch (error) {
    console.error("Confirm account delete failed:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ============================
// EXPORTS
// ============================

module.exports = {
  getProfile,
  updateProfile,
  updatePreferences,
  changePassword,
  requestChangeEmailCurrent,
  verifyChangeEmailCurrent,
  requestChangeEmailNew,
  verifyChangeEmailNew,
  requestDeleteAccount,
  confirmDeleteAccount,
};