# Task Tracking and Management System API

A secure, collaborative backend system designed for team productivity, task coordination, and workspace organization. Built with **Node.js**, **Express.js**, **Prisma ORM**, and **SQLite**, with real-time updates via **Socket.io** and AI features using **Google Gemini**.

---

## 🚀 Key Features

*   **Secure Authentication**: JWT-based session security with bcrypt password hashing.
*   **Team & Collaboration**: Create teams, assign member roles (Owner/Admin/Member), and manage team permissions.
*   **Task CRUD + Search & Filters**: Create, update, assign, complete, and delete tasks. Fully customizable filters (by status, priority, assignee, team), sorting (by due date or creation date), and full-text keyword searches (on title and description).
*   **Access Control**: strict data scopes—users can only query tasks they created, are assigned to, or that belong to teams they belong to.
*   **Comments & File Attachments**: Collaborate on tasks with instant comments and multipart file attachments (stored securely and downloaded via streams).
*   **Real-time Notifications**: Instant updates to clients via WebSockets (Socket.io) when tasks are created, completed, assigned, or commented on.
*   **Generative AI Integration**: Automatically drafts detailed markdown task descriptions from simple titles and summarizes task/comment activity logs using the **Gemini 1.5 Flash** model.

---

## 🛠️ Tech Stack & Dependencies

*   **Runtime**: Node.js v20.x
*   **Framework**: Express.js
*   **Database**: SQLite via Prisma ORM
*   **Authentication**: JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
*   **File Handling**: `multer` (multipart/form-data)
*   **Real-Time Service**: `socket.io`
*   **AI SDK**: `@google/generative-ai`
*   **Input Validation**: `zod` schema validator

---

## 📂 Project Structure

```
taskTrackingSystem/
├── prisma/
│   ├── dev.db                # SQLite database (generated during migration)
│   └── schema.prisma         # Prisma data models
├── src/
│   ├── config/
│   │   ├── database.js       # Prisma client initialization
│   │   └── socket.js         # Socket.io connection & notification helpers
│   ├── controllers/
│   │   ├── ai.controller.js  # Task details AI summaries & descriptions
│   │   ├── attachment.controller.js # File uploads & download streams
│   │   ├── auth.controller.js # Registrations & logins
│   │   ├── comment.controller.js # Task commenting
│   │   ├── task.controller.js # Task lifecycle operations & permissions
│   │   └── team.controller.js # Team membership & roles
│   ├── middlewares/
│   │   ├── auth.middleware.js # Extract and verify JWT Bearer token
│   │   ├── error.middleware.js # Standard JSON error formatter
│   │   ├── upload.middleware.js # Multer configurations
│   │   └── validation.middleware.js # Zod parsing middleware
│   ├── routes/
│   │   ├── ai.routes.js
│   │   ├── attachment.routes.js
│   │   ├── auth.routes.js
│   │   ├── comment.routes.js
│   │   ├── task.routes.js
│   │   └── team.routes.js
│   ├── services/
│   │   └── ai.service.js      # Gemini Flash integration & templates fallback
│   ├── utils/
│   │   ├── customErrors.js    # Operational API error classes
│   │   └── schemas.js         # Input validation schemas
│   ├── app.js                 # App routes and middleware mounting
│   └── server.js              # Server entry point
├── tests/
│   └── test-api.js           # Full E2E integration test suite
├── uploads/                   # Destination folder for uploaded attachments
├── .env                       # Environment configuration
└── package.json
```

---

## ⚙️ Quick Start

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (v20+ recommended).

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
A `.env` file has been created at the root of the workspace. If you want to enable Google Gemini AI description generators and summarizers, supply your API key:
```env
PORT=3000
DATABASE_URL="file:./dev.db"
JWT_SECRET="tasktracking_jwt_secret_key_change_this_in_production_12345"
JWT_EXPIRES_IN="24h"
GEMINI_API_KEY="YOUR_GEMINI_API_KEY" # Optional, leaves fallback templates if empty
```

### 4. Run database migrations
Create the local SQLite database and generate the Prisma client:
```bash
npx prisma migrate dev --name init
```

### 5. Launch the application
To start the local development server with auto-reloading (`nodemon`):
```bash
npm run dev
```
The application will boot on `http://localhost:3000`.

---

## 🧪 Running Integration Tests

