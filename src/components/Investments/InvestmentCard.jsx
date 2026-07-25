import "./InvestmentCard.css";

import {
  FaArrowTrendDown,
  FaArrowTrendUp,
  FaPen,
  FaTrashCan
} from "react-icons/fa6";

function InvestmentCard({
  investment,
  onEdit,
  onDelete
}) {
  const {
    name,
    type,
    currentValue,
    investedAmount,
    platform,
    purchaseDate
  } = investment;

  const invested = Number(investedAmount || 0);
  const current = Number(currentValue || 0);

  const profit = current - invested;

  const percentage =
    invested > 0
      ? (profit / invested) * 100
      : 0;

  const isProfit = profit >= 0;

  const currency = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN")}`;

  const formattedDate = purchaseDate
    ? new Date(purchaseDate).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric"
        }
      )
    : "";

  return (
    <article className="portfolio-investment-card">

      <div className="portfolio-investment-main">

        <div
          className={`portfolio-type-icon ${
            isProfit ? "positive" : "negative"
          }`}
        >
          {isProfit
            ? <FaArrowTrendUp />
            : <FaArrowTrendDown />}
        </div>

        <div className="portfolio-investment-identity">
          <div className="portfolio-title-row">
            <h3>{name}</h3>

            <span className="portfolio-type-chip">
              {type}
            </span>
          </div>

          <p>
            {formattedDate && (
              <>
                Invested {formattedDate}
              </>
            )}

            {formattedDate && platform && (
              <span className="portfolio-dot">•</span>
            )}

            {platform}
          </p>
        </div>

      </div>

      <div className="portfolio-metric">
        <span>Invested</span>
        <strong>{currency(invested)}</strong>
      </div>

      <div className="portfolio-metric">
        <span>Current</span>
        <strong>{currency(current)}</strong>
      </div>

      <div className="portfolio-metric portfolio-return">
        <span>Profit / Loss</span>

        <strong
          className={
            isProfit
              ? "profit"
              : "loss"
          }
        >
          {isProfit ? "+" : "-"}
          {currency(Math.abs(profit))}
        </strong>

        <small
          className={
            isProfit
              ? "profit"
              : "loss"
          }
        >
          {isProfit ? "+" : "-"}
          {Math.abs(percentage).toFixed(2)}%
        </small>
      </div>

      <div className="portfolio-actions">

        <button
          type="button"
          className="portfolio-edit-btn"
          aria-label={`Edit ${name}`}
          title="Edit investment"
          onClick={() => onEdit(investment)}
        >
          <FaPen />
        </button>

        <button
          type="button"
          className="portfolio-delete-btn"
          aria-label={`Delete ${name}`}
          title="Delete investment"
          onClick={() => onDelete(investment._id)}
        >
          <FaTrashCan />
        </button>

      </div>

    </article>
  );
}

export default InvestmentCard;
