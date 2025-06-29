const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Employee, Admin } = require("../models");

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    let user = null;
    let role = "";

    // Cek apakah user adalah admin
    user = await Admin.findOne({ where: { username } });
    if (user) {
      role = "admin";
    } else {
      // Cek apakah user adalah employee
      user = await Employee.findOne({ where: { username } });
      if (user) role = "employee";
    }

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Verifikasi password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role,
        ...(role === "employee" && { monthly_salary: user.monthly_salary }),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const admin = await Admin.findByPk(req.user.id, {
        attributes: { exclude: ["password"] },
      });
      return res.json({ ...admin.toJSON(), role: "admin" });
    }

    const employee = await Employee.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });
    res.json({ ...employee.toJSON(), role: "employee" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
