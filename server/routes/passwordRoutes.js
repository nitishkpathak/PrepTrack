const express =
  require("express");

const router =
  express.Router();

const {

  sendOTP,
  resetPassword,

} = require(
  "../controllers/passwordController"
);

// ============================
// SEND OTP
// ============================

router.post(

  "/send-otp",

  sendOTP

);

// ============================
// RESET PASSWORD
// ============================

router.post(

  "/reset-password",

  resetPassword

);

module.exports =
  router;