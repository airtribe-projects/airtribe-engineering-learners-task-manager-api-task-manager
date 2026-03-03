# Task Manager API

Simple Express-based API for managing tasks and user preferences. Implements user registration/login with JWT authentication and allows authenticated users to manage their news preferences.

## Overview

This project demonstrates basic backend functionality built with Node.js and Express. It maintains in-memory data stores for tasks and users, including hashed passwords and preferences. Authentication is handled using JSON Web Tokens (JWT).

## Installation
npm install


## Running the Server
node app.js

The server listens on port `3000` by default.

## API Endpoints

### Tasks (no auth required)

- `GET /tasks` - list all tasks
- `GET /tasks/:id` - retrieve a task by ID
- `POST /tasks` - create a task
  - Body: `{ title: string, description: string, completed: boolean }`
- `PUT /tasks/:id` - update a task
  - Body same as POST
- `DELETE /tasks/:id` - delete a task

### Authentication

- `POST /register` - register new user
  - Body: `{ email: string, password: string }`
- `POST /login` - login and receive JWT
  - Body: `{ email: string, password: string }`
  - Response: `{ token: string }`

### Preferences (requires JWT)

Include header `Authorization: Bearer <token>`

- `GET /preferences` - get current user's preferences
- `PUT /preferences` - update preferences
  - Body may include `categories` and/or `languages` arrays.

## Input Validation & Error Handling

- Email must be valid format.
- Password must be at least 6 characters.
- Preferences fields must be arrays if provided.
- Appropriate 400/401/404 error codes returned for invalid input or unauthorized access.

## Testing

Tests are written using `tap` and `supertest`.

npm test

