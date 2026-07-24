import { useEffect, useMemo, useState } from "react";

import {
  FaCalendarDays,
  FaCirclePlus,
  FaClock,
  FaCreditCard,
  FaIndianRupeeSign,
  FaLayerGroup,
  FaTrashCan,
} from "react-icons/fa6";

import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

import AppShell from "../components/layout/AppShell/AppShell";
import { recurringExpenseIcons } from "../utils/recurringExpenseIcons";

import {
  createRecurringExpense,
  deleteRecurringExpense,
  getRecurringExpenses,
} from "../services/recurringExpenseService";

import "../styles/pages/recurringExpenses.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const CATEGORIES = [
  "Bills",
  "Rent",
  "EMI",
  "Insurance",
  "Subscription",
  "Utilities",
  "Internet",
  "Education",
  "Health",
  "Other",
];

const FREQUENCIES = [
  "Weekly",
  "Monthly",
  "Quarterly",
  "Yearly",
];

const PAYMENT_METHODS = [
  "Auto Debit",
  "UPI",
  "Credit Card",
  "Debit Card",
  "Net Banking",
  "Cash",
  "Other",
];

const CHART_COLORS = [
  "#2da8ff",
  "#38d6aa",
  "#a879ff",
  "#ffb451",
  "#ff637b",
  "#42cce8",
  "#69d795",
  "#7898ff",
  "#d783ff",
  "#8b9ab0",
];

