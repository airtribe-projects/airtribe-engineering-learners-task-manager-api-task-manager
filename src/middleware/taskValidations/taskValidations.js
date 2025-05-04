const validateTaskId = (req, res, next) => {
    const taskId = parseInt(req.params.id, 10);
    if (Number.isNaN(taskId)) {
        return res.status(400).send({ err: "Task ID should be a number" });
    }
    req.taskId = taskId; // attach parsed ID to request
    next();
}

function validateTaskBody(required = true) {
    return (req, res, next) => {
        const { title, description, completed } = req.body;

        // For POST: all fields must exist
        if (required) {
            if (
                title === undefined ||
                description === undefined ||
                completed === undefined
            ) {
                return res.status(400).send({ err: "All fields (title, description, completed) are required" });
            }
        } else {
            // For PUT: at least one field must exist
            if (title === undefined && description === undefined && completed === undefined) {
                return res.status(400).send({ err: "At least one field must be provided" });
            }
        }

        if (title !== undefined && (typeof title !== "string" || title.trim() === "")) {
            return res.status(400).send({ err: "Title must be a non-empty string" });
        }

        if (description !== undefined && (typeof description !== "string" || description.trim() === "")) {
            return res.status(400).send({ err: "Description must be a non-empty string" });
        }

        if (completed !== undefined && typeof completed !== "boolean") {
            return res.status(400).send({ err: "Completed must be a boolean" });
        }

        next();
    };
}

module.exports = {
    validateTaskId,
    validateTaskBody,
}