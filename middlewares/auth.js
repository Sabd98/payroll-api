const jwt = require("jsonwebtoken");
const { Employee, Admin } = require("../models");

module.exports = {
  authenticate: async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Authentication token required" });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      let user;
      if (decoded.role === "admin") {
        user = await Admin.findByPk(decoded.id);
      } else if (decoded.role === "employee") {
        user = await Employee.findByPk(decoded.id);
      }

      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      req.user = {
        id: user.id,
        username: user.username,
        role: decoded.role,
      };

      next();
    } catch (error) {
      res.status(401).json({ error: "Invalid or expired token" });
    }
  },

  isAdmin: (req, res, next) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    next();
  },

  isEmployee: (req, res, next) => {
    if (req.user.role !== "employee") {
      return res.status(403).json({ error: "Employee access required" });
    }
    next();
  },
};