function RecurringExpenses() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "Bills",
    frequency: "Monthly",
    nextDueDate: "",
    paymentMethod: "Auto Debit",
  });

  useEffect(() => {
    const loadRecurringExpenses = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getRecurringExpenses();

        const recurringItems =
          response?.data ||
          response?.recurringExpenses ||
          response ||
          [];

        setItems(
          Array.isArray(recurringItems)
            ? recurringItems
            : []
        );
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load recurring expenses."
        );
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadRecurringExpenses();
  }, []);

  const getMonthlyEquivalent = (item) => {
    const amount = Number(item.amount || 0);

    switch (item.frequency) {
      case "Weekly":
        return (amount * 52) / 12;
      case "Quarterly":
        return amount / 3;
      case "Yearly":
        return amount / 12;
      case "Monthly":
      default:
        return amount;
    }
  };

  const totalMonthly = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum + getMonthlyEquivalent(item),
        0
      ),
    [items]
  );

  const annualCommitment = useMemo(
    () => totalMonthly * 12,
    [totalMonthly]
  );

  const activeBills = useMemo(
    () =>
      items.filter(
        (item) => item.isActive !== false
      ).length,
    [items]
  );

  const nextPayment = useMemo(() => {
    const datedItems = items
      .filter((item) => item.nextDueDate)
      .sort(
        (a, b) =>
          new Date(a.nextDueDate) -
          new Date(b.nextDueDate)
      );

    return datedItems[0] || null;
  }, [items]);

  const categoryTotals = useMemo(() => {
    const totals = {};

    items.forEach((item) => {
      const category = item.category || "Other";

      totals[category] =
        (totals[category] || 0) +
        getMonthlyEquivalent(item);
    });

    return totals;
  }, [items]);

  const largestCategory = useMemo(() => {
    const entries = Object.entries(categoryTotals);

    if (!entries.length) return null;

    return [...entries].sort(
      (a, b) => b[1] - a[1]
    )[0];
  }, [categoryTotals]);

  const chartData = useMemo(
    () => ({
      labels: Object.keys(categoryTotals),
      datasets: [
        {
          data: Object.values(categoryTotals),
          backgroundColor: CHART_COLORS,
          borderColor: "#0b1422",
          borderWidth: 3,
          hoverOffset: 5,
        },
      ],
    }),
    [categoryTotals]
  );

  const formatCurrency = (value) =>
    `₹${Math.round(
      Number(value || 0)
    ).toLocaleString("en-IN")}`;

  const formatDate = (date) => {
    if (!date) return "Not set";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getDaysUntil = (date) => {
    if (!date) return null;

    const today = new Date();
    const due = new Date(date);

    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    return Math.ceil(
      (due - today) / (1000 * 60 * 60 * 24)
    );
  };

  const getDueLabel = (date) => {
    const days = getDaysUntil(date);

    if (days === null) return "No due date";
    if (days < 0) return `${Math.abs(days)}d overdue`;
    if (days === 0) return "Due today";
    if (days === 1) return "Due tomorrow";

    return `Due in ${days}d`;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddRecurring = async (e) => {
    e.preventDefault();

    try {
      setSubmitLoading(true);
      setError("");

      const response =
        await createRecurringExpense({
          ...formData,
          amount: Number(formData.amount),
        });

      const createdItem =
        response?.data ||
        response?.recurringExpense ||
        response;

      if (createdItem) {
        setItems((prev) => [
          createdItem,
          ...prev,
        ]);
      }

      setFormData({
        title: "",
        amount: "",
        category: "Bills",
        frequency: "Monthly",
        nextDueDate: "",
        paymentMethod: "Auto Debit",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to add recurring expense."
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;

    const confirmed = window.confirm(
      "Delete this recurring expense?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteRecurringExpense(id);

      setItems((prev) =>
        prev.filter(
          (item) =>
            (item._id || item.id) !== id
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete recurring expense."
      );
    }
  };

  return (
    <AppShell>
      <div className="recurring-page">
        <header className="recurring-page-header">
          <div>
            <h1>Recurring Expenses</h1>
            <p>
              Commitments. Subscriptions. Control.
            </p>
          </div>

          {nextPayment && (
            <div className="next-payment-chip">
              <span>Next payment</span>
              <strong>{nextPayment.title}</strong>
              <small>
                {formatCurrency(nextPayment.amount)}
                {" • "}
                {getDueLabel(nextPayment.nextDueDate)}
              </small>
            </div>
          )}
        </header>

        {error && (
          <div className="recurring-error">
            {error}
          </div>
        )}

        <section className="recurring-stat-grid">
          <article className="recurring-stat-card">
            <div className="recurring-stat-icon">
              <FaIndianRupeeSign />
            </div>

            <div>
              <span>Monthly Commitments</span>
              <strong>
                {formatCurrency(totalMonthly)}
              </strong>
              <small>Monthly equivalent</small>
            </div>
          </article>

          <article className="recurring-stat-card">
            <div className="recurring-stat-icon">
              <FaCalendarDays />
            </div>

            <div>
              <span>Active Payments</span>
              <strong>{activeBills}</strong>
              <small>Recurring commitments</small>
            </div>
          </article>

          <article className="recurring-stat-card">
            <div className="recurring-stat-icon">
              <FaLayerGroup />
            </div>

            <div>
              <span>Annual Commitment</span>
              <strong>
                {formatCurrency(annualCommitment)}
              </strong>
              <small>Projected yearly total</small>
            </div>
          </article>

          <article className="recurring-stat-card">
            <div className="recurring-stat-icon">
              <FaClock />
            </div>

            <div>
              <span>Next Due</span>
              <strong className="next-due-value">
                {nextPayment
                  ? formatCurrency(nextPayment.amount)
                  : "—"}
              </strong>
              <small>
                {nextPayment
                  ? getDueLabel(nextPayment.nextDueDate)
                  : "Nothing scheduled"}
              </small>
            </div>
          </article>
        </section>

        {loading ? (
          <section className="recurring-loading-state">
            Loading recurring expenses...
          </section>
        ) : (
          <div className="recurring-workspace">
            <div className="recurring-left-column">
              <section className="recurring-panel recurring-form-panel">
                <div className="recurring-panel-heading">
                  <div>
                    <span className="recurring-eyebrow">
                      NEW COMMITMENT
                    </span>
                    <h2>Add Recurring Expense</h2>
                    <p>
                      Add a payment that repeats on a
                      regular schedule.
                    </p>
                  </div>

                  <div className="panel-heading-icon">
                    <FaCirclePlus />
                  </div>
                </div>

                <form
                  className="recurring-premium-form"
                  onSubmit={handleAddRecurring}
                >
                  <label className="recurring-field recurring-field-wide">
                    <span>PAYMENT NAME</span>
                    <input
                      type="text"
                      name="title"
                      placeholder="e.g. Netflix, Home EMI"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </label>

                  <label className="recurring-field">
                    <span>AMOUNT</span>
                    <div className="amount-input-shell">
                      <FaIndianRupeeSign />
                      <input
                        type="number"
                        name="amount"
                        min="1"
                        step="0.01"
                        placeholder="0"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </label>

                  <label className="recurring-field">
                    <span>CATEGORY</span>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      {CATEGORIES.map((category) => (
                        <option
                          key={category}
                          value={category}
                        >
                          {category}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="recurring-field">
                    <span>FREQUENCY</span>
                    <select
                      name="frequency"
                      value={formData.frequency}
                      onChange={handleChange}
                    >
                      {FREQUENCIES.map((frequency) => (
                        <option
                          key={frequency}
                          value={frequency}
                        >
                          {frequency}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="recurring-field">
                    <span>PAYMENT METHOD</span>
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleChange}
                    >
                      {PAYMENT_METHODS.map((method) => (
                        <option
                          key={method}
                          value={method}
                        >
                          {method}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="recurring-field recurring-field-wide">
                    <span>NEXT DUE DATE</span>
                    <input
                      type="date"
                      name="nextDueDate"
                      value={formData.nextDueDate}
                      onChange={handleChange}
                      required
                    />
                  </label>

                  <button
                    className="recurring-submit-button"
                    type="submit"
                    disabled={
                      submitLoading ||
                      !formData.title.trim() ||
                      !formData.amount ||
                      Number(formData.amount) <= 0 ||
                      !formData.nextDueDate
                    }
                  >
                    <FaCirclePlus />
                    {submitLoading
                      ? "Adding..."
                      : "Add Recurring Payment"}
                  </button>
                </form>
              </section>

              <section className="recurring-panel breakdown-panel">
                <div className="recurring-panel-heading compact">
                  <div>
                    <span className="recurring-eyebrow">
                      DISTRIBUTION
                    </span>
                    <h2>Monthly Breakdown</h2>
                    <p>
                      Monthly equivalent by category.
                    </p>
                  </div>

                  <strong className="breakdown-total">
                    {formatCurrency(totalMonthly)}
                  </strong>
                </div>

                {items.length === 0 ? (
                  <div className="breakdown-empty">
                    Category distribution will appear
                    after you add a recurring payment.
                  </div>
                ) : (
                  <>
                    <div className="recurring-chart-area">
                      <div className="recurring-doughnut-wrap">
                        <Doughnut
                          data={chartData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            cutout: "73%",
                            plugins: {
                              legend: {
                                display: false,
                              },
                              tooltip: {
                                callbacks: {
                                  label: (context) =>
                                    ` ${context.label}: ${formatCurrency(
                                      context.raw
                                    )}`,
                                },
                              },
                            },
                          }}
                        />

                        <div className="doughnut-center">
                          <span>MONTHLY</span>
                          <strong>
                            {formatCurrency(totalMonthly)}
                          </strong>
                        </div>
                      </div>

                      <div className="breakdown-list">
                        {Object.entries(categoryTotals)
                          .sort((a, b) => b[1] - a[1])
                          .map(
                            (
                              [category, amount],
                              index
                            ) => (
                              <div
                                className="breakdown-row"
                                key={category}
                              >
                                <div>
                                  <i
                                    style={{
                                      backgroundColor:
                                        CHART_COLORS[
                                          index %
                                            CHART_COLORS.length
                                        ],
                                    }}
                                  />
                                  <span>{category}</span>
                                </div>

                                <strong>
                                  {formatCurrency(amount)}
                                </strong>

                                <small>
                                  {totalMonthly > 0
                                    ? (
                                        (amount /
                                          totalMonthly) *
                                        100
                                      ).toFixed(1)
                                    : "0.0"}
                                  %
                                </small>
                              </div>
                            )
                          )}
                      </div>
                    </div>

                    {largestCategory && (
                      <div className="recurring-insight">
                        <span>INSIGHT</span>
                        <p>
                          <strong>
                            {largestCategory[0]}
                          </strong>{" "}
                          is your largest recurring
                          category at{" "}
                          <strong>
                            {(
                              (largestCategory[1] /
                                totalMonthly) *
                              100
                            ).toFixed(1)}
                            %
                          </strong>{" "}
                          of monthly commitments.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </section>
            </div>

            <section className="recurring-panel upcoming-panel">
              <div className="recurring-panel-heading upcoming-heading">
                <div>
                  <span className="recurring-eyebrow">
                    SCHEDULE
                  </span>
                  <h2>Upcoming Payments</h2>
                  <p>
                    Your recurring commitments and
                    their next due dates.
                  </p>
                </div>

                <span className="recurring-record-count">
                  {items.length}{" "}
                  {items.length === 1
                    ? "payment"
                    : "payments"}
                </span>
              </div>

              {items.length === 0 ? (
                <div className="recurring-empty-state">
                  <div className="empty-state-icon">
                    <FaCalendarDays />
                  </div>
                  <h3>No recurring payments yet</h3>
                  <p>
                    Add your first commitment to start
                    building your payment schedule.
                  </p>
                </div>
              ) : (
                <div className="recurring-table">
                  <div className="recurring-table-header">
                    <span>PAYMENT</span>
                    <span>CATEGORY</span>
                    <span>FREQUENCY</span>
                    <span>NEXT DUE</span>
                    <span>METHOD</span>
                    <span className="recurring-amount-heading">
                      AMOUNT
                    </span>
                    <span className="recurring-action-heading">
                      ACTION
                    </span>
                  </div>

                  <div className="recurring-payment-list">
                    {[...items]
                      .sort((a, b) => {
                        if (!a.nextDueDate) return 1;
                        if (!b.nextDueDate) return -1;

                        return (
                          new Date(a.nextDueDate) -
                          new Date(b.nextDueDate)
                        );
                      })
                      .map((item) => {
                        const itemId =
                          item._id || item.id;

                        const categoryClass = (
                          item.category || "Other"
                        )
                          .toLowerCase()
                          .replace(/\s+/g, "-");

                        return (
                          <article
                            className="recurring-payment-row"
                            key={itemId}
                          >
                            <div className="recurring-payment-name">
                              <div
                                className={`recurring-category-icon recurring-category-${categoryClass}`}
                              >
                                {recurringExpenseIcons[
                                  item.category
                                ] ||
                                  recurringExpenseIcons.Other}
                              </div>

                              <div>
                                <strong>
                                  {item.title}
                                </strong>
                                <small>
                                  Recurring payment
                                </small>
                              </div>
                            </div>

                            <span
                              className={`recurring-category-badge recurring-category-${categoryClass}`}
                            >
                              {item.category || "Other"}
                            </span>

                            <span className="recurring-frequency">
                              {item.frequency || "Monthly"}
                            </span>

                            <div className="recurring-due-date">
                              <strong>
                                {formatDate(
                                  item.nextDueDate
                                )}
                              </strong>
                              <small
                                className={
                                  (getDaysUntil(
                                    item.nextDueDate
                                  ) ?? 0) < 0
                                    ? "overdue"
                                    : ""
                                }
                              >
                                {getDueLabel(
                                  item.nextDueDate
                                )}
                              </small>
                            </div>

                            <span className="recurring-method">
                              <FaCreditCard />
                              {item.paymentMethod ||
                                "Auto Debit"}
                            </span>

                            <strong className="recurring-payment-amount">
                              {formatCurrency(item.amount)}
                            </strong>

                            <button
                              className="recurring-delete-button"
                              type="button"
                              onClick={() =>
                                handleDelete(itemId)
                              }
                              aria-label={`Delete ${item.title}`}
                            >
                              <FaTrashCan />
                            </button>
                          </article>
                        );
                      })}
                  </div>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default RecurringExpenses;
