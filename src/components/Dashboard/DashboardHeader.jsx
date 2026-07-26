import { fadeUp } from "@/utils/animations";
import { motion } from "framer-motion";
import "./DashboardHeader.css";

import {
  FaArrowTrendDown,
  FaChartLine,
  FaChartPie,
  FaCoins,
  FaPiggyBank,
  FaWallet,
} from "react-icons/fa6";

function DashboardHeader({
  user,
  dashboardData,
  currency = "INR",
}) {
  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 17) {
    greeting = "Good Afternoon";
  }

  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });

  const firstName =
    user?.name?.trim()?.split(/\s+/)[0] ||
    user?.email?.split("@")[0] ||
    "there";

  const totalExpenses =
    Number(dashboardData?.totalExpenses) || 0;

  const totalSavings =
    Number(dashboardData?.totalSavings) || 0;

  const investmentValue =
    Number(dashboardData?.currentInvestmentValue) || 0;

  const netWorth =
    totalSavings + investmentValue;

  const statusMessage =
    totalSavings + investmentValue > 0
      ? "Your financial overview is ready."
      : "Start building your financial picture.";

  const metrics = [
    {
      label: "Expenses",
      value: totalExpenses,
      icon: FaArrowTrendDown,
      className: "expense",
    },
    {
      label: "Savings",
      value: totalSavings,
      icon: FaPiggyBank,
      className: "savings",
    },
    {
      label: "Investments",
      value: investmentValue,
      icon: FaCoins,
      className: "investment",
    },
    {
      label: "Net Worth",
      value: netWorth,
      icon: FaChartPie,
      className: "worth",
    },
  ];

  return (
    <motion.section
      className="dashboard-hero"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
    >
      <div className="hero-content">
        <div className="hero-left">
          <span className="hero-eyebrow">
            FINANCIAL OVERVIEW
          </span>

          <h1>
            {greeting},{" "}
            <span>{firstName}</span>
          </h1>

          <p>{statusMessage}</p>
        </div>

        <motion.div
          className="wallet-card"
          whileHover={{ y: -3 }}
          transition={{
            duration: 0.2,
            ease: "easeOut",
          }}
        >
          <div className="wallet-card-header">
            <div className="wallet-top">
              <div className="wallet-icon">
                <FaWallet />
              </div>

              <div className="wallet-heading">
                <span>Net Worth</span>
                <small>Current position</small>
              </div>
            </div>

            <div className="wallet-status">
              <span />
              Live
            </div>
          </div>

          <div className="wallet-value">
            {formatter.format(netWorth)}
          </div>

          <div className="wallet-footer">
            <span>
              Savings + Investments
            </span>

            <div className="wallet-growth">
              <FaChartLine />
              <span>Auto updated</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="hero-kpis">
        {metrics.map(
          ({
            label,
            value,
            icon: Icon,
            className,
          }) => (
            <div
              className={`hero-kpi ${className}`}
              key={label}
            >
              <div className="kpi-top">
                <div className="kpi-label">
                  <span className="kpi-icon">
                    <Icon />
                  </span>

                  <span>{label}</span>
                </div>
              </div>

              <h3>
                {formatter.format(value)}
              </h3>
            </div>
          )
        )}
      </div>
    </motion.section>
  );
}

export default DashboardHeader;
