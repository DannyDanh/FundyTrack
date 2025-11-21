// client/src/pages/DashboardPage.jsx
import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from "recharts";

const LOW_SPEND_THRESHOLD = 20; // $20/day challenge

export default function DashboardPage() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budget, setBudget] = useState(0);
  const [budgetMonth, setBudgetMonth] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [txs, cats, budgetRes] = await Promise.all([
        api.get("/api/transactions"),
        api.get("/api/categories"),
        api.get("/api/budget"),
      ]);

      setTransactions(txs || []);
      setCategories(cats || []);
      setBudget(Number(budgetRes?.amount || 0));
      setBudgetMonth(budgetRes?.month || "");
    } catch (err) {
      console.error("Dashboard load error:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleRefresh() {
    try {
      setRefreshing(true);
      await loadData();
    } finally {
      setRefreshing(false);
    }
  }

  const {
    totalExpense,
    totalIncome,
    net,
    categoryExpenses,
    expenseUsedPercent,
    lastFive,
    dailySpending,
    noSpendDays,
    bestNoSpendStreak,
    currentNoSpendStreak,
    lowSpendDaysCount,
  } = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return {
        totalExpense: 0,
        totalIncome: 0,
        net: 0,
        categoryExpenses: [],
        expenseUsedPercent: 0,
        lastFive: [],
        dailySpending: [],
        noSpendDays: 0,
        bestNoSpendStreak: 0,
        currentNoSpendStreak: 0,
        lowSpendDaysCount: 0,
      };
    }

    const now = new Date();
    const currentMonthStr = now.toISOString().slice(0, 7); // "YYYY-MM"
    const year = now.getFullYear();
    const monthIndex = now.getMonth(); // 0–11
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    // 🔎 IMPORTANT: we only include transactions in the current month
    const monthlyTxs = transactions.filter(
      (tx) => tx.date && tx.date.startsWith(currentMonthStr)
    );

    const expenseTxs = monthlyTxs.filter((tx) => tx.type === "expense");
    const incomeTxs = monthlyTxs.filter((tx) => tx.type === "income");

    const totalExpense = expenseTxs.reduce(
      (sum, tx) => sum + Number(tx.amount || 0),
      0
    );
    const totalIncome = incomeTxs.reduce(
      (sum, tx) => sum + Number(tx.amount || 0),
      0
    );
    const net = totalIncome - totalExpense;

    // Group expenses by category
    const categoryMap = new Map();
    for (const tx of expenseTxs) {
      const catKey = tx.categoryId ?? "uncategorized";
      const prev = categoryMap.get(catKey) || 0;
      categoryMap.set(catKey, prev + Number(tx.amount || 0));
    }

    const categoryExpenses = Array.from(categoryMap.entries()).map(
      ([key, total]) => {
        const cat =
          key === "uncategorized"
            ? null
            : categories.find((c) => Number(c.id) === Number(key));
        return {
          categoryId: key === "uncategorized" ? null : Number(key),
          name: cat ? cat.name : "Uncategorized",
          total,
        };
      }
    );

    const expenseUsedPercent =
      budget && budget > 0 ? (totalExpense / budget) * 100 : 0;

    // Last 5 overall (all months) for Recent section
    const sorted = [...transactions].sort((a, b) => {
      const aKey = (a.date || "") + "-" + a.id;
      const bKey = (b.date || "") + "-" + b.id;
      return aKey < bKey ? 1 : -1;
    });
    const lastFive = sorted.slice(0, 5);

    // DAILY SPENDING for current month
    const totalsByDay = Array(daysInMonth + 1).fill(0); // index 1..daysInMonth

    for (const tx of expenseTxs) {
      if (!tx.date) continue;
      const dayNum = Number(tx.date.slice(8, 10));
      if (!Number.isNaN(dayNum) && dayNum >= 1 && dayNum <= daysInMonth) {
        totalsByDay[dayNum] += Number(tx.amount || 0);
      }
    }

    const dailySpending = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const total = totalsByDay[d];
      if (total > 0) {
        dailySpending.push({
          day: d,
          label: `${monthIndex + 1}/${d}`,
          total,
        });
      }
    }

    // CHALLENGES
    const todayDay = now.getDate();
    let noSpendDays = 0;
    let bestNoSpendStreak = 0;
    let currentNoSpendStreak = 0;
    let streak = 0;
    let lowSpendDaysCount = 0;

    for (let d = 1; d <= todayDay; d++) {
      const total = totalsByDay[d];

      if (total === 0) {
        noSpendDays += 1;
        streak += 1;
        if (streak > bestNoSpendStreak) bestNoSpendStreak = streak;
      } else {
        if (total <= LOW_SPEND_THRESHOLD) {
          lowSpendDaysCount += 1;
        }
        streak = 0;
      }
    }

    currentNoSpendStreak = streak;

    return {
      totalExpense,
      totalIncome,
      net,
      categoryExpenses,
      expenseUsedPercent,
      lastFive,
      dailySpending,
      noSpendDays,
      bestNoSpendStreak,
      currentNoSpendStreak,
      lowSpendDaysCount,
    };
  }, [transactions, categories, budget]);

  return (
    <div className="page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
        <h2>Dashboard</h2>
        <button className="btn small" onClick={handleRefresh} disabled={refreshing || loading}>
          {refreshing || loading ? "Refreshing..." : "Refresh data"}
        </button>
      </div>

      {budgetMonth && (
        <p className="summary-subtext" style={{ marginTop: "-0.4rem" }}>
          Current month: <strong>{budgetMonth}</strong>
        </p>
      )}

      {error && <p className="error">{error}</p>}

      {/* SUMMARY + CHARTS */}
      <section className="card">
        <h3>This Month Overview</h3>
        <div className="dashboard-row">
          {/* LEFT: SUMMARY + BUDGET */}
          <div className="dashboard-col summary-col">
            <div className="summary-grid">
              <div className="summary-card">
                <h4>Total Spending</h4>
                <p className="summary-number expense">
                  ${totalExpense.toFixed(2)}
                </p>
              </div>
              <div className="summary-card">
                <h4>Total Income</h4>
                <p className="summary-number income">
                  ${totalIncome.toFixed(2)}
                </p>
              </div>
              <div className="summary-card">
                <h4>Net</h4>
                <p
                  className={`summary-number ${
                    net >= 0 ? "income" : "expense"
                  }`}
                >
                  ${net.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="budget-panel">
              <h4>Monthly Budget</h4>
              <div className="budget-input-row">
                <span>$</span>
                <input
                  type="number"
                  min="0"
                  value={budget}
                  onChange={(e) =>
                    setBudget(Number(e.target.value || 0))
                  }
                />
              </div>
              <p className="summary-subtext">
                Spent: ${totalExpense.toFixed(2)} / ${budget.toFixed(2)} (
                {expenseUsedPercent.toFixed(1)}%)
              </p>
              <div className="budget-bar">
                <div
                  className="budget-bar-fill"
                  style={{
                    width: `${Math.min(expenseUsedPercent, 100)}%`,
                  }}
                />
              </div>
              {expenseUsedPercent > 100 && (
                <p className="summary-warning">
                  You are over budget this month.
                </p>
              )}
            </div>
          </div>

          {/* RIGHT: CHARTS */}
          <div className="dashboard-col chart-col">
            {/* Category chart */}
            <div className="chart-subcard">
              <h4 className="chart-title">
                Spending by Category (This Month)
              </h4>
              {loading ? (
                <p>Loading...</p>
              ) : categoryExpenses.length === 0 ? (
                <p>No expenses yet this month.</p>
              ) : (
                <div style={{ width: "100%", height: 200 }}>
                  <ResponsiveContainer>
                    <BarChart data={categoryExpenses}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        tickFormatter={(name) =>
                          name.length > 10 ? name.slice(0, 9) + "…" : name
                        }
                      />
                      <YAxis />
                      <Tooltip
                        formatter={(value) =>
                          `$${Number(value).toFixed(2)}`
                        }
                      />
                      <Bar
                        dataKey="total"
                        fill="#3b82f6"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Daily spending chart */}
            <div className="chart-subcard">
              <h4 className="chart-title">
                Spending Per Day (This Month)
              </h4>
              {loading ? (
                <p>Loading...</p>
              ) : dailySpending.length === 0 ? (
                <p>No spending yet this month.</p>
              ) : (
                <div style={{ width: "100%", height: 200 }}>
                  <ResponsiveContainer>
                    <LineChart data={dailySpending}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) =>
                          `$${Number(value).toFixed(2)}`
                        }
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="total"
                        name="Daily Spending"
                        stroke="#22c55e"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FUN CHALLENGES */}
      <section className="card">
        <h3>Fun Challenges 🎯</h3>
        <ul className="challenge-list">
          <li>
            <span className="challenge-title">No-Spend Days</span>
            <span className="challenge-value">
              {noSpendDays} day{noSpendDays === 1 ? "" : "s"} this month
            </span>
            <span className="challenge-desc">
              Days where you spent <strong>$0</strong>. Great for resets.
            </span>
          </li>
          <li>
            <span className="challenge-title">Best No-Spend Streak</span>
            <span className="challenge-value">
              {bestNoSpendStreak} day
              {bestNoSpendStreak === 1 ? "" : "s"} in a row
            </span>
            <span className="challenge-desc">
              Longest run of consecutive zero-spend days this month.
            </span>
          </li>
          <li>
            <span className="challenge-title">Current No-Spend Streak</span>
            <span className="challenge-value">
              {currentNoSpendStreak} day
              {currentNoSpendStreak === 1 ? "" : "s"} in a row
            </span>
            <span className="challenge-desc">
              Keep it going by not spending today.
            </span>
          </li>
          <li>
            <span className="challenge-title">
              Low-Spend Days (≤ ${LOW_SPEND_THRESHOLD})
            </span>
            <span className="challenge-value">
              {lowSpendDaysCount} day
              {lowSpendDaysCount === 1 ? "" : "s"} this month
            </span>
            <span className="challenge-desc">
              Days where you kept expenses under $
              {LOW_SPEND_THRESHOLD.toFixed(0)}.
            </span>
          </li>
        </ul>
      </section>

      {/* LAST 5 TRANSACTIONS */}
      <section className="card">
        <h3>Recent Transactions (Last 5)</h3>
        {loading ? (
          <p>Loading...</p>
        ) : lastFive.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Type</th>
                <th>Category</th>
                <th className="amount-col">Amount</th>
              </tr>
            </thead>
            <tbody>
              {lastFive.map((tx) => {
                const category = categories.find(
                  (c) => Number(c.id) === Number(tx.categoryId)
                );
                return (
                  <tr key={tx.id}>
                    <td>{tx.date?.slice(0, 10)}</td>
                    <td>{tx.description}</td>
                    <td>
                      {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                    </td>
                    <td>{category ? category.name : "-"}</td>
                    <td className={`amount ${tx.type}`}>
                      {tx.type === "expense" ? "-" : "+"}
                      {Number(tx.amount).toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
