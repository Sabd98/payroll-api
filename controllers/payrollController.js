const { PayrollPeriod, Payslip, Employee } = require("../models");
const { runPayrollCalculation } = require("../utils/payroll");

exports.createPayrollPeriod = async (req, res) => {
  try {
    const { start_date, end_date } = req.body;

    // Validasi tanggal
    if (new Date(end_date) <= new Date(start_date)) {
      return res
        .status(400)
        .json({ error: "End date must be after start date" });
    }

    const period = await PayrollPeriod.create({
      start_date,
      end_date,
      is_processed: false,
      created_by: req.user.id,
      ip_address: req.ip,
    });

    res.status(201).json(period);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.runPayroll = async (req, res) => {
  try {
    const { periodId } = req.body;

    // Cek apakah periode ada dan belum diproses
    const period = await PayrollPeriod.findByPk(periodId);
    if (!period) {
      return res.status(404).json({ error: "Payroll period not found" });
    }
    if (period.is_processed) {
      return res
        .status(400)
        .json({ error: "Payroll already processed for this period" });
    }

    // Gunakan background job jika diimplementasikan
    // if (payrollQueue) {
    //   await payrollQueue.add({ periodId, adminId: req.user.id });
    //   return res.status(202).json({
    //     message: "Payroll processing started in background",
    //   });
    // }

    // Jika tidak menggunakan background job
    await runPayrollCalculation(periodId, req.user.id);
    await period.update({ is_processed: true });

    res.status(200).json({ message: "Payroll processed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPayslipSummary = async (req, res) => {
  try {
    const { periodId } = req.params;

    const payslips = await Payslip.findAll({
      where: { payroll_period_id: periodId },
      include: [
        {
          model: Employee,
          attributes: ["id", "username"],
        },
      ],
      attributes: [
        "id",
        "base_salary",
        "overtime_pay",
        "total_reimbursements",
        "total_pay",
      ],
    });

    const total = payslips.reduce(
      (sum, payslip) => sum + parseFloat(payslip.total_pay),
      0
    );

    res.json({
      period_id: periodId,
      payslips,
      total_take_home_pay: total.toFixed(2),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
