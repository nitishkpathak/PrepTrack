const express =
  require("express");

const router =
  express.Router();

const {
  registerUser,
  loginUser,
  verifyOTP,
  completeSignup,
  forgotPassword,
  resetPassword,
  googleLogin,
} = require("../controllers/authController");

// ============================
// REGISTER (Phase 1: Send OTP)
// ============================
router.post("/register", registerUser);

// ============================
// COMPLETE SIGNUP (Phase 3: Set Credentials)
// ============================
router.post("/complete-signup", completeSignup);

// ============================
// LOGIN
// ============================
router.post("/login", loginUser);

// ============================
// GOOGLE LOGIN
// ============================
router.post("/google-login", googleLogin);

// ============================
// VERIFY OTP
// ============================
router.post("/verify-otp", verifyOTP);

// ============================
// FORGOT & RESET PASSWORD
// ============================
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;