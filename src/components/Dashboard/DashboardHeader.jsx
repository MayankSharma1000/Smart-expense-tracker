import { fadeUp } from "@/utils/animations";
import { motion } from "framer-motion";
import "./DashboardHeader.css";

import {
  FaChartLine,
  FaWallet,
  FaArrowTrendDown,
  FaPiggyBank,
  FaCoins,
  FaChartPie,
} from "react-icons/fa6";

function DashboardHeader({
  user,
  dashboardData,
  currency = "INR",
}) {
  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) greeting = "Good Morning";
  else if (hour < 17) greeting = "Good Afternoon";

  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });

  const name =
    user?.name?.trim()?.split(" ")[0] ||
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
    totalSavings >= totalExpenses
      ? "Your financial system is healthy."
      : "Keep an eye on this month's spending.";

  return (
    <motion.section
      className="dashboard-hero"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
    >
      <div className="hero-content">

        <div className="hero-left">

          <h1>
            {greeting},{" "}
            <span>{name}</span>
          </h1>

          <p>
            {statusMessage}
          </p>

        </div>

        <motion.div
          className="wallet-card"
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
        >
          <div className="wallet-top">

            <div className="wallet-icon">
              <FaWallet />
            </div>

            <span>
              Net Worth
            </span>

          </div>

          <h2>
            {formatter.format(netWorth)}
          </h2>

          <p>
            Savings + Investments
          </p>

          <div className="wallet-growth">

            <FaChartLine />

            <span>
              Updated automatically
            </span>

          </div>

        </motion.div>

      </div>

      <div className="hero-kpis">

        <div className="hero-kpi expense">
          <div className="kpi-label">
            <FaArrowTrendDown />
            <span>Expenses</span>
          </div>

          <h3>
            {formatter.format(totalExpenses)}
          </h3>
        </div>

        <div className="hero-kpi savings">
          <div className="kpi-label">
            <FaPiggyBank />
            <span>Savings</span>
          </div>

          <h3>
            {formatter.format(totalSavings)}
          </h3>
        </div>

        <div className="hero-kpi investment">
          <div className="kpi-label">
            <FaCoins />
            <span>Investments</span>
          </div>

          <h3>
            {formatter.format(investmentValue)}
          </h3>
        </div>

        <div className="hero-kpi worth">
          <div className="kpi-label">
            <FaChartPie />
            <span>Net Worth</span>
          </div>

          <h3>
            {formatter.format(netWorth)}
          </h3>
        </div>

      </div>
    </motion.section>
  );
}

export default DashboardHeader;
