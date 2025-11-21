// client/src/pages/CategoriesPage.jsx
import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    color: "#CCCCCC",
  });

  async function loadCategories() {
    setLoading(true);
    setError("");
    try {
      const data = await api.get("/api/categories");
      setCategories(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function resetForm() {
    setEditingId(null);
    setForm({
      name: "",
      color: "#CCCCCC",
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const body = {
      name: form.name.trim(),
      color: form.color || "#CCCCCC",
    };

    if (!body.name) {
      setError("Name is required");
      return;
    }

    try {
      if (editingId) {
        await api.patch(`/api/categories/${editingId}`, body);
      } else {
        await api.post("/api/categories", body);
      }
      await loadCategories();
      resetForm();
    } catch (err) {
      console.error(err);
      setError("Failed to save category");
    }
  }

  function handleEdit(cat) {
    setEditingId(cat.id);
    setForm({
      name: cat.name,
      color: cat.color || "#CCCCCC",
    });
  }

  async function handleDelete(id) {
    if (!confirm("Delete this category?")) return;

    try {
      await api.delete(`/api/categories/${id}`);
      await loadCategories();
    } catch (err) {
      console.error(err);
      setError("Failed to delete category (may be used by transactions)");
    }
  }

  return (
    <div className="page">
      <h2>Categories</h2>

      {error && <p className="error">{error}</p>}

      {/* FORM */}
      <form className="card" onSubmit={handleSubmit} style={styles.formCard}>
        <h3 style={{ marginBottom: "0.75rem" }}>
          {editingId ? "Edit Category" : "New Category"}
        </h3>

        <div style={styles.formRow}>
          <div style={{ ...styles.field, flex: 2 }}>
            <label style={styles.label}>Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Color</label>
            <input
              type="color"
              value={form.color}
              onChange={(e) =>
                setForm({ ...form, color: e.target.value })
              }
              style={{ ...styles.input, padding: 0, height: "36px" }}
            />
          </div>

          <div style={styles.actions}>
            <button className="btn" type="submit">
              {editingId ? "Update" : "Add"}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn"
                style={styles.cancelBtn}
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
        <h3>All Categories</h3>

        {loading ? (
          <p>Loading...</p>
        ) : categories.length === 0 ? (
          <p>No categories yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Color</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td>{cat.name}</td>
                  <td>
                    <div style={styles.colorCell}>
                      <span
                        style={{
                          ...styles.colorDot,
                          backgroundColor: cat.color || "#CCCCCC",
                        }}
                      />
                      <span>{cat.color || "#CCCCCC"}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        className="btn small"
                        onClick={() => handleEdit(cat)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn small danger"
                        onClick={() => handleDelete(cat.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

const styles = {
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
  colorCell: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  colorDot: {
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    border: "1px solid #d1d5db",
  },
};
