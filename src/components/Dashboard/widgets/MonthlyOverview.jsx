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
  const totalExpenses = monthlyChart.reduce(
    (sum, item) => sum + Number(item.expenses || 0),
    0
  );

  const highestWeek =
    monthlyChart.length > 0
      ? monthlyChart.reduce((prev, current) =>
          prev.expenses > current.expenses
            ? prev
            : current
        )
      : null;

  const data = {
    labels: monthlyChart.map(
      (item) => item.month
    ),

    datasets: [
      {
        label: "Weekly Spending",

        data: monthlyChart.map(
          (item) =>
            Number(item.expenses) || 0
        ),

        tension: 0.42,

        cubicInterpolationMode:
          "monotone",

        fill: true,

        borderWidth: 3,

        borderColor: "#2f7cff",

        backgroundColor: (context) => {
          const chart =
            context.chart;

          const {
            ctx,
            chartArea,
          } = chart;

          if (!chartArea) {
            return "rgba(47,124,255,0.18)";
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
            "rgba(47,124,255,0.58)"
          );

          gradient.addColorStop(
            0.45,
            "rgba(37,99,235,0.22)"
          );

          gradient.addColorStop(
            1,
            "rgba(0,0,0,0)"
          );

          return gradient;
        },

        pointRadius: 4,

        pointHoverRadius: 7,

        pointBackgroundColor:
          "#ffffff",

        pointBorderColor:
          "#2f7cff",

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
      duration: 750,
      easing: "easeOutQuart",
    },

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        enabled: true,

        backgroundColor:
          "rgba(3, 7, 18, 0.96)",

        borderColor:
          "rgba(59, 130, 246, 0.55)",

        borderWidth: 1,

        titleColor: "#ffffff",

        bodyColor: "#cbd5e1",

        padding: 12,

        displayColors: false,

        callbacks: {
          label: (context) =>
            `₹${Number(
              context.raw || 0
            ).toLocaleString(
              "en-IN"
            )}`,
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
            "rgba(148,163,184,0.075)",
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
            ).toLocaleString(
              "en-IN"
            )}`,
        },
      },
    },
  };

  return (
    <div
      className={`chart-card ${
        variant === "analytics"
          ? "chart-card--analytics"
          : ""
      }`}
    >
      <div className="chart-title">
        <div>
          <h3>
            Monthly Spending Trend
          </h3>

          <p>
            Track how your expenses changed throughout the month.
          </p>
        </div>

        <span>
          {monthlyChart.length
            ? "Updated Today"
            : "No Data"}
        </span>
      </div>

      <div
        className="expenses-summary"
        style={{
          marginBottom: "18px"
        }}
      >
        <div>
          <p>Total Tracked</p>

          <h2>
            ₹
            {totalExpenses.toLocaleString(
              "en-IN"
            )}
          </h2>
        </div>

        <div
          style={{
            textAlign: "right"
          }}
        >
          <p>Highest Week</p>

          <strong>
            {highestWeek
              ? highestWeek.month
              : "--"}
          </strong>
        </div>
      </div>

      <div className="chart-height">
        {monthlyChart.length ? (
          <Line
            data={data}
            options={options}
          />
        ) : (
          <div
            className="empty-chart-state"
          >
            <h4>
              No spending trend
              available
            </h4>

            <p>
              Add expenses with
              different dates to
              generate insights.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MonthlyOverview;
