import React from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

import { Line } from "react-chartjs-2";

import {
  FaArrowTrendUp,
  FaChartLine
} from "react-icons/fa6";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

function MonthlyOverview({
  monthlyChart = [],
  variant = "default",
}) {
  const normalizedChart = monthlyChart.map(
    (item) => ({
      ...item,
      expenses: Number(item.expenses) || 0,
    })
  );

  const totalExpenses = normalizedChart.reduce(
    (sum, item) => sum + item.expenses,
    0
  );

  const hasSpending = totalExpenses > 0;

  const highestWeek = hasSpending
    ? normalizedChart.reduce(
        (highest, current) =>
          current.expenses > highest.expenses
            ? current
            : highest
      )
    : null;

  const averageSpend =
    hasSpending && normalizedChart.length
      ? Math.round(
          totalExpenses /
            normalizedChart.length
        )
      : 0;

  const data = {
    labels: normalizedChart.map(
      (item) => item.month
    ),

    datasets: [
      {
        label: "Weekly Spending",

        data: normalizedChart.map(
          (item) => item.expenses
        ),

        tension: 0.42,

        cubicInterpolationMode:
          "monotone",

        fill: true,

        borderWidth: 2.5,

        borderColor: "#3b82f6",

        backgroundColor: (context) => {
          const chart = context.chart;

          const {
            ctx,
            chartArea,
          } = chart;

          if (!chartArea) {
            return "rgba(59,130,246,.16)";
          }

          const gradient =
            ctx.createLinearGradient(
              0,
              chartArea.top,
              0,
              chartArea.bottom
            );

          gradient.addColorStop(
            0,
            "rgba(59,130,246,.34)"
          );

          gradient.addColorStop(
            0.5,
            "rgba(37,99,235,.11)"
          );

          gradient.addColorStop(
            1,
            "rgba(37,99,235,0)"
          );

          return gradient;
        },

        pointRadius: 3,

        pointHoverRadius: 6,

        pointBackgroundColor:
          "#dbeafe",

        pointBorderColor:
          "#3b82f6",

        pointBorderWidth: 2,

        pointHoverBackgroundColor:
          "#ffffff",

        pointHoverBorderColor:
          "#60a5fa",

        pointHoverBorderWidth: 3,
      }
    ]
  };

  const options = {
    responsive: true,

    maintainAspectRatio: false,

    interaction: {
      intersect: false,
      mode: "index",
    },

    animation: {
      duration: 700,
      easing: "easeOutQuart",
    },

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        enabled: true,

        backgroundColor:
          "rgba(3,7,18,.97)",

        borderColor:
          "rgba(59,130,246,.4)",

        borderWidth: 1,

        titleColor: "#ffffff",

        bodyColor: "#cbd5e1",

        padding: 12,

        displayColors: false,

        callbacks: {
          label: (context) =>
            `₹${Number(
              context.raw || 0
            ).toLocaleString("en-IN")}`,
        },
      },
    },

    scales: {
      x: {
        border: {
          display: false,
        },

        grid: {
          display: false,
        },

        ticks: {
          color: "#64748b",

          font: {
            size: 10,
            weight: "600",
          },
        },
      },

      y: {
        beginAtZero: true,

        border: {
          display: false,
        },

        grid: {
          color:
            "rgba(148,163,184,.07)",
        },

        ticks: {
          color: "#64748b",

          font: {
            size: 10,
            weight: "600",
          },

          callback: (value) =>
            `₹${Number(
              value
            ).toLocaleString("en-IN")}`,
        },
      },
    },
  };

  return (
    <div
      className={`chart-card spending-trend-card ${
        variant === "analytics"
          ? "chart-card--analytics"
          : ""
      }`}
    >
      <div className="chart-title">
        <div>
          <span className="chart-eyebrow">
            SPENDING ANALYSIS
          </span>

          <h3>
            Monthly Spending Trend
          </h3>

          <p>
            Track how your expenses move
            throughout the month.
          </p>
        </div>

        <span
          className={`chart-status ${
            hasSpending
              ? "chart-status--live"
              : ""
          }`}
        >
          <span className="chart-status-dot" />

          {hasSpending
            ? "Live data"
            : "Waiting for data"}
        </span>
      </div>

      <div className="expenses-summary">
        <div className="summary-primary">
          <p>Total tracked</p>

          <h2>
            ₹
            {totalExpenses.toLocaleString(
              "en-IN"
            )}
          </h2>
        </div>

        <div className="summary-stat">
          <p>Highest week</p>

          <strong>
            {highestWeek
              ? highestWeek.month
              : "—"}
          </strong>
        </div>

        <div className="summary-stat">
          <p>Weekly average</p>

          <strong>
            {hasSpending
              ? `₹${averageSpend.toLocaleString(
                  "en-IN"
                )}`
              : "—"}
          </strong>
        </div>
      </div>

      <div className="chart-height">
        {hasSpending ? (
          <Line
            data={data}
            options={options}
          />
        ) : (
          <div className="analytics-empty-state">
            <div className="analytics-empty-visual">
              <div className="analytics-empty-glow" />

              <div className="analytics-empty-icon">
                <FaChartLine />
              </div>

              <div className="analytics-preview-chart">
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>

            <div className="analytics-empty-copy">
              <h4>
                Your spending story starts here
              </h4>

              <p>
                Record your first expense and
                SmartMoney will build your weekly
                spending trend automatically.
              </p>
            </div>

            <div className="analytics-empty-hint">
              <FaArrowTrendUp />

              <span>
                Trends become more useful as
                you add transactions
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MonthlyOverview;
