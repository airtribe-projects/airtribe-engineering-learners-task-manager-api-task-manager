const PRIORITIES = ['low', 'medium', 'high'];

const FIELD_RULES = [
    {
        name: 'title',
        label: 'Title',
        required: true,
        validate: v => typeof v === 'string' && v.trim() !== '',
        message: 'Title cannot be empty'
    },
    {
        name: 'description',
        label: 'Description',
        required: true,
        validate: v => typeof v === 'string' && v.trim() !== '',
        message: 'Description cannot be empty'
    },
    {
        name: 'completed',
        label: 'Completed',
        required: true,
        validate: v => typeof v === 'boolean',
        message: 'Completed must be true or false'
    },
    {
        name: 'priority',
        label: 'Priority',
        required: false,
        validate: v => PRIORITIES.includes(v),
        message: 'Priority must be one of: low, medium, or high'
    }
];

function validateTask(fields, requireAll = false) {
    const errors = {};
    for (const rule of FIELD_RULES) {
        const value = fields[rule.name];
        if (value === undefined) {
            if (requireAll && rule.required) errors[rule.name] = `${rule.label} is required`;
        } else if (!rule.validate(value)) {
            errors[rule.name] = rule.message;
        }
    }
    return errors;
}

module.exports = { PRIORITIES, validateTask };
