const express =
  require("express");

const router =
  express.Router();

const {

  registerUser,

  loginUser,

  verifyOTP,
  
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
// VERIFY OTP
// ============================

router.post(

  "/verify-otp",

  verifyOTP

);

module.exports =
  router;