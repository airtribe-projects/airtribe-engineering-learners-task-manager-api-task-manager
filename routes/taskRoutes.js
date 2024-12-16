const express = require('express');
const { getTasks, createTask, getTaskById, deletTask, updateTask } = require('../controllers/taskController');
const router = express.Router();

router.get('/',getTasks );
router.post('/',createTask );
router.get('/:id',getTaskById );
router.put('/:id',updateTask );
router.delete('/:id', deletTask);

module.exports = router;
