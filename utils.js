const validateTask = (title, description, completed) => {

    // title as string 
    if (typeof title !== 'string') {
        return false;
    }
    // description as string
    if (typeof description !== 'string') {
        return false;
    }
    // completed as boolean
    if (typeof completed !== 'boolean') {
        return false;
    }

    if (!title || !description) {
        return false;  // false means invalid task data
    }
    return true; // true means valid task data
};

module.exports = {
    validateTask
};
