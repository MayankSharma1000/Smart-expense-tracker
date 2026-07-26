import Card from "@/components/ui/Card";

import "@/styles/dashboard/financial-widget.css";
import "./InvestmentSummary.css";

import { FaArrowTrendUp } from "react-icons/fa6";

function InvestmentSummary({
  portfolioValue = 0,
  investedAmount = 0,
  currency = "INR",
}) {
  const currentValue =
    Number(portfolioValue) || 0;

  const invested =
    Number(investedAmount) || 0;

  const profit =
    currentValue - invested;

  const returns =
    invested > 0
      ? (profit / invested) * 100
      : 0;

  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });

  const hasInvestments =
    invested > 0 || currentValue > 0;

  const progress = hasInvestments
    ? Math.min(
        Math.max(Math.abs(returns), 0),
        100
      )
    : 0;

  const status =
    profit > 0
      ? "Growing"
      : profit < 0
        ? "Down"
        : "Stable";

  const statusClass =
    profit > 0
      ? "success"
      : profit < 0
        ? "danger"
        : "";

  return (
    <Card
      elevated
      className="financial-widget investment-card"
    >
      <div className="widget-header">
        <div className="investment-icon">
          <FaArrowTrendUp />
        </div>

        <div className="widget-heading">
          <h3 className="widget-title">
            Investments
          </h3>

          <p className="widget-subtitle">
            Current portfolio performance
          </p>

          {hasInvestments && (
            <span className={`widget-pill ${statusClass}`}>
              {status}
            </span>
          )}
        </div>
      </div>

      <div className="widget-value">
        {formatter.format(currentValue)}
      </div>

      {!hasInvestments ? (
        <div className="widget-empty-state">
          <p>No investments yet</p>

          <span>
            Add an investment to track portfolio performance.
          </span>
        </div>
      ) : (
        <>
          <div className="widget-progress-wrapper">
            <div className="widget-progress">
              <div
                className="investment-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="widget-progress-info">
              <span>
                {returns >= 0 ? "+" : ""}
                {returns.toFixed(1)}% return
              </span>

              <span>
                {profit >= 0
                  ? "Positive performance"
                  : "Negative performance"}
              </span>
            </div>
          </div>

          <div className="widget-metrics">
            <div className="widget-metric">
              <span className="widget-metric-label">
                Invested
              </span>

              <strong className="widget-metric-value">
                {formatter.format(invested)}
              </strong>
            </div>

            <div className="widget-metric">
              <span className="widget-metric-label">
                Profit / loss
              </span>

              <strong className="widget-metric-value">
                {profit > 0 ? "+" : ""}
                {formatter.format(profit)}
              </strong>
            </div>
          </div>
        </>
      )}

      <div className="widget-footer">
        Based on your recorded portfolio data
      </div>
    </Card>
  );
}

export default InvestmentSummary;
