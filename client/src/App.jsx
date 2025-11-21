// client/src/App.jsx
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import TransactionsPage from "./pages/TransactionsPage";
import CategoriesPage from "./pages/CategoriesPage";
import BudgetPage from "./pages/BudgetPage";
import { api } from "./services/api";

export default function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  async function fetchUser() {
    try {
      const res = await api.get("/api/me");
      setUser(res.user || null);
    } catch {
      setUser(null);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  async function handleLogout() {
    await api.post("/auth/logout", {});
    setUser(null);
    navigate("/");  // redirect to landing page
  }

  return (
    <div className="app">
      <Navbar user={user} onLogout={handleLogout} />

      <main style={{ padding: "20px" }}>
        {!user ? (
          // Logged out → only landing page
          <Routes>
            <Route path="*" element={<LandingPage />} />
          </Routes>
        ) : (
          // Logged in → protected routes
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/budget" element={<BudgetPage />} />
          </Routes>
        )}
      </main>
    </div>
  );
}
