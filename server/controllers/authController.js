const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Budget = require("../models/Budget");
const Expense = require("../models/Expense");
const Savings = require("../models/Savings");
const Investment = require("../models/Investment");
const RecurringExpense = require("../models/RecurringExpense");

const generateToken = require("../utils/generateToken");

/* ========================= */
/* CONSTANTS */
/* ========================= */

const SUPPORTED_CURRENCIES = [
  "INR",
  "USD",
  "EUR",
  "GBP",
  "AED",
  "SGD",
  "CAD",
  "AUD",
  "JPY",
];

const EMPLOYMENT_TYPES = [
  "Student",
  "Salaried",
  "Business",
  "Freelancer",
  "Retired",
  "Other",
];

const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;

/* ========================= */
/* USER RESPONSE */
/* ========================= */

const buildUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  profilePicture: user.profilePicture || "",
  monthlyIncome:
    user.monthlyIncome ?? null,
  currency:
    user.currency || "INR",
  employmentType:
    user.employmentType || null,
  onboardingCompleted:
    Boolean(user.onboardingCompleted),
  role:
    user.role || "user",
});

/* ========================= */
/* REGISTER USER */
/* ========================= */

const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    const normalizedEmail =
      email?.trim().toLowerCase();

    if (
      !normalizedEmail ||
      !EMAIL_REGEX.test(normalizedEmail)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    if (
      !password ||
      !PASSWORD_REGEX.test(password)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain uppercase, lowercase, number and be 8+ characters.",
      });
    }

    const existingUser =
      await User.findOne({
        email: normalizedEmail,
      });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const salt =
      await bcrypt.genSalt(10);

    const hashedPassword =
      await bcrypt.hash(
        password,
        salt
      );

    const user =
      await User.create({
        name: name?.trim(),
        email: normalizedEmail,
        password: hashedPassword,
      });

    return res.status(201).json({
      success: true,
      user: buildUserResponse(user),
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(
      "Register Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/* ========================= */
/* LOGIN USER */
/* ========================= */

const loginUser = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const normalizedEmail =
      email?.trim().toLowerCase();

    const user =
      await User.findOne({
        email: normalizedEmail,
      }).select("+password");

    if (
      !user ||
      !password ||
      !(await bcrypt.compare(
        password,
        user.password
      ))
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    return res.status(200).json({
      success: true,
      user: buildUserResponse(user),
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(
      "Login Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/* ========================= */
/* COMPLETE ONBOARDING */
/* ========================= */

const completeOnboarding = async (
  req,
  res
) => {
  try {
    const {
      monthlyIncome,
      currency,
      employmentType,
    } = req.body;

    const income =
      Number(monthlyIncome);

    if (
      !Number.isFinite(income) ||
      income < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid monthly income",
      });
    }

    if (
      !SUPPORTED_CURRENCIES.includes(
        currency
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please select a supported currency",
      });
    }

    if (
      !EMPLOYMENT_TYPES.includes(
        employmentType
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please select a valid employment type",
      });
    }

    const user =
      await User.findById(
        req.user._id
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.monthlyIncome = income;
    user.currency = currency;
    user.employmentType =
      employmentType;
    user.onboardingCompleted = true;

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Onboarding completed successfully",
      user:
        buildUserResponse(user),
    });
  } catch (error) {
    console.error(
      "Onboarding Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Internal Server Error",
    });
  }
};

/* ========================= */
/* UPDATE PROFILE */
/* ========================= */

const updateProfile = async (
  req,
  res
) => {
  try {
    const {
      name,
      email,
      monthlyIncome,
      currency,
      employmentType,
    } = req.body;

    const user =
      await User.findById(
        req.user._id
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name !== undefined) {
      const cleanName =
        String(name).trim();

      if (
        cleanName.length < 2 ||
        cleanName.length > 60
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Name must be between 2 and 60 characters",
        });
      }

      user.name = cleanName;
    }

    if (email !== undefined) {
      const normalizedEmail =
        String(email)
          .trim()
          .toLowerCase();

      if (
        !EMAIL_REGEX.test(
          normalizedEmail
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please enter a valid email address",
        });
      }

      const existing =
        await User.findOne({
          email: normalizedEmail,
          _id: {
            $ne: user._id,
          },
        });

      if (existing) {
        return res.status(400).json({
          success: false,
          message:
            "That email address is already in use",
        });
      }

      user.email =
        normalizedEmail;
    }

    if (monthlyIncome !== undefined) {
      const income =
        Number(monthlyIncome);

      if (
        !Number.isFinite(income) ||
        income < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please enter a valid monthly income",
        });
      }

      user.monthlyIncome = income;
    }

    if (currency !== undefined) {
      if (
        !SUPPORTED_CURRENCIES.includes(
          currency
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please select a supported currency",
        });
      }

      user.currency = currency;
    }

    if (
      employmentType !== undefined
    ) {
      if (
        !EMPLOYMENT_TYPES.includes(
          employmentType
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please select a valid employment type",
        });
      }

      user.employmentType =
        employmentType;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Profile updated successfully",
      user:
        buildUserResponse(user),
    });
  } catch (error) {
    console.error(
      "Update Profile Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to update profile",
    });
  }
};

/* ========================= */
/* CHANGE PASSWORD */
/* ========================= */

const changePassword = async (
  req,
  res
) => {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    if (
      !currentPassword ||
      !newPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Current password and new password are required",
      });
    }

    if (
      !PASSWORD_REGEX.test(
        newPassword
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "New password must contain uppercase, lowercase, number and be 8+ characters.",
      });
    }

    const user =
      await User.findById(
        req.user._id
      ).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const matches =
      await bcrypt.compare(
        currentPassword,
        user.password
      );

    if (!matches) {
      return res.status(401).json({
        success: false,
        message:
          "Current password is incorrect",
      });
    }

    const samePassword =
      await bcrypt.compare(
        newPassword,
        user.password
      );

    if (samePassword) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be different from your current password",
      });
    }

    const salt =
      await bcrypt.genSalt(10);

    user.password =
      await bcrypt.hash(
        newPassword,
        salt
      );

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Password changed successfully",
    });
  } catch (error) {
    console.error(
      "Change Password Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to change password",
    });
  }
};

/* ========================= */
/* DELETE ACCOUNT */
/* ========================= */

const deleteAccount = async (
  req,
  res
) => {
  try {
    const {
      password,
      confirmation,
    } = req.body;

    if (
      confirmation !== "DELETE"
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Type "DELETE" to confirm account deletion',
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message:
          "Password is required to delete your account",
      });
    }

    const user =
      await User.findById(
        req.user._id
      ).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const matches =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!matches) {
      return res.status(401).json({
        success: false,
        message:
          "Password is incorrect",
      });
    }

    const userId = user._id;

    await Promise.all([
      Budget.deleteMany({
        user: userId,
      }),
      Expense.deleteMany({
        user: userId,
      }),
      Savings.deleteMany({
        user: userId,
      }),
      Investment.deleteMany({
        user: userId,
      }),
      RecurringExpense.deleteMany({
        user: userId,
      }),
    ]);

    await User.deleteOne({
      _id: userId,
    });

    return res.status(200).json({
      success: true,
      message:
        "Account deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Account Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to delete account",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  completeOnboarding,
  updateProfile,
  changePassword,
  deleteAccount,
};
