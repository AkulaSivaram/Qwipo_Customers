const express = require("express");

module.exports = (db) => {
  const router = express.Router();

  // Create customer
  router.post("/", (req, res) => {
    const { name, email, phone } = req.body;
    const query = `INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)`;
    db.run(query, [name, email, phone], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, name, email, phone });
    });
  });

  // Get all customers
  router.get("/", (req, res) => {
    db.all(`SELECT * FROM customers ORDER BY created_at DESC`, [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  });

  return router;
};
