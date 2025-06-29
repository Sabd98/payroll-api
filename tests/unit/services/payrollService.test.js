const { runPayrollCalculation } = require("../../../utils/payroll");
const {
  PayrollPeriod,
  Employee,
  Attendance,
  Overtime,
  Reimbursement,
  Payslip,
} = require("../../../models");

// Buat mock transaction yang lebih lengkap
const mockTransaction = {
  LOCK: { UPDATE: "update" },
  commit: jest.fn().mockResolvedValue(true),
  rollback: jest.fn().mockResolvedValue(true),
  fn: jest.fn(),
  get: jest.fn(),
  set: jest.fn(),
  then: jest.fn(),
};

// Mock sequelize transaction
jest.mock("../../../models", () => {
  return {
    sequelize: {
      transaction: jest.fn(() => mockTransaction),
    },
    PayrollPeriod: {
      findByPk: jest.fn().mockImplementation((id, options) => {
        if (id === 999) return null; // Untuk test error
        return Promise.resolve({
          id: 1,
          start_date: "2024-01-01",
          end_date: "2024-01-31",
        });
      }),
    },
    Employee: {
      findAll: jest.fn().mockResolvedValue([{ id: 1, monthly_salary: 3000 }]),
    },
    Attendance: {
      count: jest.fn().mockResolvedValue(20),
    },
    Overtime: {
      sum: jest.fn().mockResolvedValue(5),
    },
    Reimbursement: {
      sum: jest.fn().mockResolvedValue(500),
    },
    Payslip: {
      create: jest.fn().mockImplementation((data, options) => {
        return Promise.resolve({ id: 1, ...data });
      }),
    },
  };
});

describe("Payroll Service", () => {
  const adminId = 1;
  const periodId = 1;

  beforeEach(() => {
    jest.clearAllMocks();

    // Reset mock implementations
    PayrollPeriod.findByPk.mockImplementation((id, options) => {
      if (id === 999) return null;
      return Promise.resolve({
        id: 1,
        start_date: "2024-01-01",
        end_date: "2024-01-31",
      });
    });
  });

  test("processes payroll correctly", async () => {
    // Jalankan fungsi
    await runPayrollCalculation(periodId, adminId, mockTransaction, {
      models: {
        PayrollPeriod,
        Employee,
        Attendance,
        Overtime,
        Reimbursement,
        Payslip,
      },
    });

    // Assertions
    expect(PayrollPeriod.findByPk).toHaveBeenCalledWith(periodId, {
      transaction: mockTransaction,
    });

    expect(Employee.findAll).toHaveBeenCalledWith({
      transaction: mockTransaction,
    });

    expect(Attendance.count).toHaveBeenCalledWith({
      where: { employee_id: 1, payroll_period_id: 1 },
      transaction: mockTransaction,
    });

    expect(Overtime.sum).toHaveBeenCalledWith("hours", {
      where: { employee_id: 1, payroll_period_id: 1 },
      transaction: mockTransaction,
    });

    expect(Reimbursement.sum).toHaveBeenCalledWith("amount", {
      where: { employee_id: 1, payroll_period_id: 1 },
      transaction: mockTransaction,
    });

    expect(Payslip.create).toHaveBeenCalledWith(
      expect.objectContaining({
        employee_id: 1,
        payroll_period_id: 1,
        base_salary: expect.any(Number),
        overtime_pay: expect.any(Number),
        total_reimbursements: 500,
        total_pay: expect.any(Number),
        created_by: adminId,
      }),
      { transaction: mockTransaction }
    );
  });

  test("handles employee with no attendance", async () => {
    // Override mock untuk attendance
    Attendance.count.mockResolvedValue(0);
    Overtime.sum.mockResolvedValue(0);
    Reimbursement.sum.mockResolvedValue(0);

    await runPayrollCalculation(periodId, adminId, mockTransaction, {
      models: {
        PayrollPeriod,
        Employee,
        Attendance,
        Overtime,
        Reimbursement,
        Payslip,
      },
    });

    expect(Payslip.create).toHaveBeenCalledWith(
      expect.objectContaining({
        base_salary: 0,
        overtime_pay: 0,
        total_reimbursements: 0,
      }),
      { transaction: mockTransaction }
    );
  });

  test("throws error for invalid period", async () => {
    await expect(
      runPayrollCalculation(
        999, // ID tidak valid
        adminId,
        mockTransaction,
        { models: { PayrollPeriod } }
      )
    ).rejects.toThrow("Payroll period not found");
  });
});
