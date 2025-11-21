// client/src/pages/TransactionsPage.jsx
import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    date: "",
    description: "",
    amount: "",
    type: "expense",
    categoryId: "",
  });

  async function loadData() {
    setLoading(true);
    try {
      const [txs, cats] = await Promise.all([
        api.get("/api/transactions"),
        api.get("/api/categories"),
      ]);
      setTransactions(txs);
      setCategories(cats);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function resetForm() {
    setEditingId(null);
    setForm({
      date: "",
      description: "",
      amount: "",
      type: "expense",
      categoryId: "",
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const body = {
      date: form.date,
      description: form.description,
      amount: Number(form.amount),
      type: form.type,
      categoryId: form.categoryId ? Number(form.categoryId) : null,
    };

    try {
      if (editingId) {
        await api.patch(`/api/transactions/${editingId}`, body);
      } else {
        await api.post("/api/transactions", body);
      }

      await loadData();
      resetForm();
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save transaction");
    }
  }

  function handleEdit(tx) {
    setEditingId(tx.id);
    setForm({
      date: tx.date?.slice(0, 10) || "",
      description: tx.description,
      amount: tx.amount,
      type: tx.type, // still 'expense' or 'income' internally
      categoryId: tx.categoryId ? String(tx.categoryId) : "",
    });
  }

  async function handleDelete(id) {
    if (!confirm("Delete this transaction?")) return;
    try {
      await api.delete(`/api/transactions/${id}`);
      await loadData();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete transaction");
    }
  }

  return (
    <div className="page">
      <h2>Transactions</h2>

      {/* FORM - row layout */}
      <form className="card" onSubmit={handleSubmit} style={txStyles.formCard}>
        <h3 style={{ marginBottom: "0.75rem" }}>
          {editingId ? "Edit Transaction" : "New Transaction"}
        </h3>

        <div style={txStyles.formRow}>
          <div style={txStyles.field}>
            <label style={txStyles.label}>Date</label>
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              style={txStyles.input}
            />
          </div>

          <div style={{ ...txStyles.field, flex: 2 }}>
            <label style={txStyles.label}>Description</label>
            <input
              type="text"
              required
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              style={txStyles.input}
            />
          </div>

          <div style={txStyles.field}>
            <label style={txStyles.label}>Amount</label>
            <input
              type="number"
              step="0.01"
              required
              value={form.amount}
              onChange={(e) =>
                setForm({ ...form, amount: e.target.value })
              }
              style={txStyles.input}
            />
          </div>

          <div style={txStyles.field}>
            <label style={txStyles.label}>Type</label>
            <select
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value })
              }
              style={txStyles.input}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div style={txStyles.field}>
            <label style={txStyles.label}>Category</label>
            <select
              value={form.categoryId}
              onChange={(e) =>
                setForm({ ...form, categoryId: e.target.value })
              }
              style={txStyles.input}
            >
              <option value="">None</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div style={txStyles.actions}>
            <button className="btn" type="submit">
              {editingId ? "Update" : "Add"}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn"
                style={txStyles.cancelBtn}
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      {/* LIST */}
      <section className="card">
        <h3>All Transactions</h3>

        {loading ? (
          <p>Loading...</p>
        ) : transactions.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Type</th>
                <th>Category</th>
                <th>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => {
                const cat = categories.find(
                  (c) => Number(c.id) === Number(tx.categoryId)
                );

                return (
                  <tr key={tx.id}>
                    <td>{tx.date?.slice(0, 10)}</td>
                    <td>{tx.description}</td>
                    <td>
                      {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                    </td>
                    <td>{cat ? cat.name : "Uncategorized"}</td>
                    <td>${Number(tx.amount).toFixed(2)}</td>
                    <td>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          className="btn small"
                          onClick={() => handleEdit(tx)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn small danger"
                          onClick={() => handleDelete(tx.id)}
                        >
                          Delete
                        </button>
                      </div>
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

const txStyles = {
  formCard: {
    marginBottom: "1.5rem",
  },
  formRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.75rem",
    alignItems: "flex-end",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    minWidth: "140px",
  },
  label: {
    fontSize: "0.85rem",
    marginBottom: "0.25rem",
    color: "#4b5563",
  },
  input: {
    padding: "6px 8px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    fontSize: "0.95rem",
  },
  actions: {
    display: "flex",
    flexDirection: "column",
    gap: "0.35rem",
    marginLeft: "auto",
  },
  cancelBtn: {
    background: "#e5e7eb",
    color: "#111827",
  },
};
