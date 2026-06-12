const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const taskSchema = [
    {
        "id": 1,
        "title": "Create a new project",
        "description": "Create a new project using Magic",
        "completed": false
    }
]


app.get("/tasks", (req, res) => {
    try {
        const task = taskSchema

        if (task.length === 0) {
            return res.status(404).json({ message: "Tasks not found" })
        }

        return res.status(200).json({ data: task, message: "Fetch successfully" })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
})

app.get("/tasks/:id", (req, res) => {

    try {
        const id = req.params.id
        const task = taskSchema.find((task) => task.id === Number(id))

        if (!task) {
            return res.status(200).json({ message: "Task not foung" })
        }

        return res.status(200).json({ data: task, message: "Data fetch successfully" })

    } catch (error) {
        console.log("error", error)
        return res.status(500).json({ message: "Internal server error" })
    }
})

app.post("/tasks", (req, res) => {
    try {
        const data = req.body;
        if (!data) {
            return res.status(404).json({ message: "Send valid data" })
        }

        taskSchema.push(data)

        return res.status(201).json({ message: "Data successfully created" })
    } catch (error) {
        console.log("eeror", error)
        return res.status(500).json({ message: "Internal server error" })
    }
})

app.put("/tasks/:id", (req, res) => {
    try {
        const data = req.body;
        const id = Number(req.params.id);
        if (!data || Object.keys(data).length === 0 || !id) {
            return res.status(400).json({ message: "Invalid data" })
        }

        const index = taskSchema.findIndex((task) => task.id === id)
        if (index === -1) {
            return res.status(404).json({ message: "Task not found" })
        }

        taskSchema[index] = { ...taskSchema[index], ...data, id: id };

        return res.status(200).json({ message: "Updated successfully" })
    } catch (error) {
        console.error("error", error)
        return res.status(500).json({ message: "Internal server error" })
    }
})

app.delete("/tasks/:id", (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!id) {
            return res.status(400).json({ message: "Invalid id" })
        }

        const index = taskSchema.findIndex((task) => task.id === id)
        if (index === -1) {
            return res.status(404).json({ message: "Task not found" })
        }

        taskSchema.splice(index, 1)

        return res.status(200).json({ message: "Deleted successfully" })
    } catch (error) {
        console.error("error", error)
        return res.status(500).json({ message: "Internal server error" })
    }
})

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;