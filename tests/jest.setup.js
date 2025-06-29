// Nonaktifkan logging sequelize untuk test
const { sequelize } = require("../models");
sequelize.options.logging = false;

// Atur NODE_ENV ke test jika belum
process.env.NODE_ENV = process.env.NODE_ENV || "test";

console.log(`🏁 Starting tests in ${process.env.NODE_ENV} environment`);
