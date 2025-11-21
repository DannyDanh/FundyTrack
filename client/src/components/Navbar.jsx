// client/src/components/Navbar.jsx
import { NavLink } from "react-router-dom";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function Navbar({ user, onLogout }) {
  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <h1 style={styles.logo}>FundyTrack</h1>

        {user && (
          <nav style={styles.nav}>
            <NavLink style={styles.link} to="/dashboard">Dashboard</NavLink>
            <NavLink style={styles.link} to="/transactions">Transactions</NavLink>
            <NavLink style={styles.link} to="/categories">Categories</NavLink>
            <NavLink style={styles.link} to="/budget">Budgets</NavLink>
          </nav>
        )}
      </div>

      <div style={styles.right}>
        {!user ? (
          <a href={`${API_BASE}/auth/google`} style={styles.loginBtn}>
            Sign in with Google
          </a>
        ) : (
          <div style={styles.userRow}>
            <img src={user.avatar_url} alt="avatar" style={styles.avatar} />
            <span style={styles.userName}>{user.name}</span>

            <button style={styles.logoutBtn} onClick={onLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

// ⭐ ALL STYLES DEFINED BELOW (NO ERRORS)
const styles = {
  header: {
    background: "linear-gradient(90deg, #1e3a8a, #2563eb, #3b82f6)",
    padding: "14px 28px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "sticky",
    top: 0,
    zIndex: 999,
    boxShadow: "0 2px 10px rgba(0,0,0,0.20)",
  },

  logo: {
    margin: 0,
    fontSize: "1.8rem",
    color: "white",
    fontWeight: "800",
    letterSpacing: "0.5px",
  },

  left: {
    display: "flex",
    alignItems: "center",
    gap: "32px",
  },

  nav: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },

  link: {
    textDecoration: "none",
    color: "white",
    fontSize: "1.05rem",
    fontWeight: 500,
    opacity: 0.9,
    transition: "0.25s",
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  loginBtn: {
    padding: "10px 18px",
    background: "white",
    color: "#1e3a8a",
    borderRadius: "8px",
    fontWeight: 600,
    textDecoration: "none",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    transition: "0.25s",
  },

  userRow: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    color: "white",
  },

  userName: {
    fontWeight: 600,
    fontSize: "1rem",
  },

  avatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    border: "2px solid rgba(255,255,255,0.7)",
    boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
  },

  logoutBtn: {
    padding: "7px 14px",
    background: "rgba(255, 255, 255, 0.18)",
    color: "white",
    border: "1px solid rgba(255,255,255,0.3)",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 600,
    transition: "0.2s ease",
  },
};
