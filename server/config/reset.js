// server/config/reset.js
const pool = require("./database");

async function resetDB() {
  try {
    console.log("🔄 Resetting database...");

    await pool.query(`DROP TABLE IF EXISTS category_budgets;`);
    await pool.query(`DROP TABLE IF EXISTS budgets;`);
    await pool.query(`DROP TABLE IF EXISTS transactions;`);
    await pool.query(`DROP TABLE IF EXISTS categories;`);
    await pool.query(`DROP TABLE IF EXISTS users;`);

    // Users
    await pool.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        google_id TEXT UNIQUE NOT NULL,
        email TEXT,
        name TEXT,
        avatar_url TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Categories
    await pool.query(`
      CREATE TABLE categories (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        color VARCHAR(20) DEFAULT '#CCCCCC'
      );
    `);

    // Transactions
    await pool.query(`
      CREATE TABLE transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        description VARCHAR(255) NOT NULL,
        amount NUMERIC NOT NULL,
        type VARCHAR(20) CHECK (type IN ('income', 'expense')) NOT NULL,
        category_id INTEGER REFERENCES categories(id)
      );
    `);

    // Overall budgets
    await pool.query(`
      CREATE TABLE budgets (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        month VARCHAR(7) NOT NULL,
        amount NUMERIC NOT NULL,
        UNIQUE (user_id, month)
      );
    `);

    // Category budgets
    await pool.query(`
      CREATE TABLE category_budgets (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        category_id INTEGER REFERENCES categories(id),
        month VARCHAR(7) NOT NULL,
        amount NUMERIC NOT NULL,
        UNIQUE (user_id, category_id, month)
      );
    `);

    console.log("✅ Reset complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Reset error:", err);
    process.exit(1);
  }
}

resetDB();
