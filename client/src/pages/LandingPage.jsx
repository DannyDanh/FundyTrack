// client/src/pages/LandingPage.jsx
export default function LandingPage() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        Take Control of Your Money.
      </h1>

      <h2 style={styles.subtitle}>
        Track expenses. Set budgets. Build better financial habits.
      </h2>

      <a href="http://localhost:5000/auth/google" style={styles.googleBtn}>
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt=""
          style={{ width: 24, height: 24 }}
        />
        Continue with Google
      </a>

      <div style={styles.featureRow}>
        <div style={styles.featureBox}>
          <h3>📊 Smart Insights</h3>
          <p>Beautiful dashboards that show where your money really goes.</p>
        </div>
        <div style={styles.featureBox}>
          <h3>💰 Budget Tools</h3>
          <p>Set goals and track your spending in real time.</p>
        </div>
        <div style={styles.featureBox}>
          <h3>🎯 Saving Challenges</h3>
          <p>Stay motivated with no-spend streaks and daily habits.</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "6rem 1rem",
    maxWidth: "900px",
    margin: "0 auto",
  },
  title: {
    fontSize: "3.2rem",
    color: "#1f2937",
    fontWeight: "800",
    marginBottom: "1rem",
  },
  subtitle: {
    fontSize: "1.6rem",
    color: "#4b5563",
    marginBottom: "3rem",
    maxWidth: "600px",
    marginInline: "auto",
  },
  googleBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    background: "#2563eb",
    color: "white",
    textDecoration: "none",
    padding: "14px 26px",
    borderRadius: "10px",
    fontSize: "1.2rem",
    fontWeight: "600",
    marginBottom: "3rem",
  },
  featureRow: {
    display: "flex",
    gap: "1.5rem",
    marginTop: "2rem",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  featureBox: {
    background: "#f8fafc",
    padding: "1.5rem",
    width: "260px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
  },
};
