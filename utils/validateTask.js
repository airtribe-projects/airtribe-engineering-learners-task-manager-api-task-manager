const validPriorities = ['low', 'medium', 'high'];

function validateTask(data, isUpdate = false) {
  const { title, description, completed, priority } = data;

  if (!isUpdate || title !== undefined) {
    if (!title || typeof title !== 'string') {
      return 'Title is required and must be a string';
    }
  }

  if (!isUpdate || description !== undefined) {
    if (!description || typeof description !== 'string') {
      return 'Description is required and must be a string';
    }
  }

  if (completed !== undefined && typeof completed !== 'boolean') {
    return 'Completed must be a boolean';
  }

  if (priority !== undefined && !validPriorities.includes(priority)) {
    return 'Priority must be low, medium, or high';
  }

  return null;
}

module.exports = validateTask;
