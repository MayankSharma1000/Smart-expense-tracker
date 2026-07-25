import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  FaBriefcase,
  FaCheckCircle,
  FaDatabase,
  FaEnvelope,
  FaExclamationTriangle,
  FaFileExcel,
  FaFilePdf,
  FaGlobe,
  FaKey,
  FaLock,
  FaMoneyBillWave,
  FaShieldAlt,
  FaSignOutAlt,
  FaTrash,
  FaUser,
  FaWallet,
} from "react-icons/fa";

import AppShell from "@/components/layout/AppShell/AppShell";

import {
  useAuth,
} from "../context/AuthContext";

import {
  useBudget,
} from "../hooks/useBudget";

import {
  useFinancialReport,
} from "../hooks/useFinancialReport";

import {
  setBudget,
} from "../services/budgetService";

import {
  changeUserPassword,
  deleteUserAccount,
  updateUserProfile,
} from "../services/authService";

import {
  formatCurrency,
} from "../utils/formatCurrency";

import "@/styles/pages/settings.css";

const CURRENCIES = [
  {
    code: "INR",
    label: "Indian Rupee",
  },
  {
    code: "USD",
    label: "US Dollar",
  },
  {
    code: "EUR",
    label: "Euro",
  },
  {
    code: "GBP",
    label: "British Pound",
  },
  {
    code: "AED",
    label: "UAE Dirham",
  },
  {
    code: "SGD",
    label: "Singapore Dollar",
  },
  {
    code: "CAD",
    label: "Canadian Dollar",
  },
  {
    code: "AUD",
    label: "Australian Dollar",
  },
  {
    code: "JPY",
    label: "Japanese Yen",
  },
];

const EMPLOYMENT_TYPES = [
  "Student",
  "Salaried",
  "Business",
  "Freelancer",
  "Retired",
  "Other",
];

