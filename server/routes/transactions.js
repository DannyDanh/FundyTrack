// server/routes/transactions.js
const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// GET all transactions for logged-in user
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT *
      FROM transactions
      WHERE user_id = $1
      ORDER BY date DESC, id DESC
      `,
      [userId]
    );

    const normalized = result.rows.map((tx) => ({
      ...tx,
      categoryId: tx.category_id,
    }));

    res.json(normalized);
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

// CREATE transaction for this user
router.post("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const { date, description, amount, type, categoryId } = req.body;

    if (!date || !description || amount === undefined || !type) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const result = await pool.query(
      `
      INSERT INTO transactions (user_id, date, description, amount, type, category_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [userId, date, description, amount, type, categoryId || null]
    );

    const row = result.rows[0];
    res.json({
      ...row,
      categoryId: row.category_id,
    });
  } catch (err) {
    console.error("Error creating transaction:", err);
    res.status(500).json({ error: "Failed to create transaction" });
  }
});

// internal helper for UPDATE
async function updateTransaction(req, res) {
  try {
    const userId = req.user.id;
    const id = req.params.id;
    const { date, description, amount, type, categoryId } = req.body;

    const result = await pool.query(
      `
      UPDATE transactions
      SET date = $1,
          description = $2,
          amount = $3,
          type = $4,
          category_id = $5
      WHERE id = $6 AND user_id = $7
      RETURNING *
      `,
      [date, description, amount, type, categoryId || null, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    const row = result.rows[0];
    res.json({
      ...row,
      categoryId: row.category_id,
    });
  } catch (err) {
    console.error("Error updating transaction:", err);
    res.status(500).json({ error: "Failed to update transaction" });
  }
}

// UPDATE: support PATCH and PUT
router.patch("/:id", updateTransaction);
router.put("/:id", updateTransaction);

// DELETE (only for this user)
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const id = req.params.id;

    const result = await pool.query(
      `
      DELETE FROM transactions
      WHERE id = $1 AND user_id = $2
      RETURNING id
      `,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting transaction:", err);
    res.status(500).json({ error: "Failed to delete transaction" });
  }
});

module.exports = router;
