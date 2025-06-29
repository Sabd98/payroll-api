// const request = require("supertest");
// const app = require("../../../app");

// describe("Auth Controller", () => {
//   test("should authenticate admin with valid credentials", async () => {
//     const response = await request(app)
//       .post("/api/auth/login")
//       .send({ username: "admin", password: "admin123" });

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty("token");
//     expect(response.body.user.role).toBe("admin");
//   });

//   test("should reject invalid credentials", async () => {
//     const response = await request(app)
//       .post("/api/auth/login")
//       .send({ username: "admin", password: "wrongpassword" });

//     expect(response.status).toBe(401);
//     expect(response.body).toHaveProperty("error");
//   });
// });
