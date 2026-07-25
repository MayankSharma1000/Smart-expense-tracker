import InvestmentForm from "@/components/Investments/InvestmentForm";
import InvestmentList from "@/components/Investments/InvestmentList";
import EmptyState from "@/components/shared/EmptyState";

import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  FaIndianRupeeSign,
  FaWallet,
  FaArrowTrendUp,
  FaArrowTrendDown
} from "react-icons/fa6";

import AppShell from "../components/layout/AppShell/AppShell";

import {
  createInvestment,
  deleteInvestment,
  getInvestments,
  updateInvestment,
} from "@/services/investmentService";

import "../styles/pages/investments.css";

function Investments() {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    type: "Mutual Fund",
    investedAmount: "",
    currentValue: "",
    purchaseDate: "",
    platform: "",
    notes: ""
  });

  const [editingId, setEditingId] = useState(null);

  const loadInvestments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getInvestments();

      setInvestments(
        response.data?.investments || []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to load investments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvestments();
  }, []);

  const totalInvested = useMemo(() => {
    return investments.reduce(
      (sum, item) =>
        sum + Number(item.investedAmount || 0),
      0
    );
  }, [investments]);

  const currentValue = useMemo(() => {
    return investments.reduce(
      (sum, item) =>
        sum + Number(item.currentValue || 0),
      0
    );
  }, [investments]);

  const profit = useMemo(() => {
    return currentValue - totalInvested;
  }, [currentValue, totalInvested]);

  const returnPercentage = useMemo(() => {
    if (!totalInvested) return 0;

    return (profit / totalInvested) * 100;
  }, [profit, totalInvested]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleAddInvestment = async (e) => {
    e.preventDefault();

    try {
      setSubmitLoading(true);
      setError("");

      if (editingId) {
        const response = await updateInvestment(
          editingId,
          formData
        );

        setInvestments((prev) =>
          prev.map((item) =>
            item._id === editingId
              ? response.data
              : item
          )
        );

        setEditingId(null);
      } else {
        const response =
          await createInvestment(formData);

        setInvestments((prev) => [
          response.data,
          ...prev,
        ]);
      }

      setFormData({
        name: "",
        platform: "",
        type: "Mutual Fund",
        investedAmount: "",
        currentValue: "",
        purchaseDate: "",
        notes: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to save investment."
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (investment) => {
    setEditingId(investment._id);

    setFormData({
      name: investment.name || "",
      type: investment.type || "Mutual Fund",
      platform: investment.platform || "",
      investedAmount:
        investment.investedAmount || "",
      currentValue:
        investment.currentValue || "",
      purchaseDate: investment.purchaseDate
        ? investment.purchaseDate.substring(0, 10)
        : "",
      notes: investment.notes || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this investment?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteInvestment(id);

      setInvestments((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to delete investment."
      );
    }
  };

  const currency = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN")}`;

  const isPositive = profit >= 0;

  return (
    <AppShell>
      <main className="investments-page">

        <header className="investments-page-header">
          <div>
            <h1>Investment Tracker</h1>

            <p>
              Track mutual funds, stocks, gold, crypto,
              SIPs, invested amount, current value and
              profit/loss from MongoDB.
            </p>
          </div>
        </header>

        {error && (
          <div className="investments-error">
            {error}
          </div>
        )}

        <section className="investment-summary-grid">

          <article className="investment-summary-card invested">
            <div className="investment-summary-icon">
              <FaIndianRupeeSign />
            </div>

            <div className="investment-summary-copy">
              <span>Total Invested</span>

              <h2>{currency(totalInvested)}</h2>

              <p>All time invested amount</p>
            </div>

            <div
              className="investment-mini-line"
              aria-hidden="true"
            >
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </article>

          <article className="investment-summary-card value">
            <div className="investment-summary-icon">
              <FaWallet />
            </div>

            <div className="investment-summary-copy">
              <span>Current Value</span>

              <h2>{currency(currentValue)}</h2>

              <p>Current portfolio value</p>
            </div>

            <div
              className="investment-mini-line"
              aria-hidden="true"
            >
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </article>

          <article className="investment-summary-card returns">
            <div className="investment-summary-icon">
              {isPositive
                ? <FaArrowTrendUp />
                : <FaArrowTrendDown />}
            </div>

            <div className="investment-summary-copy">
              <span>Profit / Loss</span>

              <div className="investment-return-value">
                <h2>
                  {isPositive ? "" : "-"}
                  {currency(Math.abs(profit))}
                </h2>

                <strong
                  className={
                    isPositive
                      ? "positive"
                      : "negative"
                  }
                >
                  {isPositive ? "+" : "-"}
                  {Math.abs(returnPercentage).toFixed(2)}%
                </strong>
              </div>

              <p>Total returns</p>
            </div>

            <div
              className="investment-mini-line"
              aria-hidden="true"
            >
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </article>

        </section>

        <section className="investment-workspace">

          <article className="investment-form-panel">

            <div className="investment-panel-heading">
              <div>
                <h2>
                  {editingId
                    ? "Update Investment"
                    : "Add New Investment"}
                </h2>

                <p>
                  {editingId
                    ? "Update the details of this portfolio holding."
                    : "Record a new asset in your portfolio."}
                </p>
              </div>
            </div>

            <InvestmentForm
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleAddInvestment}
              isEditing={Boolean(editingId)}
              submitLoading={submitLoading}
            />

          </article>

          <article className="investment-holdings-panel">

            <div className="investment-holdings-heading">
              <div>
                <h2>Portfolio Holdings</h2>

                <p>
                  {investments.length} Active investment
                  {investments.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="investment-loading">
                Loading investments...
              </div>
            ) : investments.length === 0 ? (
              <EmptyState
                title="No Investments Yet"
                description="Start tracking your portfolio by adding your first investment."
                actionText="Add Investment"
                onAction={() =>
                  document
                    .querySelector(".investment-form")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    })
                }
              />
            ) : (
              <InvestmentList
                investments={investments}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}

          </article>

        </section>

      </main>
    </AppShell>
  );
}

export default Investments;
