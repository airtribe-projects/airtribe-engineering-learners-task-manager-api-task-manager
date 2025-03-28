const request = require("supertest");
const app = require("../src/app");


describe("Authentication API", () => {
    it("should register a new user", async () => {
        const res = await request(app).post("/api/auth/register").send({
            name: "Test User",
            email: "test@example.com",
            password: "password123"
        });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("message", "User registered successfully");
    });

    it("should not allow duplicate registration", async () => {
        const res = await request(app).post("/api/auth/register").send({
            name: "Test User",
            email: "test@example.com",
            password: "password123"
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("error", "User already exists");
    });

    it("should log in a user", async () => {
        const res = await request(app).post("/api/auth/login").send({
            email: "test@example.com",
            password: "password123"
        });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("token");
    });
});
