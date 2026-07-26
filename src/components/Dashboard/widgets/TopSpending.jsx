import React from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import {
  FaChartPie,
  FaLayerGroup
} from "react-icons/fa6";

const COLORS = [
  "#3B82F6",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4"
];

function TopSpending({
  categoryChart = []
}) {
  const normalizedCategories =
    categoryChart
      .map((item) => ({
        ...item,
        amount:
          Number(item.amount) || 0,
      }))
      .filter(
        (item) => item.amount > 0
      );

  const totalExpenses =
    normalizedCategories.reduce(
      (sum, item) =>
        sum + item.amount,
      0
    );

  const hasSpending =
    totalExpenses > 0;

  const topCategory = hasSpending
    ? normalizedCategories.reduce(
        (highest, current) =>
          current.amount >
          highest.amount
            ? current
            : highest
      )
    : null;

  return (
    <div className="chart-card top-spending-card">

      <div className="chart-title">
        <div>
          <span className="chart-eyebrow">
            CATEGORIES
          </span>

          <h3>
            Top Spending
          </h3>

          <p>
            See which categories consume
            the most money.
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
            ? `${normalizedCategories.length} categories`
            : "No activity"}
        </span>
      </div>

      {!hasSpending ? (

        <div className="category-empty-state">

          <div className="category-empty-visual">

            <div className="empty-donut">
              <div className="empty-donut-inner">
                <FaChartPie />
              </div>
            </div>

          </div>

          <div className="category-empty-copy">

            <h4>
              No category spending yet
            </h4>

            <p>
              Once you add expenses, your
              spending mix will appear here
              automatically.
            </p>

          </div>

          <div className="category-preview">

            <div>
              <span className="preview-dot blue" />
              <span>Food</span>
            </div>

            <div>
              <span className="preview-dot green" />
              <span>Travel</span>
            </div>

            <div>
              <span className="preview-dot purple" />
              <span>Shopping</span>
            </div>

          </div>

          <div className="category-empty-footer">
            <FaLayerGroup />

            Categories are generated from
            your recorded expenses
          </div>

        </div>

      ) : (

        <>
          <div className="donut-area">

            <ResponsiveContainer>
              <PieChart>

                <Pie
                  data={
                    normalizedCategories
                  }
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={61}
                  outerRadius={84}
                  paddingAngle={3}
                  cornerRadius={6}
                  stroke="none"
                >
                  {normalizedCategories.map(
                    (_, index) => (
                      <Cell
                        key={index}
                        fill={
                          COLORS[
                            index %
                              COLORS.length
                          ]
                        }
                      />
                    )
                  )}
                </Pie>

                <Tooltip
                  content={() => null}
                  cursor={false}
                />

              </PieChart>
            </ResponsiveContainer>

            <div className="donut-center">

              <span>Total</span>

              <strong>
                ₹
                {totalExpenses.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

          </div>

          <div className="top-category-summary">

            <span>
              Top category
            </span>

            <strong>
              {topCategory?.category}
            </strong>

            <small>
              {(
                (topCategory.amount /
                  totalExpenses) *
                100
              ).toFixed(1)}
              % of spending
            </small>

          </div>

          <div className="category-legend">

            {normalizedCategories.map(
              (item, index) => {

                const percentage = (
                  (item.amount /
                    totalExpenses) *
                  100
                ).toFixed(1);

                return (
                  <div
                    key={item.category}
                    className="legend-item"
                  >
                    <div
                      className="legend-color"
                      style={{
                        background:
                          COLORS[
                            index %
                              COLORS.length
                          ]
                      }}
                    />

                    <span>
                      {item.category}
                    </span>

                    <strong>
                      ₹
                      {item.amount.toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                    <small>
                      {percentage}%
                    </small>
                  </div>
                );
              }
            )}

          </div>
        </>

      )}

    </div>
  );
}

export default TopSpending;
