const tasks = [];
let nextId = 1;

module.exports = {
  tasks,
  getNextAndIncrementId() {
    return nextId++;
  },
};
