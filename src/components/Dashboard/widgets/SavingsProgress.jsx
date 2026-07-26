import Card from "@/components/ui/Card";

import "@/styles/dashboard/financial-widget.css";
import "./SavingsProgress.css";

import { FaPiggyBank } from "react-icons/fa";

function SavingsProgress({
  currentAmount = 0,
  targetAmount = 0,
  currency = "INR",
}) {
  const saved = Number(currentAmount) || 0;
  const target = Number(targetAmount) || 0;

  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });

  const hasGoal = target > 0;

  const progress = hasGoal
    ? Math.min(
        Math.max(
          Math.round((saved / target) * 100),
          0
        ),
        100
      )
    : 0;

  const remainingAmount = hasGoal
    ? Math.max(target - saved, 0)
    : 0;

  return (
    <Card
      elevated
      className="financial-widget savings-card"
    >
      <div className="widget-header">
        <div className="savings-icon">
          <FaPiggyBank />
        </div>

        <div className="widget-heading">
          <h3 className="widget-title">
            Savings
          </h3>

          <p className="widget-subtitle">
            Progress toward your savings target
          </p>

          {hasGoal && (
            <span className="widget-pill success">
              {progress >= 100
                ? "Goal reached"
                : "In progress"}
            </span>
          )}
        </div>
      </div>

      <div className="widget-value">
        {formatter.format(saved)}
      </div>

      {!hasGoal ? (
        <div className="widget-empty-state">
          <p>No savings goal yet</p>

          <span>
            Create a goal to start tracking progress.
          </span>
        </div>
      ) : (
        <>
          <div className="widget-progress-wrapper">
            <div className="widget-progress">
              <div
                className="savings-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="widget-progress-info">
              <span>{progress}% complete</span>

              <span>
                Goal {formatter.format(target)}
              </span>
            </div>
          </div>

          <div className="widget-metrics">
            <div className="widget-metric">
              <span className="widget-metric-label">
                Saved
              </span>

              <strong className="widget-metric-value">
                {formatter.format(saved)}
              </strong>
            </div>

            <div className="widget-metric">
              <span className="widget-metric-label">
                Remaining
              </span>

              <strong className="widget-metric-value">
                {formatter.format(remainingAmount)}
              </strong>
            </div>
          </div>
        </>
      )}

      <div className="widget-footer">
        {hasGoal
          ? `Target ${formatter.format(target)}`
          : "Ready when you create your first goal"}
      </div>
    </Card>
  );
}

export default SavingsProgress;
