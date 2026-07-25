function AnalyticsHeader({ period }) {
  const currentDate =
    new Date().toLocaleDateString(
      undefined,
      {
        month: "long",
        year: "numeric",
      }
    );

  const selectedPeriod =
    period?.month && period?.year
      ? `${period.month} ${period.year}`
      : currentDate;

  return (
    <header className="analytics-page-header">
      <div>
        <h1>Financial Analytics</h1>

        <p>
          Understand your spending, savings,
          investments and overall financial health.
        </p>
      </div>

      <div className="analytics-period-chip">
        <span>Current Period</span>
        <strong>{selectedPeriod}</strong>
      </div>
    </header>
  );
}

export default AnalyticsHeader;
