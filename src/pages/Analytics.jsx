import "../components/Analytics/Analytics.css";

import AppShell from "../components/layout/AppShell";
import DashboardSkeleton from "../components/Dashboard/DashboardSkeleton";

import { useAuth } from "../context/AuthContext";
import { useDashboard } from "../hooks/useDashboard";

import ActivityTimeline from "../components/Analytics/ActivityTimeline.jsx";
import AIFinancialCoach from "../components/Analytics/AIFinancialCoach.jsx";
import AnalyticsFooter from "../components/Analytics/AnalyticsFooter.jsx";
import AnalyticsHeader from "../components/Analytics/AnalyticsHeader.jsx";
import FinancialHealth from "../components/Analytics/FinancialHealth.jsx";
import InvestmentOverview from "../components/Analytics/InvestmentOverview.jsx";
import SavingsGoals from "../components/Analytics/SavingsGoals.jsx";
import SpendingOverview from "../components/Analytics/SpendingOverview.jsx";

function Analytics() {
  const { user } = useAuth();

  const {
    dashboardData,
    loading,
  } = useDashboard();

  const currency =
    user?.currency ||
    dashboardData?.user?.currency ||
    "INR";

  const totalSavings =
    Number(dashboardData?.totalSavings) || 0;

  const totalSavingsTarget =
    Number(
      dashboardData?.totalSavingsTarget
    ) || 0;

  const currentInvestmentValue =
    Number(
      dashboardData?.currentInvestmentValue
    ) || 0;

  const investmentProfit =
    Number(
      dashboardData?.investmentProfit
    ) || 0;

  if (loading) {
    return (
      <AppShell>
        <DashboardSkeleton />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <main className="analytics-page">
        <AnalyticsHeader
          period={dashboardData?.period}
        />

        <AIFinancialCoach
          user={user}
          dashboardData={dashboardData}
        />

        <section className="analytics-primary-grid">
          <FinancialHealth
            dashboardData={dashboardData}
          />

          <SpendingOverview
            dashboardData={dashboardData}
            currency={currency}
          />
        </section>

        <section className="analytics-secondary-grid">
          <SavingsGoals
            totalSavings={totalSavings}
            totalSavingsTarget={
              totalSavingsTarget
            }
            currency={currency}
          />

          <InvestmentOverview
            totalSavings={totalSavings}
            currentInvestmentValue={
              currentInvestmentValue
            }
            investmentProfit={
              investmentProfit
            }
            currency={currency}
          />
        </section>

        <ActivityTimeline
          activities={
            dashboardData?.recentTransactions ||
            []
          }
          currency={currency}
        />

        <AnalyticsFooter user={user} />
      </main>
    </AppShell>
  );
}

export default Analytics;
