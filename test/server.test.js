const tap = require("tap");
const supertest = require("supertest");
const app = require("../app");
const server = supertest(app);

tap.test("POST /tasks", async (t) => {
  const newTask = {
    title: "New Task",
    description: "New Task Description",
    completed: false,
  };
  const response = await server.post("/tasks").send(newTask);
  t.equal(response.status, 201);
  t.end();
});

tap.test("POST /tasks with invalid data", async (t) => {
  const newTask = {
    title: "New Task",
  };
  const response = await server.post("/tasks").send(newTask);
  t.equal(response.status, 400);
  t.end();
});

tap.test("GET /tasks", async (t) => {
  const response = await server.get("/tasks");
  t.equal(response.status, 200);
  t.hasOwnProp(response.body[0], "id");
  t.hasOwnProp(response.body[0], "title");
  t.hasOwnProp(response.body[0], "description");
  t.hasOwnProp(response.body[0], "completed");
  t.type(response.body[0].id, "number");
  t.type(response.body[0].title, "string");
  t.type(response.body[0].description, "string");
  t.type(response.body[0].completed, "boolean");
  t.end();
});

tap.test("GET /tasks/:id", async (t) => {
  const response = await server.get("/tasks/1");
  t.equal(response.status, 200);
  const expectedTask = {
    id: 1,
    title: "Set up environment",
    description: "Install Node.js, npm, and git",
    completed: true,
  };
  t.match(response.body, expectedTask);
  t.end();
});

tap.test("GET /tasks/:id with invalid id", async (t) => {
  const response = await server.get("/tasks/999");
  t.equal(response.status, 404);
  t.end();
});

tap.test("PUT /tasks/:id", async (t) => {
  const updatedTask = {
    title: "Updated Task",
    description: "Updated Task Description",
    completed: true,
  };
  const response = await server.put("/tasks/1").send(updatedTask);
  t.equal(response.status, 200);
  t.end();
});

tap.test("PUT /tasks/:id with invalid id", async (t) => {
  const updatedTask = {
    title: "Updated Task",
    description: "Updated Task Description",
    completed: true,
  };
  const response = await server.put("/tasks/999").send(updatedTask);
  t.equal(response.status, 404);
  t.end();
});

tap.test("PUT /tasks/:id with invalid data", async (t) => {
  const updatedTask = {
    title: "Updated Task",
    description: "Updated Task Description",
    completed: "true",
  };
  const response = await server.put("/tasks/1").send(updatedTask);
  t.equal(response.status, 400);
  t.end();
});

tap.test("DELETE /tasks/:id", async (t) => {
  const response = await server.delete("/tasks/1");
  t.equal(response.status, 200);
  t.end();
});

tap.test("DELETE /tasks/:id with invalid id", async (t) => {
  const response = await server.delete("/tasks/999");
  t.equal(response.status, 404);
  t.end();
});

// -----------------------------------------------------------------------------
// new tests for auth and preferences
// -----------------------------------------------------------------------------

let authToken;

tap.test("POST /register with valid data", async (t) => {
  const res = await server.post("/register").send({
    email: "user@example.com",
    password: "password123",
  });
  t.equal(res.status, 201);
  t.equal(res.body.email, "user@example.com");
  t.end();
});

tap.test("POST /register with invalid email", async (t) => {
  const res = await server.post("/register").send({
    email: "not-an-email",
    password: "password123",
  });
  t.equal(res.status, 400);
  t.end();
});

tap.test("POST /register with short password", async (t) => {
  const res = await server.post("/register").send({
    email: "another@example.com",
    password: "123",
  });
  t.equal(res.status, 400);
  t.end();
});

tap.test("POST /login with correct credentials", async (t) => {
  const res = await server.post("/login").send({
    email: "user@example.com",
    password: "password123",
  });
  t.equal(res.status, 200);
  t.ok(res.body.token);
  authToken = res.body.token;
  t.end();
});

tap.test("POST /login with wrong password", async (t) => {
  const res = await server.post("/login").send({
    email: "user@example.com",
    password: "wrong",
  });
  t.equal(res.status, 401);
  t.end();
});

tap.test("GET /preferences without auth should be 401", async (t) => {
  const res = await server.get("/preferences");
  t.equal(res.status, 401);
  t.end();
});

tap.test("GET /preferences with auth should return default", async (t) => {
  const res = await server
    .get("/preferences")
    .set("Authorization", `Bearer ${authToken}`);
  t.equal(res.status, 200);
  t.same(res.body, { categories: [], languages: [] });
  t.end();
});

tap.test("PUT /preferences with invalid data", async (t) => {
  const res = await server
    .put("/preferences")
    .set("Authorization", `Bearer ${authToken}`)
    .send({ categories: "not-an-array" });
  t.equal(res.status, 400);
  t.end();
});

tap.test("PUT /preferences with valid update", async (t) => {
  const res = await server
    .put("/preferences")
    .set("Authorization", `Bearer ${authToken}`)
    .send({ categories: ["tech"], languages: ["en"] });
  t.equal(res.status, 200);
  t.same(res.body, { categories: ["tech"], languages: ["en"] });
  t.end();
});

tap.teardown(() => {
  process.exit(0);
});
