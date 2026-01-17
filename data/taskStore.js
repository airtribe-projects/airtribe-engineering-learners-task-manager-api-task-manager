let tasks = [];
let nextId = 1;

module.exports = {
  tasks,
  getNextId: () => nextId++
};
