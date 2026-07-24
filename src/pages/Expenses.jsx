import { useMemo, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  FaMagnifyingGlass,
  FaPlus,
  FaTrash,
  FaXmark,
  FaWallet,
  FaArrowTrendUp,
  FaReceipt,
  FaIndianRupeeSign,
  FaChevronLeft,
  FaChevronRight,
  FaSliders
} from "react-icons/fa6";

import AppShell from "../components/layout/AppShell/AppShell";
import { categories } from "../constants/categories";
import { ITEMS_PER_PAGE } from "../constants/pagination";
import { categoryIcons } from "../utils/categoryIcons.jsx";

import {
  addExpense,
  deleteExpense,
  getExpenses
} from "../services/expenseService.js";

import "../styles/pages/expenses.css";


function Expenses() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [searchText, setSearchText] = useState(
    searchParams.get("search") || ""
  );

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPayment, setSelectedPayment] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    amount: "",
    date: "",
    note: "",
    paymentMethod: "UPI"
  });

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getExpenses();
      setExpenses(data.data?.expenses || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load expenses. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    setSearchText(searchParams.get("search") || "");
  }, [searchParams]);

  const totalExpense = useMemo(
    () =>
      expenses.reduce(
        (sum, expense) => sum + Number(expense.amount || 0),
        0
      ),
    [expenses]
  );

  const dailyAverage = useMemo(() => {
    if (!expenses.length) return 0;

    const datedExpenses = expenses.filter((expense) => expense.date);

    if (!datedExpenses.length) {
      return totalExpense / expenses.length;
    }

    const uniqueDays = new Set(
      datedExpenses.map((expense) =>
        new Date(expense.date).toDateString()
      )
    );

    return totalExpense / Math.max(uniqueDays.size, 1);
  }, [expenses, totalExpense]);

  const highestExpense = useMemo(
    () =>
      expenses.reduce(
        (highest, expense) =>
          Math.max(highest, Number(expense.amount || 0)),
        0
      ),
    [expenses]
  );

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const searchValue = searchText.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        expense.title?.toLowerCase().includes(searchValue) ||
        expense.category?.toLowerCase().includes(searchValue) ||
        expense.paymentMethod?.toLowerCase().includes(searchValue) ||
        expense.note?.toLowerCase().includes(searchValue);

      const matchesCategory =
        selectedCategory === "All" ||
        expense.category === selectedCategory;

      const matchesPayment =
        selectedPayment === "All" ||
        (expense.paymentMethod || "UPI") === selectedPayment;

      return matchesSearch && matchesCategory && matchesPayment;
    });
  }, [expenses, searchText, selectedCategory, selectedPayment]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredExpenses.length / ITEMS_PER_PAGE)
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const currentExpenses = filteredExpenses.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  );

  const resultStart = filteredExpenses.length
    ? (safeCurrentPage - 1) * ITEMS_PER_PAGE + 1
    : 0;

  const resultEnd = Math.min(
    safeCurrentPage * ITEMS_PER_PAGE,
    filteredExpenses.length
  );

  const handleSearchChange = (value) => {
    setCurrentPage(1);
    setSearchText(value);

    if (value.trim()) {
      setSearchParams({ search: value });
    } else {
      setSearchParams({});
    }
  };

  const clearFilters = () => {
    setSearchText("");
    setSelectedCategory("All");
    setSelectedPayment("All");
    setCurrentPage(1);
    setSearchParams({});
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();

    try {
      setSubmitLoading(true);
      setError("");

      const data = await addExpense({
        ...formData,
        amount: Number(formData.amount)
      });

      setExpenses((prev) => [data.data, ...prev]);

      setFormData({
        title: "",
        category: "",
        amount: "",
        date: "",
        note: "",
        paymentMethod: "UPI"
      });

      setCurrentPage(1);
      setShowForm(false);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to add expense. Please try again."
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmed) return;

    try {
      setError("");
      await deleteExpense(id);

      setExpenses((prev) =>
        prev.filter((expense) => expense._id !== id)
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete expense. Please try again."
      );
    }
  };

  const formatCurrency = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN")}`;

  const formatDate = (date) => {
    if (!date) return "No date";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <AppShell>
      <div className="transactions-page">
        <header className="transactions-header">
          <div>
            <h1>Transactions</h1>
            <p>Track. Understand. Optimize.</p>
          </div>

          <button
            className="add-expense-primary"
            type="button"
            onClick={() => setShowForm((prev) => !prev)}
          >
            {showForm ? <FaXmark /> : <FaPlus />}
            {showForm ? "Close" : "Add Expense"}
          </button>
        </header>

        {error && (
          <div className="expenses-error">
            {error}
          </div>
        )}

        {showForm && (
          <section className="expense-entry-panel">
            <div className="expense-entry-heading">
              <div>
                <span className="section-eyebrow">NEW TRANSACTION</span>
                <h2>Add an expense</h2>
              </div>

              <button
                type="button"
                className="expense-form-close"
                onClick={() => setShowForm(false)}
                aria-label="Close expense form"
              >
                <FaXmark />
              </button>
            </div>

            <form
              className="premium-expense-form"
              onSubmit={handleAddExpense}
            >
              <input
                type="text"
                name="title"
                placeholder="Transaction title"
                value={formData.title}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={formData.amount}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Category
                </option>

                {categories
                  .filter((category) => category !== "All")
                  .map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
              </select>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />

              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
              >
                <option>UPI</option>
                <option>Cash</option>
                <option>Credit Card</option>
                <option>Debit Card</option>
                <option>Net Banking</option>
              </select>

              <input
                type="text"
                name="note"
                placeholder="Note (optional)"
                value={formData.note}
                onChange={handleChange}
              />

              <button
                className="expense-save-button"
                type="submit"
                disabled={
                  submitLoading ||
                  !formData.title ||
                  !formData.amount ||
                  !formData.category
                }
              >
                <FaPlus />
                {submitLoading ? "Adding..." : "Add Transaction"}
              </button>
            </form>
          </section>
        )}

        <section className="expense-stat-grid">
          <article className="expense-stat-card">
            <div className="stat-icon">
              <FaWallet />
            </div>
            <div>
              <span>Total Expenses</span>
              <strong>{formatCurrency(totalExpense)}</strong>
            </div>
          </article>

          <article className="expense-stat-card">
            <div className="stat-icon">
              <FaArrowTrendUp />
            </div>
            <div>
              <span>Daily Average</span>
              <strong>{formatCurrency(Math.round(dailyAverage))}</strong>
            </div>
          </article>

          <article className="expense-stat-card">
            <div className="stat-icon">
              <FaReceipt />
            </div>
            <div>
              <span>Transactions</span>
              <strong>{expenses.length}</strong>
            </div>
          </article>

          <article className="expense-stat-card">
            <div className="stat-icon">
              <FaIndianRupeeSign />
            </div>
            <div>
              <span>Highest Expense</span>
              <strong>{formatCurrency(highestExpense)}</strong>
            </div>
          </article>
        </section>

        <section className="transactions-panel">
          <div className="transactions-panel-heading">
            <div>
              <span className="section-eyebrow">ACTIVITY</span>
              <h2>Transaction History</h2>
            </div>

            <span className="transaction-count">
              {filteredExpenses.length} records
            </span>
          </div>

          <div className="expense-toolbar">
            <div className="expense-filter-grid">
              <div className="premium-search">
                <FaMagnifyingGlass />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchText}
                  onChange={(e) =>
                    handleSearchChange(e.target.value)
                  }
                />
              </div>

              <div className="filter-control">
                <FaSliders />
                <select
                  aria-label="Filter by category"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  {categories.map((category) => (
                    <option key={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-control payment-filter-control">
                <FaWallet />
                <select
                  aria-label="Filter by payment method"
                  value={selectedPayment}
                  onChange={(e) => {
                    setSelectedPayment(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option>All</option>
                  <option>UPI</option>
                  <option>Cash</option>
                  <option>Credit Card</option>
                  <option>Debit Card</option>
                  <option>Net Banking</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            {(searchText ||
              selectedCategory !== "All" ||
              selectedPayment !== "All") && (
              <button
                className="clear-filter-button"
                type="button"
                onClick={clearFilters}
              >
                Clear filters
              </button>
            )}
          </div>

          {loading ? (
            <div className="expenses-empty-state">
              Loading transactions...
            </div>
          ) : expenses.length === 0 ? (
            <div className="expenses-empty-state">
              No transactions yet. Add your first expense.
            </div>
          ) : filteredExpenses.length === 0 ? (
            <div className="expenses-empty-state">
              No transactions match your filters.
            </div>
          ) : (
            <>
              <div className="transaction-table-shell">
                <div className="transaction-table-header">
                  <span>DATE</span>
                  <span>TITLE</span>
                  <span>CATEGORY</span>
                  <span>PAYMENT</span>
                  <span>ABOUT</span>
                  <span className="table-heading-amount">
                    AMOUNT
                  </span>
                  <span className="table-heading-action">
                    ACTION
                  </span>
                </div>

                <div className="transaction-list">
                  {currentExpenses.map((expense) => (
                    <article
                      className="premium-transaction-row"
                      key={expense._id}
                    >
                      <div className="transaction-date-cell">
                        {formatDate(expense.date)}
                      </div>

                      <div className="transaction-title-cell">
                        <div
                          className={`premium-category-icon category-${(
                            expense.category || "Other"
                          )
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {categoryIcons[expense.category] ||
                            categoryIcons.Other}
                        </div>

                        <div className="transaction-copy">
                          <h3>{expense.title}</h3>
                          <span>Expense transaction</span>
                        </div>
                      </div>

                      <div className="transaction-category-cell">
                        <span
                          className={`category-badge category-badge-${(
                            expense.category || "Other"
                          )
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {expense.category || "Other"}
                        </span>
                      </div>

                      <div className="transaction-payment-cell">
                        <span className="payment-badge">
                          {expense.paymentMethod || "UPI"}
                        </span>
                      </div>

                      <div
                        className="transaction-about-cell"
                        title={expense.note || "No note added"}
                      >
                        {expense.note || "No note added"}
                      </div>

                      <strong className="transaction-amount">
                        -{formatCurrency(expense.amount)}
                      </strong>

                      <div className="transaction-action-cell">
                        <button
                          className="transaction-delete"
                          type="button"
                          onClick={() =>
                            handleDelete(expense._id)
                          }
                          aria-label={`Delete ${expense.title}`}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <footer className="transaction-pagination">
                <p>
                  Showing <strong>{resultStart}</strong> to{" "}
                  <strong>{resultEnd}</strong> of{" "}
                  <strong>{filteredExpenses.length}</strong>{" "}
                  results
                </p>

                <div className="pagination-controls">
                  <button
                    type="button"
                    disabled={safeCurrentPage === 1}
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.max(1, page - 1)
                      )
                    }
                    aria-label="Previous page"
                  >
                    <FaChevronLeft />
                  </button>

                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map((page) => (
                    <button
                      type="button"
                      key={page}
                      className={
                        safeCurrentPage === page
                          ? "active"
                          : ""
                      }
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={safeCurrentPage === totalPages}
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.min(totalPages, page + 1)
                      )
                    }
                    aria-label="Next page"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </footer>
            </>
          )}
        </section>
      </div>
    </AppShell>
  );
}

export default Expenses;
