This is an API for task manager. In which we can manage our tasks. We can see all the tasks, get a specific task, create a new task or update an existing task and delete a task that we no longer need.


Setup instructions

  Step 1 - Initialize node in your repository (npm init).
 
  Step 2 - Install Express and other necessary npm packages (npm install express).
 
  Step 3 - Install dev dependencies like nodemon (npm install nodemon --save-dev).
 
  Step 4 - Now, you can write necessary endpoints for your API.

API Endpoints

  1 - get("/tasks) - This endpoint will get all the task from your database.
  
  2 - get("/tasks/:id" - This endpoint will get you any specific task with task id.
  
  3 - post("tasks") - This endpoint is used to create a new task and will save in you database file.
  
  4 - put("/tasks/:id") - This endpoint will help you to update existing task with the help of task id.
  
  5 - delete("/tasks:/id") - This endpoint is used to delete a specific task.
