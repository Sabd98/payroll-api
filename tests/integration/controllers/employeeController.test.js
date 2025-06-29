// const request = require("supertest");
// const app = require("../../../app");
// const { Employee, PayrollPeriod } = require("../../../models");

// describe("Employee Controller", () => {
//   let employeeToken;
//   let payrollPeriodId;

//   beforeAll(async () => {
//     // Create test employee
//     // const employee = await Employee.create({
//     //   username: "testemployee",
//     //   password: "passw1",
//     //   monthly_salary: 6819.00,
//     // });

//     // Login to get token
//     const loginRes = await request(app)
//       .post("/api/auth/login")
//       .send({ username: "employee1", password: "pass1" });

//     employeeToken = loginRes.body.token;

//     // Create payroll period
//     const period = await PayrollPeriod.create({
//       start_date: "2024-07-01",
//       end_date: "2024-07-30",
//       is_processed: false,
//       created_by: 1,
//     });

//     payrollPeriodId = period.id;
//   });

//   test("should submit attendance", async () => {
//     const response = await request(app)
//       .post("/api/employee/attendances")
//       .set("Authorization", `Bearer ${employeeToken}`)
//       .send({
//         date: "2024-07-02",
//         payroll_period_id: payrollPeriodId,
//       });

//     expect(response.status).toBe(201);
//     expect(response.body).toHaveProperty("id");
//     expect(response.body.date).toBe("2024-07-02");
//   });

//   test("should reject attendance on weekend", async () => {
//     const response = await request(app)
//       .post("/api/employee/attendances")
//       .set("Authorization", `Bearer ${employeeToken}`)
//       .send({
//         date: "2024-07-06", // Saturday
//         payroll_period_id: payrollPeriodId,
//       });

//     expect(response.status).toBe(400);
//     expect(response.body).toHaveProperty(
//       "error",
//       "Attendance not allowed on weekends"
//     );
//   });

//   test("should submit overtime", async () => {
//     const response = await request(app)
//       .post("/api/employee/overtimes")
//       .set("Authorization", `Bearer ${employeeToken}`)
//       .send({
//         date: "2024-07-02",
//         hours: 2,
//         payroll_period_id: payrollPeriodId,
//       });

//     expect(response.status).toBe(201);
//     expect(response.body.hours).toBe(2);
//   });

//   test("should reject overtime exceeding 3 hours", async () => {
//     const response = await request(app)
//       .post("/api/employee/overtimes")
//       .set("Authorization", `Bearer ${employeeToken}`)
//       .send({
//         date: "2024-07-02",
//         hours: 4,
//         payroll_period_id: payrollPeriodId,
//       });

//     expect(response.status).toBe(400);
//     expect(response.body).toHaveProperty(
//       "error",
//       "Overtime cannot exceed 3 hours"
//     );
//   });
// });
