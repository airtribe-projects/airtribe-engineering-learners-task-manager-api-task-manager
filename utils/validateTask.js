const validateTask = (data, isUpdate = false) => {
  const { title, description, completed ,priority} = data;

  if (!isUpdate) {
    if (!title || !description) {
      return 'Title and description are required';
    }
  }

  if (title !== undefined && title.trim() === '') {
    return 'Title cannot be empty';
  }

  if (description !== undefined && description.trim() === '') {
    return 'Description cannot be empty';
  }

  if (completed !== undefined && typeof completed !== 'boolean') {
    return 'Completed must be a boolean';
  }

   const allowed = ['low', 'medium', 'high'];
  if (priority !== undefined && !allowed.includes(priority)) {
    return 'Priority must be low, medium, or high';
  }
  return null;
};

module.exports = validateTask;