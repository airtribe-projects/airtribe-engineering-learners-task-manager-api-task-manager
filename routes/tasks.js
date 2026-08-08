const express = require('express');
const router = express.Router();

const tasks = [
    {
        "id": 1,
        "title": "Set up environment",
        "description": "Install Node.js, npm, and git",
        "completed": true
    },
    {
        "id": 2,
        "title": "Create a new project",
        "description": "Create a new project using the Express application generator",
        "completed": true
    },
    {
        "id": 3,
        "title": "Install nodemon",
        "description": "Install nodemon as a development dependency",
        "completed": true
    },
    {
        "id": 4,
        "title": "Install Express",
        "description": "Install Express",
        "completed": false
    },
    {
        "id": 5,
        "title": "Install Mongoose",
        "description": "Install Mongoose",
        "completed": false
    },
    {
        "id": 6,
        "title": "Install Morgan",
        "description": "Install Morgan",
        "completed": false
    },
    {
        "id": 7,
        "title": "Install body-parser",
        "description": "Install body-parser",
        "completed": false
    },
    {
        "id": 8,
        "title": "Install cors",
        "description": "Install cors",
        "completed": false
    },
    {
        "id": 9,
        "title": "Install passport",
        "description": "Install passport",
        "completed": false
    },
    {
        "id": 10,
        "title": "Install passport-local",
        "description": "Install passport-local",
        "completed": false
    },
    {
        "id": 11,
        "title": "Install passport-local-mongoose",
        "description": "Install passport-local-mongoose",
        "completed": false
    },
    {
        "id": 12,
        "title": "Install express-session",
        "description": "Install express-session",
        "completed": false
    },
    {
        "id": 13,
        "title": "Install connect-mongo",
        "description": "Install connect-mongo",
        "completed": false
    },
    {
        "id": 14,
        "title": "Install dotenv",
        "description": "Install dotenv",
        "completed": false
    },
    {
        "id": 15,
        "title": "Install jsonwebtoken",
        "description": "Install jsonwebtoken",
        "completed": false
    }
]


router.get('/tasks', (req, res) => {
    const id = parseInt(req.query.id);
    const task = tasks.find(t => t.id === id);
    if (id) {
        res.status(200).json({
            success: true,
            data: task
        })
    }
    else {
        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        })
    }
})
router.post('/tasks', (req, res) => {
    const data = req.body;
    const id = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;
    if (data.title) {
        tasks.push({
            id: id, title: data.title,
            description: data.description || "",
            completed: data.completed || false
        });

        res.status(201).json(
            {
                "successCode": "Your entry is submitted ThankYou So much ",
                "updatedData": tasks
            }
        );
    }
    else {
        res.status(400).json(
            {
                "errorCode": "SEND_COMPLETE_DATA",
                "Description": "Error adding data with missing title"
            }
        );
    }
})

router.put('/tasks', (req, res) => {
    const id = parseInt(req.query.id);
    if (isNaN(id)) {

        return res.status(400).json({
            "INVALID_ID": "Please probvide a valid ID (Number only)"
        });
    }
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
        return res.status(404).json({
            "INVALID_ID": "Requested ID not  found"
        });
    }

    const { title, description, checked } = req.body;
    const existingData = tasks[taskIndex];



    const updatedData = {
        id: id,
        title: title ?? existingData?.title,
        checked: checked ?? existingData?.checked,
        description: description ?? existingData?.description
    };

    tasks[taskIndex] = updatedData;
    res.status(200).json(({
        "added": updatedData,
        "tasks is": tasks
    }))
})

router.delete('/tasks', (req, res) => {
    const id =Number(req.query.id);
    const deleteIndex = tasks.findIndex(t => t.id === id);
    if (isNaN(id)) {
        return res.status(400).json({
            "NOT_A_NUMBER": "They ID you have is not in valid format"
        })
    }
    if (deleteIndex === -1) {
        return res.status(404).json({
            "WRONG_KEY_DELETED": "They ID you have given didn't exist"
        })
    }
    const deletedTask = tasks.splice(deleteIndex, 1);
    console.log(deletedTask,"thjis data is coming");
    res.status(200).json({
        "deleted": id,
        "updatedValues":tasks
    });


})



console.log("Task router is loaded successfully");
module.exports = router;