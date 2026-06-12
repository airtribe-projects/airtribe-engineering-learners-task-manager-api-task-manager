const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


let tasks = [
    {
        id: 1,
        title: "Create a new project",
        description: "Create a new project using Magic",
        completed: false,
        priority: "medium",
        createdAt: new Date().toISOString(),
    },
];

let nextId = 2;

function parseId(raw) {
    const id = Number(raw);
    if (!Number.isInteger(id) || id <= 0) {
        return { error: "ID must be a positive integer" };
    }
    return { id };
}

function validateTaskBody(data, requireAll = false) {
    const errors = [];
    const validPriorities = ["low", "medium", "high"];

    if (requireAll && (data.title === undefined || data.title === null)) {
        errors.push("title is required");
    }
    if (data.title !== undefined) {
        if (typeof data.title !== "string" || data.title.trim() === "") {
            errors.push("title must be a non-empty string");
        } else if (data.title.trim().length > 100) {
            errors.push("title must be 100 characters or fewer");
        }
    }

    if (requireAll && (data.description === undefined || data.description === null)) {
        errors.push("description is required");
    }
    if (data.description !== undefined) {
        if (typeof data.description !== "string" || data.description.trim() === "") {
            errors.push("description must be a non-empty string");
        } else if (data.description.trim().length > 500) {
            errors.push("description must be 500 characters or fewer");
        }
    }

    if (data.completed !== undefined && typeof data.completed !== "boolean") {
        errors.push("completed must be a boolean");
    }

    if (data.priority !== undefined) {
        if (!validPriorities.includes(data.priority)) {
            errors.push(`priority must be one of: ${validPriorities.join(", ")}`);
        }
    }

    return errors;
}


app.get("/tasks", (req, res) => {
    try {
        let filteredTasks = [...tasks];

        // Filter by completion status
        if (req.query.completed !== undefined) {
            const completedValue = req.query.completed === "true";
            filteredTasks = filteredTasks.filter((t) => t.completed === completedValue);
        }

        // Sort by creation date (newest first)
        filteredTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        if (filteredTasks.length === 0) {
            return res.status(200).json({ data: [], message: "No tasks found" });
        }
        return res.status(200).json({ data: filteredTasks, message: "Tasks fetched successfully" });
    } catch (error) {
        console.error("GET /tasks error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});


app.get("/tasks/priority/:level", (req, res) => {
    try {
        const level = req.params.level.toLowerCase();
        const validPriorities = ["low", "medium", "high"];

        if (!validPriorities.includes(level)) {
            return res.status(400).json({ message: `Priority must be one of: ${validPriorities.join(", ")}` });
        }

        const filteredTasks = tasks.filter((t) => t.priority === level);
        filteredTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        if (filteredTasks.length === 0) {
            return res.status(200).json({ data: [], message: `No tasks found with priority: ${level}` });
        }
        return res.status(200).json({ data: filteredTasks, message: `Tasks with ${level} priority fetched successfully` });
    } catch (error) {
        console.error("GET /tasks/priority/:level error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});


app.get("/tasks/:id", (req, res) => {
    try {
        const { id, error } = parseId(req.params.id);
        if (error) {
            return res.status(400).json({ message: error });
        }

        const task = tasks.find((t) => t.id === id);
        if (!task) {
            return res.status(404).json({ message: `Task with id ${id} not found` });
        }

        return res.status(200).json({ data: task, message: "Task fetched successfully" });
    } catch (error) {
        console.error("GET /tasks/:id error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});


app.post("/tasks", (req, res) => {
    try {
        const data = req.body;


        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({ message: "Request body cannot be empty" });
        }


        const allowed = new Set(["title", "description", "completed", "priority"]);
        const unknown = Object.keys(data).filter((k) => !allowed.has(k));
        if (unknown.length > 0) {
            return res.status(400).json({ message: `Unknown fields: ${unknown.join(", ")}` });
        }


        const errors = validateTaskBody(data, true);
        if (errors.length > 0) {
            return res.status(400).json({ message: "Validation failed", errors });
        }

        const newTask = {
            id: nextId++,
            title: data.title.trim(),
            description: data.description.trim(),
            completed: data.completed ?? false,
            priority: data.priority ?? "medium",
            createdAt: new Date().toISOString(),
        };

        tasks.push(newTask);

        return res.status(201).json({ data: newTask, message: "Task created successfully" });
    } catch (error) {
        console.error("POST /tasks error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});


app.put("/tasks/:id", (req, res) => {
    try {
        const { id, error: idError } = parseId(req.params.id);
        if (idError) {
            return res.status(400).json({ message: idError });
        }

        const data = req.body;


        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({ message: "Request body cannot be empty" });
        }


        const allowed = new Set(["title", "description", "completed", "priority"]);
        const unknown = Object.keys(data).filter((k) => !allowed.has(k));
        if (unknown.length > 0) {
            return res.status(400).json({ message: `Unknown fields: ${unknown.join(", ")}` });
        }


        const errors = validateTaskBody(data, false);
        if (errors.length > 0) {
            return res.status(400).json({ message: "Validation failed", errors });
        }

        const index = tasks.findIndex((t) => t.id === id);
        if (index === -1) {
            return res.status(404).json({ message: `Task with id ${id} not found` });
        }


        tasks[index] = {
            ...tasks[index],
            ...(data.title !== undefined && { title: data.title.trim() }),
            ...(data.description !== undefined && { description: data.description.trim() }),
            ...(data.completed !== undefined && { completed: data.completed }),
            ...(data.priority !== undefined && { priority: data.priority }),
            id,
        };

        return res.status(200).json({ data: tasks[index], message: "Task updated successfully" });
    } catch (error) {
        console.error("PUT /tasks/:id error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});


app.delete("/tasks/:id", (req, res) => {
    try {
        const { id, error } = parseId(req.params.id);
        if (error) {
            return res.status(400).json({ message: error });
        }

        const index = tasks.findIndex((t) => t.id === id);
        if (index === -1) {
            return res.status(404).json({ message: `Task with id ${id} not found` });
        }

        tasks.splice(index, 1);

        return res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error("DELETE /tasks/:id error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.method} ${req.path} not found` });
});

app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ message: "Internal server error" });
});

app.listen(port, (err) => {
    if (err) {
        return console.log("Something bad happened", err);
    }
    console.log(`Server is listening on ${port}`);
});

module.exports = app;