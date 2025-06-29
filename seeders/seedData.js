const { Employee, Admin } = require("../models");
const bcrypt = require("bcrypt");

module.exports = async () => {
  // Buat admin
  await Admin.create({
    username: "admin",
    password: await bcrypt.hash("admin123", 10),
  });

  // Buat 100 karyawan
  const employees = [];
  for (let i = 1; i <= 100; i++) {
    employees.push({
      username: `employee${i}`,
      password: await bcrypt.hash(`pass${i}`, 10),
      monthly_salary: Math.floor(Math.random() * 5000) + 3000,
    });
  }

  await Employee.bulkCreate(employees);
  console.log("Seed data created successfully");
};
