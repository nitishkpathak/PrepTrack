const express =
  require("express");

const router =
  express.Router();

const {

  registerUser,

  loginUser,

  verifyEmail,

  resendVerifyOTP,

} = require(
  "../controllers/authController"
);

// ============================
// REGISTER
// ============================

router.post(

  "/register",

  registerUser

);

// ============================
// LOGIN
// ============================

router.post(

  "/login",

  loginUser

);

// ============================
// VERIFY EMAIL
// ============================

router.post(

  "/verify-email",

  verifyEmail

);

router.post(

  "/resend-otp",

  resendVerifyOTP

);

module.exports =
  router;