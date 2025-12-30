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

tap.teardown(() => {
  process.exit(0);
});

tap.test("POST /tasks - empty title should fail", async (t) => {
  const response = await server.post("/tasks").send({
    title: "",
    description: "Valid description",
    completed: false
  });

  t.equal(response.status, 400);
  t.end();
});

tap.test("POST /tasks - empty description should fail", async (t) => {
  const response = await server.post("/tasks").send({
    title: "Valid title",
    description: "",
    completed: false
  });

  t.equal(response.status, 400);
  t.end();
});

tap.test("POST /tasks - completed must be boolean", async (t) => {
  const response = await server.post("/tasks").send({
    title: "Valid title",
    description: "Valid description",
    completed: "true"
  });

  t.equal(response.status, 400);
  t.end();
});

tap.test("PUT /tasks/:id - empty title should fail", async (t) => {
  const response = await server.put("/tasks/1").send({
    title: "",
    description: "Updated description",
    completed: true
  });

  t.equal(response.status, 400);
  t.end();
});

tap.test("PUT /tasks/:id - empty description should fail", async (t) => {
  const response = await server.put("/tasks/1").send({
    title: "Updated title",
    description: "",
    completed: true
  });

  t.equal(response.status, 400);
  t.end();
});

tap.test("PUT /tasks/:id - completed must be boolean", async (t) => {
  const response = await server.put("/tasks/1").send({
    title: "Updated title",
    description: "Updated description",
    completed: "false"
  });

  t.equal(response.status, 400);
  t.end();
});

tap.test("PUT /tasks/:id - non-existent ID should return 404", async (t) => {
  const response = await server.put("/tasks/999").send({
    title: "Valid title",
    description: "Valid description",
    completed: true
  });

  t.equal(response.status, 404);
  t.end();
});


tap.test("POST /tasks with priority = high", async (t) => {
  const response = await server.post("/tasks").send({
    title: "High priority task",
    description: "Important task",
    completed: false,
    priority: "high"
  });

  t.equal(response.status, 201);
  t.equal(response.body.priority, "high");
  t.end();
});

tap.test("POST /tasks with priority = low", async (t) => {
  const response = await server.post("/tasks").send({
    title: "Low priority task",
    description: "Less important task",
    completed: true,
    priority: "low"
  });

  t.equal(response.status, 201);
  t.equal(response.body.priority, "low");
  t.end();
});

tap.test("GET /tasks?completed=true filters completed tasks", async (t) => {
  const response = await server.get("/tasks?completed=true");

  t.equal(response.status, 200);
  t.ok(Array.isArray(response.body));

  response.body.forEach(task => {
    t.equal(task.completed, true);
  });

  t.end();
});

tap.test("GET /tasks?completed=false filters incomplete tasks", async (t) => {
  const response = await server.get("/tasks?completed=false");

  t.equal(response.status, 200);
  t.ok(Array.isArray(response.body));

  response.body.forEach(task => {
    t.equal(task.completed, false);
  });

  t.end();
});

tap.test("GET /tasks sorted by createdAt desc", async (t) => {
  const response = await server.get("/tasks?sort=createdAt&order=desc");

  t.equal(response.status, 200);
  t.ok(response.body.length >= 2);

  const first = new Date(response.body[0].createdAt);
  const second = new Date(response.body[1].createdAt);

  t.ok(first >= second);
  t.end();
});

tap.test("GET /tasks/priority/high returns only high priority tasks", async (t) => {
  const response = await server.get("/tasks/priority/high");

  t.equal(response.status, 200);
  t.ok(Array.isArray(response.body));

  response.body.forEach(task => {
    t.equal(task.priority, "high");
  });

  t.end();
});

tap.test("GET /tasks/priority/low returns only low priority tasks", async (t) => {
  const response = await server.get("/tasks/priority/low");

  t.equal(response.status, 200);
  t.ok(Array.isArray(response.body));

  response.body.forEach(task => {
    t.equal(task.priority, "low");
  });

  t.end();
});

tap.test("GET /tasks/priority/invalid should return 400", async (t) => {
  const response = await server.get("/tasks/priority/urgent");

  t.equal(response.status, 400);
  t.end();
});

tap.test("PUT /tasks/:id updates priority", async (t) => {
  // 1️⃣ Create a new task first
  const createRes = await server.post("/tasks").send({
    title: "Task for priority update",
    description: "Initial description",
    completed: false,
    priority: "low"
  });

  t.equal(createRes.status, 201);
  const taskId = createRes.body.id;

  // 2️⃣ Update its priority
  const updateRes = await server.put(`/tasks/${taskId}`).send({
    title: "Updated with priority",
    description: "Updated description",
    completed: true,
    priority: "medium"
  });

  t.equal(updateRes.status, 200);
  t.equal(updateRes.body.priority, "medium");

  t.end();
});

