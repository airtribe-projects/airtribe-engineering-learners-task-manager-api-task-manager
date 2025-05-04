const tasks = [
  {
    id: 1,
    title: "Set up project",
    description: "Initialize Node.js project and install dependencies",
    completed: true,
    priority: "medium",
  },
  {
    id: 2,
    title: "Create server",
    description: "Set up Express server in index.js",
    completed: true,
    priority: "high",
  },
  {
    id: 3,
    title: "Define routes",
    description: "Create basic task routes",
    completed: false,
    priority: "low",
  },
  {
    id: 4,
    title: "Implement controller",
    description: "Create logic for CRUD operations",
    completed: false,
    priority: "medium",
  },
  {
    id: 5,
    title: "Test endpoints",
    description: "Use Postman or curl to test all endpoints",
    completed: false,
    priority: "high",
  },
];

module.exports = tasks;
