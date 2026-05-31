const mongoose = require("mongoose");

const tempUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    otpExpire: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// TTL Index to automatically delete expired verification attempts
tempUserSchema.index({ otpExpire: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("TempUser", tempUserSchema);