The project includes a comprehensive end-to-end integration test suite using Node's native `fetch` client to verify every endpoint.

To execute the tests (which automatically cleans test DB collections, runs sequential registrations, creations, assignments, uploads, downloads, AI generations, and cleans up):
```bash
npm test
```

---

## 📋 REST API Endpoints Reference

All endpoints (except Authentication) require a valid JWT passed in the request headers: `Authorization: Bearer <your-jwt-token>`.

### Authentication & Profiles
| Route | Method | Payload (JSON) | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | `{ "email", "password", "name" }` | Registers a new account and returns JWT |
| `/api/auth/login` | `POST` | `{ "email", "password" }` | Logs in and returns JWT token |
| `/api/users/profile` | `GET` | *None* | Retrieves current profile |
| `/api/users/profile` | `PUT` | `{ "name"?, "email"?, "password"? }` | Updates profile attributes |

### Teams Management
| Route | Method | Payload (JSON) | Description |
| :--- | :--- | :--- | :--- |
| `/api/teams` | `POST` | `{ "name", "description"? }` | Creates a new team (creator becomes OWNER) |
| `/api/teams` | `GET` | *None* | Lists teams the user is part of |
| `/api/teams/:teamId` | `GET` | *None* | Get details, members list, and tasks of a team |
| `/api/teams/:teamId/members` | `POST` | `{ "email", "role"? }` | Invites a member to team (Owner only) |
| `/api/teams/:teamId/members/:userId` | `DELETE` | *None* | Removes member from team |

### Tasks Lifecycle
| Route | Method | Query / Payload (JSON) | Description |
| :--- | :--- | :--- | :--- |
| `/api/tasks` | `POST` | `{ "title", "description"?, "status"?, "priority"?, "dueDate"?, "assigneeId"?, "teamId"? }` | Creates task (validates memberships if team task) |
| `/api/tasks` | `GET` | Query parameters: `status`, `priority`, `assigneeId`, `teamId`, `search`, `sortBy`, `sortOrder` | List and search tasks user is authorized to access |
| `/api/tasks/:taskId` | `GET` | *None* | Retrieves detailed task with comments and files |
| `/api/tasks/:taskId` | `PUT` | `{ "title"?, "description"?, "status"?, "priority"?, "dueDate"?, "assigneeId"?, "teamId"? }` | Modifies task attributes |
| `/api/tasks/:taskId` | `DELETE` | *None* | Deletes task (Creator or Team owner only) |
| `/api/tasks/:taskId/complete` | `PATCH` | *None* | Marks a task as COMPLETED |
| `/api/tasks/:taskId/assign` | `PATCH` | `{ "assigneeId" }` | Reassigns task |

### Comments & Attachments
| Route | Method | Payload / Form-Data | Description |
| :--- | :--- | :--- | :--- |
| `/api/tasks/:taskId/comments` | `POST` | `{ "content" }` | Comments on a task |
| `/api/tasks/:taskId/comments` | `GET` | *None* | Lists comments on a task |
| `/api/tasks/:taskId/attachments` | `POST` | Form Data: File under key `file` | Uploads task file |
| `/api/tasks/:taskId/attachments` | `GET` | *None* | Lists attachments |
| `/api/attachments/:attachmentId/download` | `GET` | *None* | Secure download stream for files |

### Generative AI Integration
| Route | Method | Payload (JSON) | Description |
| :--- | :--- | :--- | :--- |
| `/api/ai/generate-description` | `POST` | `{ "title", "briefInput"? }` | Generates a formatted markdown task draft using Gemini |
| `/api/ai/tasks/:taskId/summarize` | `POST` | *None* | Summarizes task progress & comments using Gemini |

---

## 🔌 WebSocket Events Reference

Connect socket clients to `ws://localhost:3000` with query token:
```javascript
const socket = io("ws://localhost:3000", {
  query: { token: "your-jwt-token" }
});
```

### Server-to-Client Events
*   `taskAssigned`: Dispatched to assignee when a task is assigned to them.
*   `taskCreated`: Dispatched to team room when a task is added.
*   `taskUpdated`: Dispatched to team/assignees when attributes change.
*   `taskCompleted`: Dispatched when task status changes to `COMPLETED`.
*   `commentAdded`: Dispatched when a comment is posted.
*   `taskDeleted`: Dispatched when task is deleted.
