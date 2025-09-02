const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const { initDB } = require("./utils/db");

const customerRoutes = require("./routes/customerRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());

// Routes
app.use("/api/customers", customerRoutes);

// Initialize database
initDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
