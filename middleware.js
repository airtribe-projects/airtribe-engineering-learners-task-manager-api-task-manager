function validateTaskInput(req, res, next) {
    const { title, description, completed } = req.body;

    // Check if required fields are present
    if (!title || !description) {
        return res.status(400).send({ message: 'Title and description are required' });
    }

    // Check if the title and description are strings
    if (typeof title !== 'string' || typeof description !== 'string') {
        return res.status(400).send({ message: 'Title and description must be strings' });
    }

    // Check character limits for title and description
    if (title.length > 100) {
        return res.status(400).send({ message: 'Title cannot exceed 100 characters' });
    }
    if (description.length > 500) {
        return res.status(400).send({ message: 'Description cannot exceed 500 characters' });
    }

    // Check if completed is a boolean (if provided)
    if (completed !== undefined && typeof completed !== 'boolean') {
        return res.status(400).send({ message: 'Completed must be a boolean' });
    }

    //proceed to the next middleware
    next();
}

module.exports = { validateTaskInput };
