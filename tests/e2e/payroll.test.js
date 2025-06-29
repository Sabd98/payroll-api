const request = require("supertest");
const app = require("../../app");
const {
  getAdminToken,
  getEmployeeToken,
} = require("../helpers/testHelpers");

describe("Full Payroll Flow", () => {
  let adminToken;
  let employeeToken;
  let periodId;

  beforeAll(async () => {
    adminToken = await getAdminToken();
    const employee = await getEmployeeToken();
    employeeToken = employee.token;
  });

  test("complete payroll lifecycle", async () => {
    // Step 1: Create payroll period
    const periodRes = await request(app)
      .post("/api/admin/payroll-periods")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        start_date: "2024-02-01",
        end_date: "2024-02-29",
      });

    periodId = periodRes.body.id;
    expect(periodRes.status).toBe(201);

    // Step 2: Submit attendance
    const attendanceRes = await request(app)
      .post("/api/employee/attendances")
      .set("Authorization", `Bearer ${employeeToken}`)
      .send({
        date: "2024-02-01",
        payroll_period_id: periodId,
      });

    expect(attendanceRes.status).toBe(201);

    // Step 3: Submit overtime
    const overtimeRes = await request(app)
      .post("/api/employee/overtimes")
      .set("Authorization", `Bearer ${employeeToken}`)
      .send({
        date: "2024-02-01",
        hours: 2,
        payroll_period_id: periodId,
      });

    expect(overtimeRes.status).toBe(201);

    // Step 4: Submit reimbursement
    const reimbursementRes = await request(app)
      .post("/api/employee/reimbursements")
      .set("Authorization", `Bearer ${employeeToken}`)
      .send({
        amount: 75,
        description: "Office supplies",
        payroll_period_id: periodId,
      });

    expect(reimbursementRes.status).toBe(201);

    // Step 5: Run payroll
    const runRes = await request(app)
      .post("/api/admin/run-payroll")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ periodId });

    expect(runRes.status).toBe(202);

    // Wait for processing
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Step 6: Get payslip
    const payslipRes = await request(app)
      .get(`/api/employee/payslips/${periodId}`)
      .set("Authorization", `Bearer ${employeeToken}`);

    expect(payslipRes.status).toBe(200);
    expect(payslipRes.body.total_pay).toBeGreaterThan(0);

    // Verify calculations
    const expectedBase = 3000 * (1 / 20); // 1 attendance day / 20 working days
    const expectedOvertime = (3000 / (20 * 8)) * 2 * 2; // 2 hours * 2x rate
    const expectedTotal = expectedBase + expectedOvertime + 75;

    expect(payslipRes.body.base_salary).toBeCloseTo(expectedBase, 2);
    expect(payslipRes.body.overtime_pay).toBeCloseTo(expectedOvertime, 2);
    expect(payslipRes.body.total_pay).toBeCloseTo(expectedTotal, 2);
  });
});
