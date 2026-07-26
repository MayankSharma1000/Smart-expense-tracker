import { useEffect, useState } from "react";
import { getBudget } from "../services/budgetService";

export const useBudget = () => {
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const response = await getBudget();

        if (response?.data) {
          setBudget(response.data);
        } else {
          setBudget(null);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBudget();
  }, []);

  return {
    budget,
    loading,
    setBudget
  };
};