const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(
  cors({
    origin: "http://localhost:5173", // React Vite default port
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

let students = [
  { id: 1, name: "Rohan Sharma", email: "rohan@gmail.com", course: "React" },
  { id: 2, name: "Priya Singh", email: "priya@gmail.com", course: "Node.js" },
  { id: 3, name: "Amit Verma", email: "amit@gmail.com", course: "MongoDB" },
];

// Get All
app.get("/students", (req, res) => {
  res.status(200).json(students);
});

// Create
app.post("/students", (req, res) => {
  try {
    const { name, email, course } = req.body;

    if (!name || !email || !course) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newStudent = {
      id: Date.now(),
      name,
      email,
      course,
    };

    students.push(newStudent);

    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ message: "Server error while creating student" });
  }
});

// Update
app.put("/students/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const index = students.findIndex((s) => s.id === id);

    if (index === -1) {
      return res.status(404).json({ message: "Student not found" });
    }

    students[index] = { ...students[index], ...req.body };

    res.json(students[index]);
  } catch (error) {
    res.status(500).json({ message: "Server error while updating student" });
  }
});

// Delete
app.delete("/students/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const exists = students.some((s) => s.id === id);

    if (!exists) {
      return res.status(404).json({ message: "Student not found" });
    }

    students = students.filter((s) => s.id !== id);

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error while deleting student" });
  }
});

//404 Handler

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

//Server

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});