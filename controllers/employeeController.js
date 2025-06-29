const audit = require("../middlewares/audit");
const {
  Attendance,
  Overtime,
  Reimbursement,
  Payslip,
  PayrollPeriod,
} = require("../models");
const { isWeekend } = require("../utils/dateUtils");

// Submit attendance
exports.submitAttendance = async (req, res) => {
  try {
    const { date, payroll_period_id } = req.body;

    // Validasi weekend
    if (isWeekend(date)) {
      return res
        .status(400)
        .json({ error: "Attendance not allowed on weekends" });
    }

    // Validasi payroll period
    const period = await PayrollPeriod.findByPk(payroll_period_id);
    if (!period) {
      return res.status(404).json({ error: "Payroll period not found" });
    }
    if (period.is_processed) {
      return res
        .status(400)
        .json({ error: "Payroll already processed for this period" });
    }

    // Validasi tanggal dalam periode
    const dateObj = new Date(date);
    if (
      dateObj < new Date(period.start_date) ||
      dateObj > new Date(period.end_date)
    ) {
      return res
        .status(400)
        .json({ error: "Date is not within the payroll period" });
    }

    // Cek apakah sudah ada absen di tanggal yang sama
    const existing = await Attendance.findOne({
      where: {
        employee_id: req.user.id,
        date: date,
        payroll_period_id,
      },
    });

    if (existing) {
      return res
        .status(400)
        .json({ error: "Attendance already submitted for this date" });
    }

    const attendance = await Attendance.create({
      employee_id: req.user.id,
      date,
      payroll_period_id,
      created_by: req.user.id,
      ip_address: req.ip,
    });

    //Jika mau audit log 
    // await audit.logDataChange(
    //   "CREATE",
    //   "attendances",
    //   attendance.id,
    //   { id: req.user.id, role: req.user.role },
    //   req.ip,
    //   null,
    //   attendance.toJSON()
    // );

    res.status(201).json(attendance);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Submit overtime
exports.submitOvertime = async (req, res) => {
  try {
    const { date, hours, payroll_period_id } = req.body;

    // Validasi jam lembur
    if (hours <= 0 || hours > 3) {
      return res
        .status(400)
        .json({ error: "Overtime must be between 0.1 and 3 hours" });
    }

    // Validasi tanggal di masa depan
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const overtimeDate = new Date(date);

    if (overtimeDate > today) {
      return res
        .status(400)
        .json({ error: "Overtime date cannot be in the future" });
    }

    // Validasi payroll period
    const period = await PayrollPeriod.findByPk(payroll_period_id);
    if (!period) {
      return res.status(404).json({ error: "Payroll period not found" });
    }
    if (period.is_processed) {
      return res
        .status(400)
        .json({ error: "Payroll already processed for this period" });
    }

    // Validasi tanggal dalam periode
    if (
      overtimeDate < new Date(period.start_date) ||
      overtimeDate > new Date(period.end_date)
    ) {
      return res
        .status(400)
        .json({ error: "Date is not within the payroll period" });
    }

    // Cek apakah sudah ada lembur di tanggal yang sama
    const existing = await Overtime.findOne({
      where: {
        employee_id: req.user.id,
        date: date,
        payroll_period_id,
      },
    });

    if (existing) {
      return res
        .status(400)
        .json({ error: "Overtime already submitted for this date" });
    }

    const overtime = await Overtime.create({
      employee_id: req.user.id,
      date,
      hours,
      payroll_period_id,
      created_by: req.user.id,
      ip_address: req.ip,
    });

    res.status(201).json(overtime);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Submit reimbursement
exports.submitReimbursement = async (req, res) => {
  try {
    const { amount, description, payroll_period_id } = req.body;

    // Validasi jumlah reimbursement
    if (amount <= 0) {
      return res.status(400).json({ error: "Amount must be positive" });
    }

    // Validasi payroll period
    const period = await PayrollPeriod.findByPk(payroll_period_id);
    if (!period) {
      return res.status(404).json({ error: "Payroll period not found" });
    }
    if (period.is_processed) {
      return res
        .status(400)
        .json({ error: "Payroll already processed for this period" });
    }

    const reimbursement = await Reimbursement.create({
      employee_id: req.user.id,
      amount,
      description,
      payroll_period_id,
      created_by: req.user.id,
      ip_address: req.ip,
    });

    res.status(201).json(reimbursement);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get payslip
exports.getPayslip = async (req, res) => {
  try {
    const { periodId } = req.params;

    const payslip = await Payslip.findOne({
      where: {
        employee_id: req.user.id,
        payroll_period_id: periodId,
      },
      include: [
        {
          model: Reimbursement,
          as: "reimbursements",
          attributes: ["id", "amount", "description", "created_at"],
        },
      ],
    });

    if (!payslip) {
      return res
        .status(404)
        .json({ error: "Payslip not found for this period" });
    }

    // Format response
    const response = {
      period_id: periodId,
      base_salary: payslip.base_salary,
      overtime_pay: payslip.overtime_pay,
      total_reimbursements: payslip.total_reimbursements,
      reimbursements: payslip.reimbursements?.map((r) => ({
        id: r.id,
        amount: r.amount,
        description: r.description,
        date: r.created_at,
      })),
      total_pay: payslip.total_pay,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get employee's payroll periods
exports.getPayrollPeriods = async (req, res) => {
  try {
    const periods = await PayrollPeriod.findAll({
      where: { is_processed: true },
      order: [["end_date", "DESC"]],
      attributes: ["id", "start_date", "end_date"],
    });

    res.json(periods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
