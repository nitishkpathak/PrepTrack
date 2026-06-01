const express =
  require("express");

const router =
  express.Router();

const {
  updateProfile,
  getProfile,
  updatePreferences,
  changePassword,
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

module.exports =
  router;