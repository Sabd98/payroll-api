const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");
const { authenticate, isEmployee } = require("../middlewares/auth");

router.use(authenticate);
router.use(isEmployee);

// Attendance
router.post("/attendances", employeeController.submitAttendance);

// Overtime
router.post("/overtimes", employeeController.submitOvertime);

// Reimbursement
router.post("/reimbursements", employeeController.submitReimbursement);

// Payslip
router.get("/payslips/:periodId", employeeController.getPayslip);

// Payroll periods
router.get("/payroll-periods", employeeController.getPayrollPeriods);

module.exports = router;
