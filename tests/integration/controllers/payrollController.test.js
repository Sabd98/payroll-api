const request = require("supertest");
const app = require("../../../app");
const {
  Employee,
  PayrollPeriod,
  Attendance,
  Overtime,
  Reimbursement,
  Payslip,
  Admin
} = require("../../../models");

describe("Payroll Controller", () => {
  let adminToken;
  let employee;
  let payrollPeriodId;

  beforeAll(async () => {
    // Create admin and login
    await Admin.create({
      username: "admin",
      password: "password",
    });

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ username: "payrolladmin", password: "password" });

    adminToken = loginRes.body.token;

    // Create employee
    employee = await Employee.create({
      username: "payrollemployee",
      password: "password",
      monthly_salary: 3000,
    });

    // Create payroll period
    const period = await PayrollPeriod.create({
      start_date: "2024-02-01",
      end_date: "2024-02-29",
      is_processed: false,
      created_by: 1,
    });

    payrollPeriodId = period.id;

    // Create sample data
    await Attendance.create({
      employee_id: employee.id,
      date: "2024-02-01",
      payroll_period_id: payrollPeriodId,
    });

    await Overtime.create({
      employee_id: employee.id,
      date: "2024-02-01",
      hours: 2,
      payroll_period_id: payrollPeriodId,
    });

    await Reimbursement.create({
      employee_id: employee.id,
      amount: 50,
      description: "Transportation",
      payroll_period_id: payrollPeriodId,
    });
  });

  test("should run payroll processing", async () => {
    const response = await request(app)
      .post("/api/admin/run-payroll")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ periodId: payrollPeriodId });

    expect(response.status).toBe(202);
    expect(response.body).toHaveProperty("message");

    // Verify payslip created
    const payslip = await Payslip.findOne({
      where: { employee_id: employee.id },
    });

    expect(payslip).not.toBeNull();
    expect(payslip.base_salary).toBeGreaterThan(0);
    expect(payslip.overtime_pay).toBeGreaterThan(0);
    expect(payslip.total_reimbursements).toBe(50);
  });

  test("should reject running payroll twice", async () => {
    const response = await request(app)
      .post("/api/admin/run-payroll")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ periodId: payrollPeriodId });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Payroll already processed for this period"
    );
  });
});
