const tap = require("tap");
const supertest = require("supertest");
const app = require("../app");
const server = supertest(app);

// Test POST /tasks
tap.test("POST /tasks", async (t) => {
  const newTask = {
    title: "New Task",
    description: "New Task Description",
    completed: false,
    priority: "high"
  };
  const response = await server.post("/tasks").send(newTask);
  t.equal(response.status, 201);
  t.hasOwnProp(response.body, "id");
  t.hasOwnProp(response.body, "title");
  t.hasOwnProp(response.body, "description");
  t.hasOwnProp(response.body, "completed");
  t.hasOwnProp(response.body, "priority");
  t.end();
});

// POST /tasks with invalid data
tap.test("POST /tasks with invalid data", async (t) => {
  const newTask = { title: "Only title" };
  const response = await server.post("/tasks").send(newTask);
  t.equal(response.status, 400);
  t.end();
});

// GET /tasks
tap.test("GET /tasks", async (t) => {
  const response = await server.get("/tasks");
  t.equal(response.status, 200);
  t.type(response.body, "array");
  if (response.body.length > 0) {
    t.hasOwnProp(response.body[0], "id");
    t.hasOwnProp(response.body[0], "title");
    t.hasOwnProp(response.body[0], "description");
    t.hasOwnProp(response.body[0], "completed");
    t.hasOwnProp(response.body[0], "priority");
  }
  t.end();
});

// GET /tasks/:id
tap.test("GET /tasks/:id", async (t) => {
  const response = await server.get("/tasks/2"); // example task ID
  t.equal(response.status, 200);
  t.match(response.body, {
    id: 2,
    title: "Create a new project",
    description: "Create a new project using Magic",
    completed: false
  });
  t.end();
});

// GET /tasks/:id with invalid id
tap.test("GET /tasks/:id with invalid id", async (t) => {
  const response = await server.get("/tasks/999");
  t.equal(response.status, 404);
  t.end();
});

// PUT /tasks/:id
tap.test("PUT /tasks/:id", async (t) => {
  const updatedTask = {
    title: "Updated Task",
    description: "Updated Task Description",
    completed: true,
    priority: "low"
  };
  const response = await server.put("/tasks/2").send(updatedTask);
  t.equal(response.status, 200);
  t.end();
});

// PUT /tasks/:id with invalid id
tap.test("PUT /tasks/:id with invalid id", async (t) => {
  const updatedTask = {
    title: "Updated Task",
    description: "Updated Task Description",
    completed: true,
    priority: "low"
  };
  const response = await server.put("/tasks/999").send(updatedTask);
  t.equal(response.status, 404);
  t.end();
});

// PUT /tasks/:id with invalid data
tap.test("PUT /tasks/:id with invalid data", async (t) => {
  const updatedTask = {
    title: "",
    description: "Updated Task Description",
    completed: "true"
  };
  const response = await server.put("/tasks/2").send(updatedTask);
  t.equal(response.status, 400);
  t.end();
});

// DELETE /tasks/:id
tap.test("DELETE /tasks/:id", async (t) => {
  const response = await server.delete("/tasks/2");
  t.equal(response.status, 200);
  t.end();
});

// DELETE /tasks/:id with invalid id
tap.test("DELETE /tasks/:id with invalid id", async (t) => {
  const response = await server.delete("/tasks/999");
  t.equal(response.status, 404);
  t.end();
});

tap.teardown(() => {
  process.exit(0);
});
