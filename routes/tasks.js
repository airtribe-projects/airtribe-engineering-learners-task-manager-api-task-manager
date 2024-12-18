const express = require('express');
const router = express.Router();

const tasks = [
    {
       id: 100,
       taskName: "Prepare Monthly Report",
       description: "Compile and review the financial data for the month of November.",
       startDate: "2024-12-01T09:00:00Z",
       endDate: "2024-12-05T17:00:00Z",
       priority: "High",
       status: "In Progress"
    },
    {
       id: 101,
       taskName: "Team Meeting",
       description: "Discuss project updates and roadblocks with the team.",
       startDate: "2024-12-03T10:00:00Z",
       endDate: "2024-12-03T11:00:00Z",
       priority: "Medium",
       status: "Scheduled"
    },
    {
       id: 102,
       taskName: "Code Review",
       description: "Review the new feature branch and provide feedback.",
       startDate: "2024-12-02T13:00:00Z",
       endDate: "2024-12-02T15:00:00Z",
       priority: "High",
       status: "Pending"
    },
    {
       id: 103,
       taskName: "Submit Proposal",
       description: "Finalize and submit the project proposal to the client.",
       startDate: "2024-12-04T08:00:00Z",
       endDate: "2024-12-04T17:00:00Z",
       priority: "High",
       status: "Completed"
    },
    {
       id: 104,
       taskName: "Database Backup",
       description: "Perform a routine backup of the production database.",
       startDate: "2024-12-06T00:00:00Z",
       endDate: "2024-12-06T02:00:00Z",
       priority: "Low",
       status: "Pending"
    }
 ];

 // get all Tasks: /api/tasks (GET)
router.get('/api/tasks',(req, res) => {
    res.send(tasks)
})

// get single Tasks: /api/tasks/:id (GET)
router.get('/api/tasks/:id',(req, res) => {
   const id = req.params.id;
   const task = tasks.find(task => task.id === parseInt(id));
   if (!task){
      return res
         .status(404)
         .send({message: "AHHH!!! NO TASK FOUND"})
   }
   res.send(task);
})

// create New Tasks: /api/tasks/ (POST)
router.post('/api/tasks/',(req, res) => {
   const task = req.body;
   task.id = 100 + tasks.length + 1;
   tasks.push(task);
   res.send(task);
})

// update Tasks: /api/tasks/:id (PUT)
router.put('/api/tasks/:id',(req, res) => {
   const id = req.params.id;
   const task = tasks.find(task => task.id === parseInt(id));
   if (!task) {
      return res
         .status(404)
         .send({ message: "AHHH!!! NO TASK FOUND. UNABLE TO UPDATE." });
   }
   task.taskName = req.body.taskName;
   task.description = req.body.description;
   task.startDate = req.body.startDate;
   task.endDate = req.body.endDate;
   task.priority = req.body.priority;
   task.status = req.body.status;
   res.send(task);
});

//update particular value using PATCH

router.patch('/api/tasks/:id',(req, res) => {
    const id = req.params.id;
    const task = tasks.find(task => task.id === parseInt(id));
    if (!task) {
       return res
          .status(404)
          .send({ message: "AHHH!!! NO TASK FOUND. UNABLE TO UPDATE." });
    }
    task.status = req.body.status;
    res.send(task);
 });

// delete Tasks: /api/tasks/:id (DELETE)*/
router.delete('/api/tasks/:id', (req, res) => { 
   const id = req.params.id;
   if (!id) {
      return res.status(400).send({ message: "Task ID is required." });
   }
   const task = tasks.find(task => task.id === parseInt(id));
   if (!task) {
      return res.status(404).send({ message: "AHHH!!! NO TASK FOUND. UNABLE TO DELETE." });
   }
   const index = tasks.indexOf(task);
   tasks.splice(index, 1); 
   res.send({ message: "Task deleted successfully!", deletedTask: task });
});

module.exports = router;