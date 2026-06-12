const tasks = [
  {
    id: 1,
    title: "Learn Express",
    description: "Build REST API",
    completed: false,
    priority: "high",
    createdAt: new Date().toISOString(),
  },
];

let nextId = 2;

module.exports = {
  tasks,
  getNextId: () => nextId++,
};
