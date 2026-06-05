const express =
  require("express");

const router =
  express.Router();

const {

  registerUser,

  loginUser,

  verifyOTP,

  completeSignup,
  
} = require(
  "../controllers/authController"
);

// ============================
// REGISTER (Phase 1: Send OTP)
// ============================

router.post(

  "/register",

  registerUser

);

// ============================
// COMPLETE SIGNUP (Phase 3: Set Credentials)
// ============================

router.post(

  "/complete-signup",

  completeSignup

);

// ============================
// LOGIN
// ============================

router.post(

  "/login",

  loginUser

);

// ============================
// VERIFY OTP
// ============================

router.post(

  "/verify-otp",

  verifyOTP

);

module.exports =
  router;