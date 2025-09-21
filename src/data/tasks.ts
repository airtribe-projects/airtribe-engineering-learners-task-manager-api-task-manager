import { Task } from '../types/Task';

const tasks: Task[] = [
  {
    "id": 1,
    "title": "Set up environment",
    "description": "Install Node.js, npm, and git",
    "completed": true,
    "priority": "high",
    "createdAt": new Date("2024-01-01T10:00:00Z")
  },
  {
    "id": 2,
    "title": "Create a new project",
    "description": "Create a new project using the Express application generator",
    "completed": true,
    "priority": "high",
    "createdAt": new Date("2024-01-01T11:00:00Z")
  },
  {
    "id": 3,
    "title": "Install nodemon",
    "description": "Install nodemon as a development dependency",
    "completed": true,
    "priority": "medium",
    "createdAt": new Date("2024-01-01T12:00:00Z")
  },
  {
    "id": 4,
    "title": "Install Express",
    "description": "Install Express",
    "completed": false,
    "priority": "high",
    "createdAt": new Date("2024-01-02T09:00:00Z")
  },
  {
    "id": 5,
    "title": "Install Mongoose",
    "description": "Install Mongoose",
    "completed": false,
    "priority": "medium",
    "createdAt": new Date("2024-01-02T10:00:00Z")
  },
  {
    "id": 6,
    "title": "Install Morgan",
    "description": "Install Morgan",
    "completed": false,
    "priority": "low",
    "createdAt": new Date("2024-01-02T11:00:00Z")
  },
  {
    "id": 7,
    "title": "Install body-parser",
    "description": "Install body-parser",
    "completed": false,
    "priority": "medium",
    "createdAt": new Date("2024-01-02T12:00:00Z")
  },
  {
    "id": 8,
    "title": "Install cors",
    "description": "Install cors",
    "completed": false,
    "priority": "low",
    "createdAt": new Date("2024-01-03T09:00:00Z")
  },
  {
    "id": 9,
    "title": "Install passport",
    "description": "Install passport",
    "completed": false,
    "priority": "medium",
    "createdAt": new Date("2024-01-03T10:00:00Z")
  },
  {
    "id": 10,
    "title": "Install passport-local",
    "description": "Install passport-local",
    "completed": false,
    "priority": "medium",
    "createdAt": new Date("2024-01-03T11:00:00Z")
  },
  {
    "id": 11,
    "title": "Install passport-local-mongoose",
    "description": "Install passport-local-mongoose",
    "completed": false,
    "priority": "medium",
    "createdAt": new Date("2024-01-03T12:00:00Z")
  },
  {
    "id": 12,
    "title": "Install express-session",
    "description": "Install express-session",
    "completed": false,
    "priority": "low",
    "createdAt": new Date("2024-01-04T09:00:00Z")
  },
  {
    "id": 13,
    "title": "Install connect-mongo",
    "description": "Install connect-mongo",
    "completed": false,
    "priority": "low",
    "createdAt": new Date("2024-01-04T10:00:00Z")
  },
  {
    "id": 14,
    "title": "Install dotenv",
    "description": "Install dotenv",
    "completed": false,
    "priority": "high",
    "createdAt": new Date("2024-01-04T11:00:00Z")
  },
  {
    "id": 15,
    "title": "Install jsonwebtoken",
    "description": "Install jsonwebtoken",
    "completed": false,
    "priority": "medium",
    "createdAt": new Date("2024-01-04T12:00:00Z")
  }
];

export default tasks;
