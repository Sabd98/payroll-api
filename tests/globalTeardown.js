const { sequelize } = require("../models");

module.exports = async () => {
  try {
    console.log("⏳ Closing database connection...");
    await sequelize.close();
    console.log("✅ Database connection closed");
  } catch (error) {
    console.error("🔥 Global teardown failed:", error);
  }
};
