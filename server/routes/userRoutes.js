const express =
  require("express");

const router =
  express.Router();

const {
  updateProfile,
  getProfile,
  updatePreferences,
  changePassword,
  requestChangeEmailCurrent,
  verifyChangeEmailCurrent,
  requestChangeEmailNew,
  verifyChangeEmailNew,
  requestDeleteAccount,
  confirmDeleteAccount,
} = require(
  "../controllers/userController"
);

const protect =
  require(
    "../middleware/authMiddleware"
  );

// ============================
// GET PROFILE
// ============================
router.get(
  "/profile",
  protect,
  getProfile
);

// ============================
// UPDATE PROFILE
// ============================
router.put(
  "/profile",
  protect,
  updateProfile
);

// ============================
// UPDATE PREFERENCES
// ============================
router.put(
  "/preferences",
  protect,
  updatePreferences
);

// ============================
// CHANGE PASSWORD
// ============================
router.put(
  "/change-password",
  protect,
  changePassword
);

// ============================
// CHANGE EMAIL (TWO-STEP OTP)
// ============================
router.post(
  "/change-email/request-current",
  protect,
  requestChangeEmailCurrent
);
router.post(
  "/change-email/verify-current",
  protect,
  verifyChangeEmailCurrent
);
router.post(
  "/change-email/request-new",
  protect,
  requestChangeEmailNew
);
router.post(
  "/change-email/verify-new",
  protect,
  verifyChangeEmailNew
);

// ============================
// ACCOUNT DELETION (TWO-STEP OTP + PW)
// ============================
router.post(
  "/delete/request",
  protect,
  requestDeleteAccount
);
router.delete(
  "/delete/confirm",
  protect,
  confirmDeleteAccount
);

module.exports =
  router;