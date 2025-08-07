## In Memory CRUD Operations with Node & Express JS
A simple RESTful API for managing tasks, built with Node.js and Express. This project uses a in-memory data to run without any database configuration.

## Prerequisites
 - [NodeJs](https://nodejs.org/en) v16 or later.
 - Configuring Express JS, you can run the following command to get it into your code `>npm install express`.
 - To enable to run the command as `npm run dev` install nodemon to install it run the following command `npm install nodemon --save-dev`.
The server will be running at  [localhost://3000](http://localhost:3000) You should see the message Server is listening on port 3000 in your terminal.

## API Endpoints
|HTTP Method | Endpoint | Description |  Params |
|----------|----------|----------|----------|
| GET    | /movies   | Retrieve all movies.   | N/A
| POST    | /movies   | Create a new movie.   | {"title": "Kenny", "director": "Clayton Jacobson", "year": 2006}
|PUT	|/movies/:id	|Update an existing task by its Id.| {id:2} {"title": "Karthikeya", "director": "Chandoo Mondeti", "year": 2019}
|DELETE	|/movies/:id	|Delete a task by its Id.| {id:1}

- when you run with postman you can see the results

![image](https://github.com/user-attachments/assets/548987bb-0e98-4370-af7c-8ca6d2b6acf5)
