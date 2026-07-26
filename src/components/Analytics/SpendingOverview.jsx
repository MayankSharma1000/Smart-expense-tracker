import MonthlyOverview from "../Dashboard/widgets/MonthlyOverview";

function SpendingOverview({
  dashboardData,
  currency = "INR"
}) {
  const totalSpent =
    Number(dashboardData?.totalExpenses) || 0;

  const avgWeekly =
    Math.round(totalSpent / 4);

  const categories = (
    dashboardData?.categoryChart || []
  )
    .map((item) => ({
      name:
        item?.name ||
        item?.category ||
        "Other",
      value:
        Number(
          item?.value ??
          item?.amount
        ) || 0,
    }))
    .filter(
      (item) => item.value > 0
    );

  const formatter =
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0
    });

  const topCategory =
    categories.length > 0
      ? [...categories].sort(
          (a, b) =>
            Number(b.value || 0) -
            Number(a.value || 0)
        )[0]
      : null;

  return (
    <div className="glass-card analytics-card spending-card">
      <div className="card-header">
        <div>
          <h2>Monthly Spending</h2>

          <p className="section-subtitle">
            Spending Overview
          </p>
        </div>

        <span className="health-badge">
          This Month
        </span>
      </div>

      <div className="spending-kpi">
        <div>
          <h1>
            {formatter.format(totalSpent)}
          </h1>

          <p>Total Expenses</p>
        </div>

        <div className="kpi-growth">
          {topCategory
            ? `Top: ${topCategory.name}`
            : "No spending data"}
        </div>
      </div>

      <div className="chart-container">
        <MonthlyOverview
          monthlyChart={
            dashboardData?.monthlyChart || []
          }
          currency={currency}
              variant="analytics"
    />
      </div>

      <div className="quick-stats">
        <div>
          <p>Weekly Avg</p>

          <h3>
            {formatter.format(avgWeekly)}
          </h3>
        </div>

        <div>
          <p>Transactions</p>

          <h3>
            {dashboardData?.expenseCount || 0}
          </h3>
        </div>

        <div>
          <p>Categories</p>

          <h3>
            {categories.length}
          </h3>
        </div>
      </div>


    </div>
  );
}

export default SpendingOverview;
