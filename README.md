# Task Manager API

## Overview
A simple RESTful API for managing tasks with CRUD operations.

## Instructions
1. Install dependencies:  
   `npm install`
2. Start the server:  
   `npm run dev`

## Quick API Test

- **Create:** `POST /tasks`  
  Body: `{ "title": "Task", "description": "Desc", "completed": false }`
- **Get All:** `GET /tasks`
- **Get by ID:** `GET /tasks/1`
- **Update:** `PUT /tasks/1`  
  Body: `{ "title": "Updated", "description": "Updated", "completed": true }`
- **Delete:** `DELETE /tasks/1`

Base URL:http://localhost:3000