
const validateField = (field, value) => {
    switch (field) {
        case 'title':
        case 'description':
            return typeof value === 'string' && value.trim() !== '';
        case 'completed':
            return typeof value === 'boolean';
        case 'priority':
            return ['low', 'medium', 'high'].includes(value);
        default:
            return false;
    }
};

// validation middleware
const validateTask = (isPartial = false) => (req, res, next) => {
    const { title, description, completed, priority } = req.body;

    // for POST
    const requiredFields = { title, description, completed };

    // for PUT: only fields in the req
    const fieldsToValidate = isPartial ? req.body : requiredFields;

    for (const [field, value] of Object.entries(fieldsToValidate)) {
        if (!validateField(field, value)) {
            return res.status(400).json({
                message: `Invalid or missing "${field}".`,
            });
        }
    }

    next();
};

module.exports = validateTask;
