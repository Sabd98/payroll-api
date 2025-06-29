const { Op } = require("sequelize");
const { calculateWorkingDays } = require("./dateUtils");

module.exports = {
  calculateDailySalary: (monthlySalary, workingDays) => {
    if (workingDays <= 0) throw new Error("Working days must be positive");
    return parseFloat((monthlySalary / workingDays).toFixed(2));
  },

  calculateHourlyRate: (monthlySalary, workingDays) => {
    if (workingDays <= 0) throw new Error("Working days must be positive");
    return parseFloat((monthlySalary / (workingDays * 8)).toFixed(2));
  },

  calculateOvertimePay: (monthlySalary, workingDays, overtimeHours) => {
    const hourlyRate = module.exports.calculateHourlyRate(
      monthlySalary,
      workingDays
    );
    return parseFloat((overtimeHours * (hourlyRate * 2)).toFixed(2));
  },

  calculateTotalPay: (
    monthlySalary,
    workingDays,
    attendanceCount,
    overtimeHours,
    reimbursements
  ) => {
    const dailySalary = module.exports.calculateDailySalary(
      monthlySalary,
      workingDays
    );
    const baseSalary = parseFloat((attendanceCount * dailySalary).toFixed(2));
    const overtimePay = module.exports.calculateOvertimePay(
      monthlySalary,
      workingDays,
      overtimeHours
    );

    return {
      baseSalary,
      overtimePay,
      totalReimbursements: parseFloat(reimbursements.toFixed(2)),
      totalPay: parseFloat(
        (baseSalary + overtimePay + reimbursements).toFixed(2)
      ),
    };
  },

  runPayrollCalculation: async (periodId, adminId, transaction) => {
    const {
      PayrollPeriod,
      Employee,
      Attendance,
      Overtime,
      Reimbursement,
      Payslip,
    } = require("../models");

    const period = await PayrollPeriod.findByPk(periodId, { transaction });
    const employees = await Employee.findAll({ transaction });

    const workingDays = calculateWorkingDays(
      period.start_date,
      period.end_date
    );

    for (const employee of employees) {
      // [1] Dapatkan reimbursement yang belum diproses
      const unpaidReimbursements = await Reimbursement.findAll({
        where: {
          employee_id: employee.id,
          payroll_period_id: periodId,
          payslip_id: null,
        },
        transaction,
      });

      // [2] Hitung total reimbursement
      const reimbursementTotal = unpaidReimbursements.reduce(
        (sum, r) => sum + parseFloat(r.amount),
        0
      );

      // [3] Hitung komponen lainnya
      const [attendanceCount, overtimeHours] = await Promise.all([
        Attendance.count({
          where: {
            employee_id: employee.id,
            payroll_period_id: periodId,
          },
          transaction,
        }),
        Overtime.sum("hours", {
          where: {
            employee_id: employee.id,
            payroll_period_id: periodId,
          },
          transaction,
        }) || 0,
      ]);

      // [4] Kalkulasi gaji
      const { baseSalary, overtimePay, totalPay } =
        module.exports.calculateTotalPay(
          employee.monthly_salary,
          workingDays,
          attendanceCount,
          overtimeHours,
          reimbursementTotal
        );

      // [5] Buat payslip
      const payslip = await Payslip.create(
        {
          employee_id: employee.id,
          payroll_period_id: periodId,
          base_salary: baseSalary,
          overtime_pay: overtimePay,
          total_reimbursements: reimbursementTotal,
          total_pay: totalPay,
          created_by: adminId,
        },
        { transaction }
      );

      // [6] Update reimbursement dengan payslip_id (NEW)
      if (unpaidReimbursements.length > 0) {
        await Reimbursement.update(
          { payslip_id: payslip.id },
          {
            where: {
              id: {
                [Op.in]: unpaidReimbursements.map((r) => r.id),
              },
            },
            transaction,
          }
        );
      }
    }
  },
};
