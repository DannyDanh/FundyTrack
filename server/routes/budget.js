// server/routes/budget.js
const express = require("express");
const router = express.Router();
const pool = require("../config/database");

function currentMonthStr() {
  const now = new Date();
  return now.toISOString().slice(0, 7); // "YYYY-MM"
}

// GET global budget for logged-in user & month
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const month = req.query.month || currentMonthStr();

    const result = await pool.query(
      `
      SELECT month, amount
      FROM budgets
      WHERE user_id = $1 AND month = $2
      `,
      [userId, month]
    );

    if (result.rows.length === 0) {
      return res.json({ month, amount: null });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching budget:", err);
    res.status(500).json({ error: "Failed to fetch budget" });
  }
});

// UPSERT global budget
router.put("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const month = req.body.month || currentMonthStr();
    const amount = Number(req.body.amount || 0);

    const result = await pool.query(
      `
      INSERT INTO budgets (user_id, month, amount)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, month)
      DO UPDATE SET amount = EXCLUDED.amount
      RETURNING month, amount
      `,
      [userId, month, amount]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error saving budget:", err);
    res.status(500).json({ error: "Failed to save budget" });
  }
});

// GET category budgets for this user & month
router.get("/categories", async (req, res) => {
  try {
    const userId = req.user.id;
    const month = req.query.month || currentMonthStr();

    const result = await pool.query(
      `
      SELECT category_id, amount
      FROM category_budgets
      WHERE user_id = $1 AND month = $2
      `,
      [userId, month]
    );

    const budgets = result.rows.map((row) => ({
      categoryId: row.category_id,
      amount: row.amount,
    }));

    res.json({ month, budgets });
  } catch (err) {
    console.error("Error fetching category budgets:", err);
    res.status(500).json({ error: "Failed to fetch category budgets" });
  }
});

// UPSERT one category budget
router.put("/categories/:categoryId", async (req, res) => {
  try {
    const userId = req.user.id;
    const categoryId = Number(req.params.categoryId);
    const month = req.body.month || currentMonthStr();
    const amount = Number(req.body.amount || 0);

    const result = await pool.query(
      `
      INSERT INTO category_budgets (user_id, category_id, month, amount)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id, category_id, month)
      DO UPDATE SET amount = EXCLUDED.amount
      RETURNING category_id, month, amount
      `,
      [userId, categoryId, month, amount]
    );

    const row = result.rows[0];
    res.json({
      categoryId: row.category_id,
      month: row.month,
      amount: row.amount,
    });
  } catch (err) {
    console.error("Error saving category budget:", err);
    res.status(500).json({ error: "Failed to save category budget" });
  }
});

module.exports = router;
