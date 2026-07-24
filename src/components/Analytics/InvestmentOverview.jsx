import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function InvestmentOverview({
  totalSavings = 0,
  currentInvestmentValue = 0,
  investmentProfit = 0,
  currency = "INR",
}) {
  const savings =
    Number(totalSavings) || 0;

  const investmentValue =
    Number(currentInvestmentValue) || 0;

  const profit =
    Number(investmentProfit) || 0;

  const netWorth =
    savings + investmentValue;

  const investedCapital =
    investmentValue - profit;

  const roi =
    investedCapital > 0
      ? (profit / investedCapital) * 100
      : 0;

  const formatter =
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    });

  const hasFinancialData =
    savings > 0 ||
    investmentValue > 0;

  const chartData = [
    savings,
    investmentValue,
  ];

  const hasChartData =
    chartData.some(
      (value) => value > 0
    );

  return (
    <section className="analytics-card investment-overview-card">

      <div className="investment-header">
        <div>
          <h2>
            Investment Portfolio
          </h2>

          <p>
            Portfolio performance and
            financial asset overview
          </p>
        </div>
      </div>

      <div className="portfolio-grid">

        <div className="portfolio-stat">
          <p>Portfolio Value</p>

          <h2>
            {formatter.format(
              investmentValue
            )}
          </h2>
        </div>

        <div className="portfolio-stat">
          <p>Profit / Loss</p>

          <h2>
            {profit > 0 ? "+" : ""}

            {formatter.format(
              profit
            )}
          </h2>
        </div>

        <div className="portfolio-stat">
          <p>ROI</p>

          <h2>
            {roi.toFixed(2)}%
          </h2>
        </div>

      </div>

      {!hasFinancialData ? (

        <div className="analytics-empty-state">

          <h3>
            No portfolio data yet
          </h3>

          <p>
            Add investments or savings
            to start building your
            financial overview.
          </p>

        </div>

      ) : (

        <div className="networth-card">

          <div className="networth-left">

            <h3>
              Financial Assets
            </h3>

            <h1>
              {formatter.format(
                netWorth
              )}
            </h1>

            <div className="asset-row">

              <span>
                Savings
              </span>

              <strong>
                {formatter.format(
                  savings
                )}
              </strong>

            </div>

            <div className="asset-row">

              <span>
                Investments
              </span>

              <strong>
                {formatter.format(
                  investmentValue
                )}
              </strong>

            </div>

          </div>

          {hasChartData && (

            <div
              className="portfolio-chart"
              style={{
                width: "260px",
                height: "260px",
              }}
            >

              <Doughnut
                data={{
                  labels: [
                    "Savings",
                    "Investments",
                  ],

                  datasets: [
                    {
                      data:
                        chartData,

                      backgroundColor: [
                        "#22c55e",
                        "#3b82f6",
                      ],

                      borderWidth: 0,
                    },
                  ],
                }}

                options={{
                  responsive: true,

                  maintainAspectRatio:
                    false,

                  cutout: "72%",

                  plugins: {
                    legend: {
                      position:
                        "bottom",
                    },
                  },
                }}
              />

            </div>

          )}

        </div>

      )}

    </section>
  );
}

export default InvestmentOverview;
