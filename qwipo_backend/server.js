const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup (SQLite stored in project root)
const dbPath = path.resolve(__dirname, "database.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error("Database connection failed:", err.message);
  else console.log("Connected to SQLite database");
});

// Example route
app.get("/", (req, res) => {
  res.json({ message: "Qwipo Backend is Running 🚀" });
});

// Import your routes
const customerRoutes = require("./routes/customerRoutes");
app.use("/api/customers", customerRoutes(db));

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
