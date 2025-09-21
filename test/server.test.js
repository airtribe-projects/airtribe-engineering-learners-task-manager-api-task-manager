const tap = require("tap");
const supertest = require("supertest");
const app = require("../dist/app").default;
const server = supertest(app);

tap.test("POST /tasks", async (t) => {
  const newTask = {
    title: "New Task",
    description: "New Task Description",
    completed: false,
  };
  const response = await server.post("/tasks").send(newTask);
  t.equal(response.status, 201);
  t.equal(response.body.success, true);
  t.equal(response.body.status, 201);
  t.equal(response.body.message, "Task created successfully");
  t.hasOwnProp(response.body.data, "id");
  t.hasOwnProp(response.body.data, "title");
  t.hasOwnProp(response.body.data, "description");
  t.hasOwnProp(response.body.data, "completed");
  t.end();
});

tap.test("POST /tasks with invalid data", async (t) => {
  const newTask = {
    title: "New Task",
  };
  const response = await server.post("/tasks").send(newTask);
  t.equal(response.status, 400);
  t.equal(response.body.success, false);
  t.equal(response.body.status, 400);
  t.equal(response.body.message, "Title and description are required");
  t.end();
});

tap.test("GET /tasks", async (t) => {
  const response = await server.get("/tasks");
  t.equal(response.status, 200);
  t.equal(response.body.success, true);
  t.equal(response.body.status, 200);
  t.equal(response.body.message, "Tasks retrieved successfully");
  t.hasOwnProp(response.body.data[0], "id");
  t.hasOwnProp(response.body.data[0], "title");
  t.hasOwnProp(response.body.data[0], "description");
  t.hasOwnProp(response.body.data[0], "completed");
  t.type(response.body.data[0].id, "number");
  t.type(response.body.data[0].title, "string");
  t.type(response.body.data[0].description, "string");
  t.type(response.body.data[0].completed, "boolean");
  t.end();
});

tap.test("GET /tasks/:id", async (t) => {
  const response = await server.get("/tasks/1");
  t.equal(response.status, 200);
  t.equal(response.body.success, true);
  t.equal(response.body.status, 200);
  t.equal(response.body.message, "Task retrieved successfully");
  const expectedTask = {
    id: 1,
    title: "Set up environment",
    description: "Install Node.js, npm, and git",
    completed: true,
  };
  t.match(response.body.data, expectedTask);
  t.end();
});

tap.test("GET /tasks/:id with invalid id", async (t) => {
  const response = await server.get("/tasks/999");
  t.equal(response.status, 404);
  t.equal(response.body.success, false);
  t.equal(response.body.status, 404);
  t.equal(response.body.message, "Task not found");
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
  t.equal(response.body.success, true);
  t.equal(response.body.status, 200);
  t.equal(response.body.message, "Task updated successfully");
  t.hasOwnProp(response.body.data, "id");
  t.hasOwnProp(response.body.data, "title");
  t.hasOwnProp(response.body.data, "description");
  t.hasOwnProp(response.body.data, "completed");
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
  t.equal(response.body.success, false);
  t.equal(response.body.status, 404);
  t.equal(response.body.message, "Task not found");
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
  t.equal(response.body.success, false);
  t.equal(response.body.status, 400);
  t.equal(response.body.message, "Completed must be a boolean value");
  t.end();
});

tap.test("DELETE /tasks/:id", async (t) => {
  const response = await server.delete("/tasks/1");
  t.equal(response.status, 200);
  t.equal(response.body.success, true);
  t.equal(response.body.status, 200);
  t.equal(response.body.message, "Task deleted successfully");
  t.end();
});

tap.test("DELETE /tasks/:id with invalid id", async (t) => {
  const response = await server.delete("/tasks/999");
  t.equal(response.status, 404);
  t.equal(response.body.success, false);
  t.equal(response.body.status, 404);
  t.equal(response.body.message, "Task not found");
  t.end();
});

tap.teardown(() => {
  process.exit(0);
});
