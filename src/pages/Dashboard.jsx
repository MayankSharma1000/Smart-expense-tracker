import AppShell from "@/components/layout/AppShell";
import Section from "@/components/shared/Section";

import AIInsights from "../components/Dashboard/AIInsights";
import ChartsSection from "../components/Dashboard/ChartsSection";
import DashboardHeader from "../components/Dashboard/DashboardHeader";
import QuickActions from "../components/Dashboard/QuickActions";
import RecentTransactions from "../components/Dashboard/RecentTransactions";

import BudgetProgress from "../components/Dashboard/widgets/BudgetProgress";
import InvestmentSummary from "../components/Dashboard/widgets/InvestmentSummary";
import SavingsProgress from "../components/Dashboard/widgets/SavingsProgress";

import { useAuth } from "../context/AuthContext";
import { useFinancialReport } from "../hooks/useFinancialReport";

function Dashboard() {
  const { user } = useAuth();

  const {
    dashboardData,
    budget,
    budgetStats,
    insights,
    exportPDF,
    exportExcel,
    loading,
  } = useFinancialReport();

  const currency = user?.currency || "INR";

  const handleExport = async () => {
    try {
      exportPDF();
      await exportExcel();
    } catch (error) {
      console.error(
        "Failed to export financial reports:",
        error
      );
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="dashboard-page">
          <DashboardHeader
            user={user}
            currency={currency}
          />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="dashboard-page">

        <DashboardHeader
          user={user}
          currency={currency}
          dashboardData={dashboardData}
        />

        <Section
          title="Quick Actions"
          subtitle="Everything you need, one click away."
        >
          <QuickActions
            onExport={handleExport}
            exportLoading={loading}
          />
        </Section>

        <Section
          title="Financial Overview"
          subtitle="Your core financial position at a glance."
        >
          <div className="financial-control-center">

            <BudgetProgress
              monthlyBudget={budget?.monthlyBudget || 0}
              spent={budgetStats?.spent || 0}
              remaining={budgetStats?.remaining || 0}
              percentageUsed={budgetStats?.percentageUsed || 0}
              currency={currency}
            />

            <SavingsProgress
              currentAmount={
                dashboardData?.totalSavings || 0
              }
              targetAmount={
                dashboardData?.totalSavingsTarget || 0
              }
              currency={currency}
            />

            <InvestmentSummary
              currency={currency}
              portfolioValue={
                dashboardData?.currentInvestmentValue || 0
              }
              investedAmount={
                dashboardData?.totalInvested || 0
              }
            />

          </div>
        </Section>

        <Section
          title="Financial Analytics"
          subtitle="Understand where your money is going."
        >
          <ChartsSection
            dashboardData={dashboardData}
            currency={currency}
          />
        </Section>

        <Section
          title="Activity & Intelligence"
          subtitle="Your latest activity and financial observations."
        >
          <div className="dashboard-activity-grid">

            <RecentTransactions
              transactions={
                dashboardData?.recentTransactions || []
              }
              currency={currency}
            />

            <AIInsights
              insights={insights}
            />

          </div>
        </Section>

      </div>
    </AppShell>
  );
}

export default Dashboard;
