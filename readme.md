1. Welcome to Task manager API

A simple RESTful API built with Node.js and Express.js to manage tasks. This project demonstrates basic CRUD operations & input validation - all using in-memory data storage.

2. Features
- Create, read, update, and delete tasks.
- Filter tasks by completion status.
- Input validation and error handling.

3. Setup Instructions
- click on code & copy the url.
- open terminal, navigate to your project space and enter git clone `copied URL`
- now navigate to the folder using cd task-manager-api...
- now start the server by entering node app.js in terminal.

4. CRUD operations
- Open POSTMAN
- enter the URL - localhost:{port}/tasks
    a. create Task using POST
    - select POST method and choose raw from body tab
    - enter the values for title, description and completed status (optional)
    - click on send.
    - you may create any number of tasks by repeating the above 2 steps.

    b. Retrieve Tasks using GET
    - select GET method and click enter, it should display all the tasks
    - enter specific ID in the URL ../tasks/:id to retrieve task by ID

    c. Invalid inputs
    - test by not entering values for title, description or non boolean value for completed status using POST method and observe the error message

    d. Retrieve tasks by completion status
    - Select GET method and enter URL ../tasks?completed=true, ../tasks?completed=false or an invalid input eg. ../tasks?completed=status and observe the output

    e. Update task
    - Select PUT method and enter the url of the task you want to update
    - enter the details in JSON format and click on send.

    f. Delete task
    - Select DELETE method and enter URL of the task you want to delete.