const mongoose =
  require("mongoose");

const userSchema =
  new mongoose.Schema(

    {

      name: {
        type: String,
        default: "",
      },

      email: {
        type: String,
        required: true,
        unique: true,
      },

      password: {
        type: String,
        default: "",
      },

      role: {
        type: String,
        default:
          "DSA Learner",
      },

      bio: {
        type: String,
        default:
          "Passionate coder 🚀",
      },

      streak: {
        type: Number,
        default: 0,
      },

      longestStreak: {
        type: Number,
        default: 0,
      },

      lastSolvedDate: {
        type: Date,
        default: null,
      },

      profilePic: {
        type: String,
        default: "",
      },

      isVerified: {
        type: Boolean,
        default: false,
      },

      dailyGoal: {
        type: Number,
        default: 2,
      },

      preferredPlatform: {
        type: String,
        default: "LeetCode",
      },

      otp: {
        type: String,
        default: null,
      },

      otpExpires: {
        type: Date,
        default: null,
      },

    },

    {
      timestamps: true,
    }

  );

module.exports =
  mongoose.model(
    "User",
    userSchema
  );