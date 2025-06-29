const express = require("express");
const router = express.Router();
const payrollController = require("../controllers/payrollController");
const { authenticate, isAdmin } = require("../middlewares/auth");

router.use(authenticate);
router.use(isAdmin);

// Payroll periods
router.post("/payroll-periods", payrollController.createPayrollPeriod);

// Run payroll
router.post("/run-payroll", payrollController.runPayroll);

// Payslip summary
router.get("/payslip-summary/:periodId", payrollController.getPayslipSummary);

module.exports = router;