function Settings() {
  const navigate =
    useNavigate();

  const {
    user,
    logout,
    updateUser,
  } = useAuth();

  const {
    budget,
    setBudget: setBudgetState,
  } = useBudget();

  const {
    exportPDF,
    exportExcel,
    loading: reportLoading,
  } = useFinancialReport();

  const [profile, setProfile] =
    useState({
      name: "",
      email: "",
      monthlyIncome: "",
      employmentType: "Salaried",
      currency: "INR",
    });

  const [monthlyBudget, setMonthlyBudget] =
    useState("");

  const [passwordForm, setPasswordForm] =
    useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  const [deleteForm, setDeleteForm] =
    useState({
      password: "",
      confirmation: "",
    });

  const [profileSaving, setProfileSaving] =
    useState(false);

  const [budgetSaving, setBudgetSaving] =
    useState(false);

  const [passwordSaving, setPasswordSaving] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [exporting, setExporting] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {
    setProfile({
      name:
        user?.name || "",
      email:
        user?.email || "",
      monthlyIncome:
        user?.monthlyIncome ?? "",
      employmentType:
        user?.employmentType ||
        "Salaried",
      currency:
        user?.currency || "INR",
    });
  }, [user]);

  useEffect(() => {
    setMonthlyBudget(
      budget?.monthlyBudget ?? ""
    );
  }, [budget]);

  const profileCompletion =
    useMemo(() => {
      const values = [
        user?.name,
        user?.email,
        Number(user?.monthlyIncome) > 0,
        user?.employmentType,
        user?.currency,
        Number(budget?.monthlyBudget) > 0,
      ];

      return Math.round(
        (
          values.filter(Boolean).length /
          values.length
        ) * 100
      );
    }, [
      user,
      budget?.monthlyBudget,
    ]);

  const clearFeedback = () => {
    setMessage("");
    setError("");
  };

  const showError = (
    err,
    fallback
  ) => {
    setError(
      err?.response?.data?.message ||
      fallback
    );
  };

  const handleProfileChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleProfileSave = async (
    event
  ) => {
    event.preventDefault();

    clearFeedback();

    try {
      setProfileSaving(true);

      const response =
        await updateUserProfile({
          name:
            profile.name.trim(),
          email:
            profile.email.trim(),
          monthlyIncome:
            Number(
              profile.monthlyIncome
            ),
          employmentType:
            profile.employmentType,
          currency:
            profile.currency,
        });

      updateUser(response.user);

      setMessage(
        "Financial profile updated successfully."
      );
    } catch (err) {
      showError(
        err,
        "Unable to update your profile."
      );
    } finally {
      setProfileSaving(false);
    }
  };

  const handleBudgetSave = async (
    event
  ) => {
    event.preventDefault();

    clearFeedback();

    const amount =
      Number(monthlyBudget);

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      setError(
        "Enter a valid monthly budget."
      );
      return;
    }

    try {
      setBudgetSaving(true);

      const now =
        new Date();

      const month =
        now.toLocaleString(
          "default",
          {
            month: "long",
          }
        );

      const year =
        now.getFullYear();

      const response =
        await setBudget({
          monthlyBudget: amount,
          month,
          year,
        });

      const savedBudget =
        response?.data ||
        response?.budget ||
        {
          monthlyBudget: amount,
          month,
          year,
        };

      setBudgetState(
        savedBudget
      );

      setMessage(
        "Monthly budget updated successfully."
      );
    } catch (err) {
      showError(
        err,
        "Unable to update your budget."
      );
    } finally {
      setBudgetSaving(false);
    }
  };

  const handlePasswordChange =
    async (event) => {
      event.preventDefault();

      clearFeedback();

      if (
        passwordForm.newPassword !==
        passwordForm.confirmPassword
      ) {
        setError(
          "New passwords do not match."
        );
        return;
      }

      try {
        setPasswordSaving(true);

        const response =
          await changeUserPassword({
            currentPassword:
              passwordForm.currentPassword,
            newPassword:
              passwordForm.newPassword,
          });

        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        setMessage(
          response.message ||
          "Password changed successfully."
        );
      } catch (err) {
        showError(
          err,
          "Unable to change password."
        );
      } finally {
        setPasswordSaving(false);
      }
    };

  const handleExportPDF =
    async () => {
      if (
        reportLoading ||
        exporting
      ) {
        return;
      }

      try {
        setExporting("pdf");
        clearFeedback();

        await exportPDF();

        setMessage(
          "PDF report generated."
        );
      } catch (err) {
        setError(
          "Unable to export PDF report."
        );
      } finally {
        setExporting("");
      }
    };

  const handleExportExcel =
    async () => {
      if (
        reportLoading ||
        exporting
      ) {
        return;
      }

      try {
        setExporting("excel");
        clearFeedback();

        await exportExcel();

        setMessage(
          "Excel report generated."
        );
      } catch (err) {
        setError(
          "Unable to export Excel report."
        );
      } finally {
        setExporting("");
      }
    };

  const handleLogout = () => {
    logout();

    navigate(
      "/login",
      {
        replace: true,
      }
    );
  };

  const handleDeleteAccount =
    async (event) => {
      event.preventDefault();

      clearFeedback();

      if (
        deleteForm.confirmation !==
        "DELETE"
      ) {
        setError(
          'Type "DELETE" to confirm account deletion.'
        );
        return;
      }

      const confirmed =
        window.confirm(
          "This permanently deletes your SmartMoney account and financial data. Continue?"
        );

      if (!confirmed) {
        return;
      }

      try {
        setDeleting(true);

        await deleteUserAccount({
          password:
            deleteForm.password,
          confirmation:
            deleteForm.confirmation,
        });

        logout();

        navigate(
          "/login",
          {
            replace: true,
          }
        );
      } catch (err) {
        showError(
          err,
          "Unable to delete your account."
        );
      } finally {
        setDeleting(false);
      }
    };

  const currency =
    user?.currency || "INR";

  return (
    <AppShell>
      <div className="settings-page">
        <header className="settings-page-header">
          <div>
            <h1>
              Settings
            </h1>

            <p>
              Manage your financial profile,
              account security, preferences
              and SmartMoney data.
            </p>
          </div>

          <div className="settings-completion">
            <div>
              <span>
                Financial profile
              </span>

              <strong>
                {profileCompletion}%
              </strong>
            </div>

            <div className="settings-progress">
              <span
                style={{
                  width:
                    `${profileCompletion}%`,
                }}
              />
            </div>

            <small>
              {profileCompletion === 100
                ? "Your financial profile is complete."
                : "Complete your profile for better financial insights."}
            </small>
          </div>
        </header>

        {message && (
          <div className="settings-alert success">
            <FaCheckCircle />
            {message}
          </div>
        )}

        {error && (
          <div className="settings-alert error">
            <FaExclamationTriangle />
            {error}
          </div>
        )}

        <div className="settings-layout">
          <div className="settings-column">
<section className="settings-card settings-profile-card">
            <div className="settings-card-heading">
              <div className="settings-icon purple">
                <FaUser />
              </div>

              <div>
                <h2>
                  Financial Profile
                </h2>

                <p>
                  Personalize SmartMoney
                  around your income and
                  financial situation.
                </p>
              </div>
            </div>

            <form
              className="settings-form"
              onSubmit={
                handleProfileSave
              }
            >
              <div className="settings-two-column">
                <label>
                  <span>
                    <FaUser />
                    Full Name
                  </span>

                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={
                      handleProfileChange
                    }
                    minLength="2"
                    maxLength="60"
                    required
                  />
                </label>

                <label>
                  <span>
                    <FaEnvelope />
                    Email Address
                  </span>

                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={
                      handleProfileChange
                    }
                    required
                  />
                </label>
              </div>

              <div className="settings-two-column">
                <label>
                  <span>
                    <FaWallet />
                    Monthly Income
                  </span>

                  <input
                    type="number"
                    name="monthlyIncome"
                    value={
                      profile.monthlyIncome
                    }
                    onChange={
                      handleProfileChange
                    }
                    min="0"
                    placeholder="50000"
                    required
                  />
                </label>

                <label>
                  <span>
                    <FaBriefcase />
                    Employment
                  </span>

                  <select
                    name="employmentType"
                    value={
                      profile.employmentType
                    }
                    onChange={
                      handleProfileChange
                    }
                  >
                    {EMPLOYMENT_TYPES.map(
                      (type) => (
                        <option
                          key={type}
                          value={type}
                        >
                          {type}
                        </option>
                      )
                    )}
                  </select>
                </label>
              </div>

              <label>
                <span>
                  <FaGlobe />
                  Preferred Currency
                </span>

                <select
                  name="currency"
                  value={
                    profile.currency
                  }
                  onChange={
                    handleProfileChange
                  }
                >
                  {CURRENCIES.map(
                    (item) => (
                      <option
                        key={item.code}
                        value={item.code}
                      >
                        {item.code} — {item.label}
                      </option>
                    )
                  )}
                </select>

                <small>
                  This preference is stored
                  on your SmartMoney account.
                </small>
              </label>

              <button
                className="settings-primary-button"
                type="submit"
                disabled={
                  profileSaving
                }
              >
                {profileSaving
                  ? "Saving..."
                  : "Save Profile Changes"}
              </button>
            </form>
          </section>

<section className="settings-card">
            <div className="settings-card-heading">
              <div className="settings-icon amber">
                <FaShieldAlt />
              </div>

              <div>
                <h2>
                  Security
                </h2>

                <p>
                  Protect access to your
                  financial information.
                </p>
              </div>
            </div>

            <form
              className="settings-form"
              onSubmit={
                handlePasswordChange
              }
            >
              <label>
                <span>
                  <FaLock />
                  Current Password
                </span>

                <input
                  type="password"
                  autoComplete="current-password"
                  value={
                    passwordForm.currentPassword
                  }
                  onChange={(event) =>
                    setPasswordForm(
                      (previous) => ({
                        ...previous,
                        currentPassword:
                          event.target.value,
                      })
                    )
                  }
                  required
                />
              </label>

              <div className="settings-two-column">
                <label>
                  <span>
                    <FaKey />
                    New Password
                  </span>

                  <input
                    type="password"
                    autoComplete="new-password"
                    value={
                      passwordForm.newPassword
                    }
                    onChange={(event) =>
                      setPasswordForm(
                        (previous) => ({
                          ...previous,
                          newPassword:
                            event.target.value,
                        })
                      )
                    }
                    minLength="8"
                    required
                  />
                </label>

                <label>
                  <span>
                    <FaKey />
                    Confirm Password
                  </span>

                  <input
                    type="password"
                    autoComplete="new-password"
                    value={
                      passwordForm.confirmPassword
                    }
                    onChange={(event) =>
                      setPasswordForm(
                        (previous) => ({
                          ...previous,
                          confirmPassword:
                            event.target.value,
                        })
                      )
                    }
                    minLength="8"
                    required
                  />
                </label>
              </div>

              <button
                className="settings-secondary-button"
                type="submit"
                disabled={
                  passwordSaving
                }
              >
                {passwordSaving
                  ? "Changing..."
                  : "Change Password"}
              </button>
            </form>
          </section>
          </div>

          <div className="settings-column">
<section className="settings-card settings-budget-card">
            <div className="settings-card-heading">
              <div className="settings-icon blue">
                <FaMoneyBillWave />
              </div>

              <div>
                <h2>
                  Monthly Budget
                </h2>

                <p>
                  Update your spending
                  limit for the current
                  month.
                </p>
              </div>
            </div>

            <div className="settings-budget-value">
              <span>
                Current budget
              </span>

              <strong>
                {formatCurrency(
                  Number(
                    budget?.monthlyBudget ||
                    0
                  ),
                  currency
                )}
              </strong>
            </div>

            <form
              className="settings-form"
              onSubmit={
                handleBudgetSave
              }
            >
              <label>
                <span>
                  <FaWallet />
                  New Monthly Budget
                </span>

                <input
                  type="number"
                  min="1"
                  value={monthlyBudget}
                  onChange={(event) =>
                    setMonthlyBudget(
                      event.target.value
                    )
                  }
                  placeholder="Enter monthly budget"
                  required
                />
              </label>

              <button
                className="settings-secondary-button"
                type="submit"
                disabled={
                  budgetSaving
                }
              >
                {budgetSaving
                  ? "Updating..."
                  : "Update Budget"}
              </button>
            </form>
          </section>

<section className="settings-card">
            <div className="settings-card-heading">
              <div className="settings-icon green">
                <FaDatabase />
              </div>

              <div>
                <h2>
                  Your Data
                </h2>

                <p>
                  Download your current
                  financial report whenever
                  you need it.
                </p>
              </div>
            </div>

            <div className="settings-action-stack">
              <button
                type="button"
                className="settings-action-row"
                onClick={
                  handleExportPDF
                }
                disabled={
                  reportLoading ||
                  Boolean(exporting)
                }
              >
                <div>
                  <FaFilePdf />

                  <span>
                    <strong>
                      Export PDF
                    </strong>

                    <small>
                      Portable financial
                      summary
                    </small>
                  </span>
                </div>

                <b>
                  {exporting === "pdf"
                    ? "Exporting..."
                    : "Download"}
                </b>
              </button>

              <button
                type="button"
                className="settings-action-row"
                onClick={
                  handleExportExcel
                }
                disabled={
                  reportLoading ||
                  Boolean(exporting)
                }
              >
                <div>
                  <FaFileExcel />

                  <span>
                    <strong>
                      Export Excel
                    </strong>

                    <small>
                      Detailed spreadsheet
                      report
                    </small>
                  </span>
                </div>

                <b>
                  {exporting === "excel"
                    ? "Exporting..."
                    : "Download"}
                </b>
              </button>
            </div>
          </section>

<section className="settings-card settings-session-card">
            <div className="settings-card-heading">
              <div className="settings-icon blue">
                <FaSignOutAlt />
              </div>

              <div>
                <h2>
                  Session
                </h2>

                <p>
                  End your current
                  SmartMoney session.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="settings-secondary-button"
              onClick={handleLogout}
            >
              <FaSignOutAlt />
              Log Out
            </button>
          </section>
          </div>

          <div className="settings-danger-row">
<section className="settings-card settings-danger-card">
            <div className="settings-card-heading">
              <div className="settings-icon red">
                <FaTrash />
              </div>

              <div>
                <h2>
                  Danger Zone
                </h2>

                <p>
                  Permanently remove your
                  SmartMoney account and
                  stored financial records.
                </p>
              </div>
            </div>

            <div className="settings-danger-warning">
              <FaExclamationTriangle />

              <p>
                Account deletion cannot be
                undone. Your expenses,
                savings goals, investments,
                recurring expenses and
                budgets will be deleted.
              </p>
            </div>

            <form
              className="settings-form"
              onSubmit={
                handleDeleteAccount
              }
            >
              <label>
                <span>
                  Password
                </span>

                <input
                  type="password"
                  value={
                    deleteForm.password
                  }
                  onChange={(event) =>
                    setDeleteForm(
                      (previous) => ({
                        ...previous,
                        password:
                          event.target.value,
                      })
                    )
                  }
                  required
                />
              </label>

              <label>
                <span>
                  Type DELETE to confirm
                </span>

                <input
                  type="text"
                  value={
                    deleteForm.confirmation
                  }
                  onChange={(event) =>
                    setDeleteForm(
                      (previous) => ({
                        ...previous,
                        confirmation:
                          event.target.value,
                      })
                    )
                  }
                  placeholder="DELETE"
                  autoComplete="off"
                  required
                />
              </label>

              <button
                className="settings-delete-button"
                type="submit"
                disabled={
                  deleting ||
                  deleteForm.confirmation !==
                    "DELETE"
                }
              >
                <FaTrash />

                {deleting
                  ? "Deleting Account..."
                  : "Delete Account Permanently"}
              </button>
            </form>
          </section>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default Settings;
