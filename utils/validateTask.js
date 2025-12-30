function validateTask(data) {
  if (!data || typeof data !== "object") return false;

  const { title, description, completed, priority } = data;

  if (typeof title !== "string" || title.trim().length === 0) {
    return false;
  }

  if (typeof description !== "string" || description.trim().length === 0) {
    return false;
  }

  if (completed !== undefined && typeof completed !== "boolean") {
    return false;
  }

  if (
    priority !== undefined &&
    !["low", "medium", "high"].includes(priority)
  ) {
    return false;
  }

  return true;
};


function validatePartialTask(data) {
  if (!data || typeof data !== "object") return false;

  if ("title" in data && (typeof data.title !== "string" || !data.title.trim())) {
    return false;
  }

  if (
    "description" in data &&
    (typeof data.description !== "string" || !data.description.trim())
  ) {
    return false;
  }

  if ("completed" in data && typeof data.completed !== "boolean") {
    return false;
  }

  if (
    "priority" in data &&
    !["low", "medium", "high"].includes(data.priority)
  ) {
    return false;
  }

  return true;
}

module.exports = {
  validateTask,
  validatePartialTask
};

