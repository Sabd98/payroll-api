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

  runPayrollCalculation: async (periodId, adminId, transaction, db) => {
    const {
      PayrollPeriod,
      Employee,
      Attendance,
      Overtime,
      Reimbursement,
      Payslip,
    } = db.models;

    // Validasi periode
    const period = await PayrollPeriod.findByPk(periodId, { transaction });
    if (!period) {
      throw new Error("Payroll period not found");
    }

    const employees = await Employee.findAll({ transaction });
    const workingDays = calculateWorkingDays(
      period.start_date,
      period.end_date
    );

    for (const employee of employees) {
      const [attendanceCount, overtimeHoursResult, reimbursementSum] =
        await Promise.all([
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
          }),
          Reimbursement.sum("amount", {
            where: {
              employee_id: employee.id,
              payroll_period_id: periodId,
            },
            transaction,
          }),
        ]);

      const overtimeHours = overtimeHoursResult || 0;
      const reimbursements = reimbursementSum || 0;

      const dailySalary = employee.monthly_salary / workingDays;
      const baseSalary = attendanceCount * dailySalary;

      const hourlyRate = employee.monthly_salary / (workingDays * 8);
      const overtimePay = overtimeHours * (hourlyRate * 2);

      const totalPay = baseSalary + overtimePay + reimbursements;

      await Payslip.create(
        {
          employee_id: employee.id,
          payroll_period_id: periodId,
          base_salary: baseSalary,
          overtime_pay: overtimePay,
          total_reimbursements: reimbursements,
          total_pay: totalPay,
          created_by: adminId,
        },
        { transaction }
      );
    }
  },
};
