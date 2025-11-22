// client/src/App.jsx
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import DashboardPage from "./pages/DashboardPage.jsx";
import TransactionsPage from "./pages/TransactionsPage.jsx";
import CategoriesPage from "./pages/CategoriesPage.jsx";
import BudgetPage from "./pages/BudgetPage.jsx";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // load current user from /api/me
  async function fetchMe() {
    try {
      setLoadingUser(true);
      const res = await fetch(`${API_BASE}/api/me`, {
        credentials: "include",
      });
      const data = await res.json();
      setUser(data.user || null);
    } catch (err) {
      console.error("Error loading /api/me", err);
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  }

  useEffect(() => {
    fetchMe();
  }, []);

  async function handleLogout() {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
    } catch (err) {
      console.error("Logout failed", err);
    }
  }

  const isAuthed = !!user;

  function ProtectedRoute({ children }) {
    if (loadingUser) return <div className="page">Loading...</div>;
    if (!isAuthed) return <Navigate to="/" replace />;
    return children;
  }

  return (
    <BrowserRouter>
      <Navbar user={user} onLogout={handleLogout} />
      <main className="app-main">
        <Routes>
          {/* Landing page */}
          <Route
            path="/"
            element={
              !isAuthed ? (
                <div className="landing">
                  <h1>Welcome to FundyTrack</h1>
                  <p>Sign in with Google to start tracking your money.</p>
                </div>
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <TransactionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <CategoriesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/budget"
            element={
              <ProtectedRoute>
                <BudgetPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
