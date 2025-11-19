# **TASKS API**

Tasks API project built to able you to list and manipulate tasks with the following APIs

PREREQUSITES:

- Do `npm install`
- To start the app, run `npm run start` or `npm start`
- To play around with APIs, import `APICollection.json` file into your Postman

`GET /tasks`

- Provide list of tasks with total count of tasks
- Query params (OPTIONAL)

  - `completed`:`true` or `false`
  - `sort`: `asc` or `desc`

`GET /tasks/:taskId`

- Provides a task which matches the `taskId` path param

`POST /tasks`

- Creates a new task
- The body of request should contain **all** of these
  - `title`: `string` with characters length between 3 and 100
  - `description`: `string` with characters length between 3 and 250
  - `completed`: `boolean`
  - `priority`: `Enum` ('low' | 'medium' | 'high')
- ```Sample Body
  {
        "title": "title of the new task",
        "description": "description of the new task",
        "completed": false, // boolean
        "priority": "low"
  }
  ```

`PUT /tasks/:taskId`

- Updates an existing task, when passing the id of the task to be updated as path param
- The body of request should contain **atleast** **one** of these
  - `title`: `string` with characters length between 3 and 100
  - `description`: `string` with characters length between 3 and 250
  - `completed`: `boolean`
  - `priority`: `Enum` ('low' | 'medium' | 'high')
- ```Sample Body
  {
        "title": "title of the new task",
        "description": "description of the new task",
        "completed": false, // boolean
        "priority": "low"
  }
  ```

`DELETE /tasks/:taskId`

- Removes a task from all tasks which matches the `taskId` path param

`GET /taks/priority/:priority`

- Filters tasks matching the priority
- `priority` param should be one of these
  - high
  - medium
  - low
