// client/src/pages/BudgetPage.jsx
import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";

export default function BudgetPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [globalBudget, setGlobalBudget] = useState(0);
  const [globalMonth, setGlobalMonth] = useState("");
  const [savingGlobal, setSavingGlobal] = useState(false);

  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // categoryId -> budget amount
  const [categoryBudgets, setCategoryBudgets] = useState({});
  const [savingCategoryId, setSavingCategoryId] = useState(null);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [budgetRes, categoriesRes, transactionsRes, categoryBudgetsRes] =
        await Promise.all([
          api.get("/api/budget"),
          api.get("/api/categories"),
          api.get("/api/transactions"),
          api.get("/api/budget/categories"),
        ]);

      setGlobalBudget(Number(budgetRes.amount || 0));
      setGlobalMonth(budgetRes.month || "");

      setCategories(categoriesRes);
      setTransactions(transactionsRes);

      // Build map categoryId -> amount from API
      const map = {};
      if (categoryBudgetsRes && Array.isArray(categoryBudgetsRes.budgets)) {
        for (const row of categoryBudgetsRes.budgets) {
          map[row.categoryId] = Number(row.amount || 0);
        }
      }
      setCategoryBudgets(map);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load budget data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Compute this month's total spending + per-category spending from transactions
  const { totalExpenseThisMonth, categorySpending } = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return {
        totalExpenseThisMonth: 0,
        categorySpending: {},
      };
    }

    const now = new Date();
    const currentMonthStr = now.toISOString().slice(0, 7); // "YYYY-MM"
    const monthlyTxs = transactions.filter(
      (tx) => tx.date && tx.date.startsWith(currentMonthStr)
    );
    const expenseTxs = monthlyTxs.filter((tx) => tx.type === "expense");

    const categorySpending = {};
    let total = 0;

    for (const tx of expenseTxs) {
      const amount = Number(tx.amount || 0);
      total += amount;
      const catId = tx.categoryId || null;
      const key = catId ?? "uncategorized";
      categorySpending[key] = (categorySpending[key] || 0) + amount;
    }

    return {
      totalExpenseThisMonth: total,
      categorySpending,
    };
  }, [transactions]);

  async function handleSaveGlobalBudget(e) {
    e.preventDefault();
    try {
      setSavingGlobal(true);
      setError("");

      const res = await api.put("/api/budget", {
        amount: globalBudget,
        month: globalMonth || undefined,
      });

      setGlobalBudget(Number(res.amount || 0));
      setGlobalMonth(res.month || globalMonth);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save budget");
    } finally {
      setSavingGlobal(false);
    }
  }

  function handleCategoryBudgetChange(categoryId, value) {
    const numeric = Number(value || 0);
    setCategoryBudgets((prev) => ({
      ...prev,
      [categoryId]: numeric,
    }));
  }

  async function handleSaveCategoryBudget(categoryId) {
    try {
      setSavingCategoryId(categoryId);
      setError("");

      const amount = categoryBudgets[categoryId] || 0;

      const res = await api.put(`/api/budget/categories/${categoryId}`, {
        amount,
        month: globalMonth || undefined,
      });

      setCategoryBudgets((prev) => ({
        ...prev,
        [categoryId]: Number(res.amount || 0),
      }));
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save category budget");
    } finally {
      setSavingCategoryId(null);
    }
  }

  return (
    <div className="page">
      <h2>Budgets</h2>

      {error && <p className="error">{error}</p>}

      {/* Global monthly budget */}
      <section className="card">
        <h3>Monthly Budget</h3>
        {globalMonth && (
          <p className="summary-subtext">
            Current month: <strong>{globalMonth}</strong>
          </p>
        )}

        <form className="budget-form" onSubmit={handleSaveGlobalBudget}>
          <label className="budget-label">
            Budget amount
            <div className="budget-input-row">
              <span>$</span>
              <input
                type="number"
                min="0"
                value={globalBudget}
                onChange={(e) =>
                  setGlobalBudget(Number(e.target.value || 0))
                }
              />
            </div>
          </label>
          <button type="submit" className="btn" disabled={savingGlobal}>
            {savingGlobal ? "Saving..." : "Save Budget"}
          </button>
        </form>

        <p className="summary-subtext">
          This month&apos;s spending: $
          {totalExpenseThisMonth.toFixed(2)} / $
          {globalBudget.toFixed(2)}
        </p>
        <div className="budget-bar">
          <div
            className="budget-bar-fill"
            style={{
              width: `${Math.min(
                100,
                globalBudget > 0
                  ? (totalExpenseThisMonth / globalBudget) * 100
                  : 0
              )}%`,
            }}
          />
        </div>
        {globalBudget > 0 &&
          totalExpenseThisMonth > globalBudget && (
            <p className="summary-warning">
              You are over your monthly budget.
            </p>
          )}
      </section>

      {/* Category budgets */}
            {/* Category budgets */}
      <section className="card">
        <h3>Category Budgets (This Month)</h3>
        {loading ? (
          <p>Loading...</p>
        ) : categories.length === 0 ? (
          <p>No categories yet.</p>
        ) : (
          <table
            className="table"
            style={{ tableLayout: "fixed", width: "100%" }}
          >
            <colgroup>
              <col style={{ width: "25%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "20%" }} />
            </colgroup>
            <thead>
              <tr>
                <th>Category</th>
                <th>Budget</th>
                <th>Spent</th>
                <th>Used</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => {
                const catId = cat.id;
                const budgetAmount = categoryBudgets[catId] || 0;

                const spent =
                  categorySpending[catId] ||
                  categorySpending[String(catId)] ||
                  0;

                const usedPercent =
                  budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0;

                return (
                  <tr key={catId}>
                    <td>{cat.name}</td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <span>$</span>
                        <input
                          type="number"
                          min="0"
                          value={budgetAmount}
                          onChange={(e) =>
                            handleCategoryBudgetChange(catId, e.target.value)
                          }
                          style={{
                            width: "100%",
                            maxWidth: "90px",
                            padding: "4px 6px",
                            borderRadius: "6px",
                            border: "1px solid #d1d5db",
                          }}
                        />
                      </div>
                    </td>
                    <td>${spent.toFixed(2)}</td>
                    <td>
                      {budgetAmount > 0 ? (
                        <span>{usedPercent.toFixed(1)}%</span>
                      ) : (
                        <span className="summary-subtext">No budget</span>
                      )}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn small"
                        onClick={() => handleSaveCategoryBudget(catId)}
                        disabled={savingCategoryId === catId}
                        style={{ minWidth: "80px" }}
                      >
                        {savingCategoryId === catId ? "Saving..." : "Save"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {!loading && categories.length > 0 && (
          <p className="summary-subtext" style={{ marginTop: "0.5rem" }}>
            Tip: Set a small budget for categories you want to control
            (like Food or Shopping), then track the % used.
          </p>
        )}
      </section>

    </div>
  );
}
