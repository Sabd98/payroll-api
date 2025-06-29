const { sequelize } = require("../models");

module.exports = async () => {
  try {
    console.log("⏳ Syncing database...");
    await sequelize.sync();
    console.log("✅ Database synced");

    console.log("⏳ Creating test data...");
    // await createTestData();
    console.log("✅ Test data created");
  } catch (error) {
    console.error("🔥 Global setup failed:", error);
    throw error;
  }
};

// async function createTestData() {
//   const { Admin, Employee, PayrollPeriod } = require("../models");
//   const bcrypt = require("bcrypt");

//   // Buat admin
//   const adminPassword = await bcrypt.hash("admin123", 10);
//   const admin = await Admin.create({
//     username: "adminoooooo",
//     password: adminPassword,
//   });

//   // Buat employee
//   const employeePassword = await bcrypt.hash("password", 10);
//   await Employee.create({
//     username: "employeeedeaafaefeafa",
//     password: employeePassword,
//     monthly_salary: 3000,
//     created_by: admin.id,
//   });

//   // Buat payroll period
//   await PayrollPeriod.create({
//     start_date: "2024-01-01",
//     end_date: "2024-01-31",
//     is_processed: false,
//     created_by: admin.id,
//   });
// }
