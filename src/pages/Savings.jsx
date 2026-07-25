import React, { useEffect, useState } from "react";

import AppShell from "../components/layout/AppShell/AppShell";
import SavingsGoalForm from "../components/Savings/SavingsGoalForm";
import SavingsGoalsList from "../components/Savings/SavingsGoalsList";
import SavingsHero from "../components/Savings/SavingsHero";
import SavingsSummary from "../components/Savings/SavingsSummary";
import "../styles/savings.css";

import {
  createSavingsGoal,
  deleteSavingsGoal,
  getSavingsGoals,
  updateSavingsGoal
} from "../services/savingsService.js";

function Savings() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    targetAmount: "",
    currentAmount: "",
    category: "Emergency Fund",
    targetDate: "",
    notes: ""
  });

  const currentMonth = new Date().toLocaleString("default", {
    month: "long",
    year: "numeric"
  });

  const loadGoals = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getSavingsGoals();
      setGoals(
        response.data?.goals || []
      );

    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load savings goals."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const totalSaved = React.useMemo(() => {
    return goals.reduce(
      (sum, goal) => sum + Number(goal.currentAmount || 0),
      0
    );
  }, [goals]);

  const averageProgress = React.useMemo(() => {

    if (goals.length === 0) return 0;

    const total = goals.reduce((sum, goal) => {

      const target = Number(goal.targetAmount || 0);

      const current = Number(goal.currentAmount || 0);

      if (!target) return sum;

      return sum + (current / target) * 100;

    }, 0);

    return Math.round(total / goals.length);

  }, [goals]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSaveGoal = async (e) => {

    e.preventDefault();

    try {

      setError("");

      if (editingId) {

        const response =
          await updateSavingsGoal(
            editingId,
            formData
          );

        setGoals((prev) =>
          prev.map((goal) =>
            goal._id === editingId
              ? response.data
              : goal
          )
        );

        setEditingId(null);

      } else {

        const response =
          await createSavingsGoal(
            formData
          );

        setGoals((prev) => [
          response.data,
          ...prev,
        ]);

      }

      setFormData({
        title: "",
        targetAmount: "",
        currentAmount: "",
        targetDate: "",
        category: "",
        notes: "",
      });

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Failed to save goal."
      );

    }

  };

  const [editingId, setEditingId] = useState(null);

  const handleEdit = (goal) => {

    setEditingId(goal._id);

    setFormData({
      title: goal.title || "",
      targetAmount: goal.targetAmount || "",
      currentAmount: goal.currentAmount || "",
      targetDate: goal.targetDate
        ? goal.targetDate.substring(0, 10)
        : "",
      category: goal.category || "",
      notes: goal.notes || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this savings goal?"
    );

    if (!confirmed) return;
    try {
      setError("");

      await deleteSavingsGoal(id);

      setGoals((prev) => prev.filter((goal) => goal._id !== id));
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to delete savings goal."
      );
    }
  };

  return (
    <AppShell>
        <SavingsHero />
          <SavingsSummary
              totalSaved={totalSaved}
              goals={goals.length}
              averageProgress={averageProgress}
          />

        {error && <div className="auth-error">{error}</div>}

        <section className="savings-page">
          <SavingsGoalForm
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSaveGoal}
              submitLoading={loading}
              isEditing={Boolean(editingId)}
          />

          <section className="goals-section">
            <div className="section-heading">
              <div>
                <h2>Your Savings Goals</h2>
                <p>
                  Monitor progress across every financial goal.
                </p>
              </div>

              <div className="goal-count">
                {goals.length} Goal{goals.length !== 1 ? "s" : ""}
              </div>

            </div>
            {loading ? (
              <div className="loading-state">
                Loading savings goals...
              </div>
            ) : (
              <SavingsGoalsList
                  goals={goals}
                  handleDelete={handleDelete}
                  handleEdit={handleEdit}
              />
            )}
          </section>
        </section>
      </AppShell>
  );
}

export default Savings;
