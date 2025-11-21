// server/routes/categories.js
const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// GET all categories for this user
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT id, name, color
      FROM categories
      WHERE user_id = $1
      ORDER BY name ASC
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// CREATE category
router.post("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, color } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const result = await pool.query(
      `
      INSERT INTO categories (user_id, name, color)
      VALUES ($1, $2, $3)
      RETURNING id, name, color
      `,
      [userId, name, color || "#CCCCCC"]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error creating category:", err);
    res.status(500).json({ error: "Failed to create category" });
  }
});

// UPDATE category
router.patch("/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const id = req.params.id;
    const { name, color } = req.body;

    const result = await pool.query(
      `
      UPDATE categories
      SET name = $1, color = $2
      WHERE id = $3 AND user_id = $4
      RETURNING id, name, color
      `,
      [name, color || "#CCCCCC", id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating category:", err);
    res.status(500).json({ error: "Failed to update category" });
  }
});

// DELETE category
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const id = req.params.id;

    const result = await pool.query(
      `
      DELETE FROM categories
      WHERE id = $1 AND user_id = $2
      RETURNING id
      `,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).json({ error: "Failed to delete category" });
  }
});

module.exports = router;
