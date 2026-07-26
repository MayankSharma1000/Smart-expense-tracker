import Card from "@/components/ui/Card";
import "@/styles/dashboard/financial-widget.css";
import "./BudgetProgress.css";

import {
  FaCalendarDays,
  FaMoneyBillWave,
} from "react-icons/fa6";

function BudgetProgress({
  monthlyBudget = 0,
  spent = 0,
  remaining = 0,
  percentageUsed = 0,
  currency = "INR",
}) {
  const budget = Number(monthlyBudget) || 0;
  const spentAmount = Number(spent) || 0;
  const remainingAmount = Number(remaining) || 0;

  const safePercentage = Math.min(
    Math.max(Number(percentageUsed) || 0, 0),
    100
  );

  const today = new Date();

  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();

  const remainingDays = Math.max(
    daysInMonth - today.getDate(),
    1
  );

  const dailyBudget = Math.max(
    Math.floor(remainingAmount / remainingDays),
    0
  );

  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });

  const status =
    safePercentage >= 90
      ? "Critical"
      : safePercentage >= 70
        ? "Watch"
        : "Healthy";

  const statusClass =
    safePercentage >= 90
      ? "danger"
      : safePercentage >= 70
        ? "warning"
        : "success";

  return (
    <Card
      elevated
      className="financial-widget budget-card"
    >
      <div className="widget-header">
        <div className="budget-icon">
          <FaMoneyBillWave />
        </div>

        <div className="widget-heading">
          <h3 className="widget-title">
            Monthly Budget
          </h3>

          <p className="widget-subtitle">
            Spending limit for this month
          </p>

          <span className={`widget-pill ${statusClass}`}>
            {status}
          </span>
        </div>
      </div>

      <div className="widget-value">
        {formatter.format(budget)}
      </div>

      <div className="widget-progress-wrapper">
        <div className="widget-progress">
          <div
            className="budget-progress-fill"
            style={{ width: `${safePercentage}%` }}
          />
        </div>

        <div className="widget-progress-info">
          <span>{safePercentage}% used</span>
          <span>
            {formatter.format(remainingAmount)} left
          </span>
        </div>
      </div>

      <div className="widget-metrics">
        <div className="widget-metric">
          <span className="widget-metric-label">
            Spent
          </span>

          <strong className="widget-metric-value">
            {formatter.format(spentAmount)}
          </strong>
        </div>

        <div className="widget-metric">
          <span className="widget-metric-label">
            Daily budget
          </span>

          <strong className="widget-metric-value">
            {formatter.format(dailyBudget)}
          </strong>
        </div>
      </div>

      <div className="widget-footer">
        <FaCalendarDays />
        <span>
          Resets in {remainingDays} days
        </span>
      </div>
    </Card>
  );
}

export default BudgetProgress;
