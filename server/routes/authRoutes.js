const express = require("express");

const {
  registerUser,
  loginUser,
  completeOnboarding,
  updateProfile,
  changePassword,
  deleteAccount,
} = require("../controllers/authController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/register",
  registerUser
);

router.post(
  "/login",
  loginUser
);

router.patch(
  "/onboarding",
  protect,
  completeOnboarding
);

router.patch(
  "/profile",
  protect,
  updateProfile
);

router.patch(
  "/password",
  protect,
  changePassword
);

router.delete(
  "/account",
  protect,
  deleteAccount
);

module.exports = router;
