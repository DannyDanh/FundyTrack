// server/server.js
const express = require("express");
const cors = require("cors");
const session = require("express-session");
require("dotenv").config();

const passport = require("passport");
require("./auth/google"); // configures passport

const transactionsRouter = require("./routes/transactions");
const categoriesRouter = require("./routes/categories");
const budgetRouter = require("./routes/budget");

const app = express();
const PORT = process.env.PORT || 5000;

// 🔹 Frontend origin (local by default, overridable in Render)
const FRONTEND_ORIGIN =
  process.env.FRONTEND_ORIGIN || "http://localhost:5173";

// 🔹 CORS – allow localhost + deployed frontend
const allowedOrigins = [
  "http://localhost:5173",
  FRONTEND_ORIGIN,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // allow tools like curl / Postman (no Origin header)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
  })
);

app.use(express.json());

// 💾 sessions (store logged-in user id)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "changeme123",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      // secure cookies in production (Render), not in local dev
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Health check
app.get("/", (req, res) => {
  res.send("FundyTrack API running 🚀");
});

// === AUTH ROUTES ===
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${FRONTEND_ORIGIN}/login`,
  }),
  (req, res) => {
    // successful login -> send back to frontend root
    res.redirect(FRONTEND_ORIGIN + "/");
  }
);

app.post("/auth/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ error: "Logout failed" });
    }
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.json({ success: true });
    });
  });
});

// current user
app.get("/api/me", (req, res) => {
  res.json({ user: req.user || null });
});

// auth middleware
function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
}

// protected routes
app.use("/api/transactions", requireAuth, transactionsRouter);
app.use("/api/categories", requireAuth, categoriesRouter);
app.use("/api/budget", requireAuth, budgetRouter);

app.listen(PORT, () => {
  console.log(`🌐 Server running on http://localhost:${PORT}`);
  console.log(`   Allowed frontend origin: ${FRONTEND_ORIGIN}`);
});
