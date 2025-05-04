const app = require('express');
const router = app.Router();
const taskController = require('../controllers/tasks');

router.get('/',                         taskController.getTasksList);
router.get('/:id',                      taskController.getTaskDetails);
router.post('/',                        taskController.createTask);
router.put('/:id',                      taskController.updateTask);
router.delete('/:id',                   taskController.deleteTask);

router.get("/priority/:level",          taskController.getTaskByPriority);



module.exports = router;
