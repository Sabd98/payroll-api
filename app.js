require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const db = require("./models");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// const requestLogger = require('./utils/requestLogger');
const auditMiddleware = require('./middlewares/audit');

// Tambahkan middleware audit global
app.use(auditMiddleware());
// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Import routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const employeeRoutes = require("./routes/employee");
const configEnv = require("./utils/configEnv");

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/employee", employeeRoutes);

// app.js
app.use((req, res, next) => {
  // Tambahkan trace ID ke semua response
  res.set('X-Trace-ID', req.requestId || 'none');
  next();
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Sync database
db.sequelize
  .sync()
  .then(() => {
    console.log("Database synced");
    // Run seeders if needed
    if (configEnv.RUN_SEEDERS === "true") {
      require("./seeders/seedData")();
    }
  })
  .catch((err) => console.error("Database sync error:", err));

module.exports = app;
