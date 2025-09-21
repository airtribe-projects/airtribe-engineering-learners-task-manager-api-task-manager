import { Request, Response } from 'express';
import { Task, CreateTaskRequest, UpdateTaskRequest, ApiResponse, Priority } from '../types/Task';
import taskService from '../services/taskService';

export const getAllTasks = (req: Request, res: Response): void => {
  try {
    const { completed, priority, sortBy, sortOrder } = req.query;
    
    // Parse filters
    const filters: any = {};
    if (completed !== undefined) {
      filters.completed = completed === 'true';
    }
    if (priority && ['low', 'medium', 'high'].includes(priority as string)) {
      filters.priority = priority as Priority;
    }
    
    // Parse sort options
    const sortOptions: any = {};
    if (sortBy === 'createdAt') {
      sortOptions.sortBy = 'createdAt';
      if (sortOrder === 'desc' || sortOrder === 'asc') {
        sortOptions.sortOrder = sortOrder;
      } else {
        sortOptions.sortOrder = 'asc'; // Default to ascending
      }
    }

    const tasks = taskService.getAllTasks(filters, sortOptions);
    const response: ApiResponse<Task[]> = {
      success: true,
      status: 200,
      message: 'Tasks retrieved successfully',
      data: tasks
    };
    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      status: 500,
      message: 'Internal server error'
    };
    res.status(500).json(response);
  }
};

export const getTasksByPriority = (req: Request, res: Response): void => {
  try {
    const priority = req.params.level as Priority;
    
    if (!['low', 'medium', 'high'].includes(priority)) {
      const response: ApiResponse = {
        success: false,
        status: 400,
        message: 'Invalid priority level. Must be low, medium, or high'
      };
      res.status(400).json(response);
      return;
    }

    const tasks = taskService.getTasksByPriority(priority);
    const response: ApiResponse<Task[]> = {
      success: true,
      status: 200,
      message: `Tasks with ${priority} priority retrieved successfully`,
      data: tasks
    };
    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      status: 500,
      message: 'Internal server error'
    };
    res.status(500).json(response);
  }
};

export const getTaskById = (req: Request, res: Response): void => {
  try {
    const taskId = parseInt(req.params.id as string);
    
    if (isNaN(taskId)) {
      const response: ApiResponse = {
        success: false,
        status: 400,
        message: 'Invalid task ID'
      };
      res.status(400).json(response);
      return;
    }

    const task = taskService.getTaskById(taskId);
    
    if (!task) {
      const response: ApiResponse = {
        success: false,
        status: 404,
        message: 'Task not found'
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse<Task> = {
      success: true,
      status: 200,
      message: 'Task retrieved successfully',
      data: task
    };
    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      status: 500,
      message: 'Internal server error'
    };
    res.status(500).json(response);
  }
};

export const createTask = (req: Request<{}, {}, CreateTaskRequest>, res: Response): void => {
  try {
    const { title, description, completed, priority } = req.body;

    if (!title || !description) {
      const response: ApiResponse = {
        success: false,
        status: 400,
        message: 'Title and description are required'
      };
      res.status(400).json(response);
      return;
    }

    if (priority && !['low', 'medium', 'high'].includes(priority)) {
      const response: ApiResponse = {
        success: false,
        status: 400,
        message: 'Priority must be low, medium, or high'
      };
      res.status(400).json(response);
      return;
    }

    const newTask = taskService.createTask({ 
      title, 
      description, 
      completed: completed ?? false,
      priority: priority ?? 'medium'
    });
    
    const response: ApiResponse<Task> = {
      success: true,
      status: 201,
      message: 'Task created successfully',
      data: newTask
    };
    res.status(201).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      status: 500,
      message: 'Internal server error'
    };
    res.status(500).json(response);
  }
};

export const updateTask = (req: Request<{ id: string }, {}, UpdateTaskRequest>, res: Response): void => {
  try {
    const taskId = parseInt(req.params.id as string);
    
    if (isNaN(taskId)) {
      const response: ApiResponse = {
        success: false,
        status: 400,
        message: 'Invalid task ID'
      };
      res.status(400).json(response);
      return;
    }

    const { title, description, completed, priority } = req.body;

    if (completed !== undefined && typeof completed !== 'boolean') {
      const response: ApiResponse = {
        success: false,
        status: 400,
        message: 'Completed must be a boolean value'
      };
      res.status(400).json(response);
      return;
    }

    if (priority && !['low', 'medium', 'high'].includes(priority)) {
      const response: ApiResponse = {
        success: false,
        status: 400,
        message: 'Priority must be low, medium, or high'
      };
      res.status(400).json(response);
      return;
    }

    const updateData: UpdateTaskRequest = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (completed !== undefined) updateData.completed = completed;
    if (priority !== undefined) updateData.priority = priority;

    const updatedTask = taskService.updateTask(taskId, updateData);
    
    if (!updatedTask) {
      const response: ApiResponse = {
        success: false,
        status: 404,
        message: 'Task not found'
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse<Task> = {
      success: true,
      status: 200,
      message: 'Task updated successfully',
      data: updatedTask
    };
    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      status: 500,
      message: 'Internal server error'
    };
    res.status(500).json(response);
  }
};

export const deleteTask = (req: Request, res: Response): void => {
  try {
    const taskId = parseInt(req.params.id as string);
    
    if (isNaN(taskId)) {
      const response: ApiResponse = {
        success: false,
        status: 400,
        message: 'Invalid task ID'
      };
      res.status(400).json(response);
      return;
    }

    const deleted = taskService.deleteTask(taskId);
    
    if (!deleted) {
      const response: ApiResponse = {
        success: false,
        status: 404,
        message: 'Task not found'
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse = {
      success: true,
      status: 200,
      message: 'Task deleted successfully'
    };
    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      status: 500,
      message: 'Internal server error'
    };
    res.status(500).json(response);
  }
};
