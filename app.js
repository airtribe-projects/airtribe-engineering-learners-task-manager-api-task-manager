//? Still using express , we live in a cruel world...
//? i also made my own router that is faster than express with hono, but still... i guess ill make your in memory tasks manager with express...

const express = require("express");
const consola = require("consola");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const tasksFilePath = path.join(__dirname, "task.json");

//! Bruh , tbh , i couldve done this with hono.js ... please use hono next time... express 4 is slow

function readTasks() {
	const raw = fs.readFileSync(tasksFilePath, "utf8");
	const data = JSON.parse(raw);
	return Array.isArray(data.tasks) ? data.tasks : [];
}

function writeTasks(tasks) {
	const payload = { tasks };
	fs.writeFileSync(tasksFilePath, JSON.stringify(payload, null, 2), "utf8");
}

function isValidPriority(value) {
	if (typeof value !== "string") return false;
	const v = value.toLowerCase();
	return v === "low" || v === "medium" || v === "high";
}

function validateTaskPayload(body) {
	if (!body) return { valid: false };
	const { title, description, completed, priority } = body;
	if (typeof title !== "string") return { valid: false };
	if (typeof description !== "string") return { valid: false };
	// Reject empty or whitespace-only strings
	if (title.trim().length === 0) return { valid: false };
	if (description.trim().length === 0) return { valid: false };
	if (typeof completed !== "boolean") return { valid: false };
	if (priority !== undefined && !isValidPriority(priority)) return { valid: false };
	return { valid: true };
}

app.get("/tasks", (req, res) => {
	let tasks = readTasks();
	// Filtering by completed query param
	if (typeof req.query.completed === "string") {
		const q = req.query.completed.toLowerCase();
		if (q === "true" || q === "false") {
			const desired = q === "true";
			tasks = tasks.filter((t) => t.completed === desired);
		}
	}
	// Sorting by creation date
	if (req.query.sort === "createdAt") {
		const order = (req.query.order || "asc").toLowerCase();
		tasks = tasks.slice().sort((a, b) => {
			const aTime = a.createdAt ? Date.parse(a.createdAt) : 0;
			const bTime = b.createdAt ? Date.parse(b.createdAt) : 0;
			return order === "desc" ? bTime - aTime : aTime - bTime;
		});
	}
	res.status(200).json(tasks);
});

app.get("/tasks/:id", (req, res) => {
	const id = Number(req.params.id);
	const tasks = readTasks();
	const task = tasks.find((t) => t.id === id);
	if (!task) return res.sendStatus(404);
	res.status(200).json(task);
});

app.post("/tasks", (req, res) => {
	const validation = validateTaskPayload(req.body);
	if (!validation.valid) return res.sendStatus(400);
	const tasks = readTasks();
	const maxId = tasks.reduce((max, t) => Math.max(max, t.id), 0);
	const newTask = {
		id: maxId + 1,
		title: req.body.title,
		description: req.body.description,
		completed: req.body.completed,
		priority: (req.body.priority || "low").toLowerCase(),
		createdAt: new Date().toISOString(),
	};
	tasks.push(newTask);
	writeTasks(tasks);
	res.status(201).json(newTask);
});

app.put("/tasks/:id", (req, res) => {
	const id = Number(req.params.id);
	const validation = validateTaskPayload(req.body);
	if (!validation.valid) return res.sendStatus(400);
	const tasks = readTasks();
	const index = tasks.findIndex((t) => t.id === id);
	if (index === -1) return res.sendStatus(404);
	const existing = tasks[index];
	tasks[index] = {
		id,
		title: req.body.title,
		description: req.body.description,
		completed: req.body.completed,
		priority: req.body.priority ? req.body.priority.toLowerCase() : existing.priority || "low",
		createdAt: existing.createdAt || new Date().toISOString(),
	};
	writeTasks(tasks);
	res.status(200).json(tasks[index]);
});

app.get("/tasks/priority/:level", (req, res) => {
	const level = String(req.params.level || "").toLowerCase();
	if (!isValidPriority(level)) return res.sendStatus(400);
	const tasks = readTasks().filter((t) => (t.priority || "low").toLowerCase() === level);
	res.status(200).json(tasks);
});

app.delete("/tasks/:id", (req, res) => {
	const id = Number(req.params.id);
	const tasks = readTasks();
	const index = tasks.findIndex((t) => t.id === id);
	if (index === -1) return res.sendStatus(404);
	tasks.splice(index, 1);
	writeTasks(tasks);
	res.sendStatus(200);
});

app.listen(port, (err) => {
	if (err) {
		return console.log("Something bad happened", err);
	}
	consola.box(` Made in 10 minutes by : https://aryank.space/`);

	consola.success(`Server is listening on ${port}`);
});

module.exports = app;
