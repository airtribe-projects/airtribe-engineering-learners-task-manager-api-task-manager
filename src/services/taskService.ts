import { Task, CreateTaskRequest, UpdateTaskRequest, Priority } from '../types/Task';
import tasks from '../data/tasks';

interface TaskFilters {
  completed?: boolean;
  priority?: Priority;
}

interface TaskSortOptions {
  sortBy?: 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

class TaskService {
  private tasks: Task[] = [...tasks];

  getAllTasks(filters?: TaskFilters, sortOptions?: TaskSortOptions): Task[] {
    let filteredTasks = [...this.tasks];

    // Apply filters
    if (filters) {
      if (filters.completed !== undefined) {
        filteredTasks = filteredTasks.filter(task => task.completed === filters.completed);
      }
      if (filters.priority) {
        filteredTasks = filteredTasks.filter(task => task.priority === filters.priority);
      }
    }

    // Apply sorting
    if (sortOptions?.sortBy === 'createdAt') {
      filteredTasks.sort((a, b) => {
        const dateA = a.createdAt.getTime();
        const dateB = b.createdAt.getTime();
        
        if (sortOptions.sortOrder === 'desc') {
          return dateB - dateA; // Newest first
        } else {
          return dateA - dateB; // Oldest first
        }
      });
    }

    return filteredTasks;
  }

  getTasksByPriority(priority: Priority): Task[] {
    return this.tasks.filter(task => task.priority === priority);
  }

  getTaskById(id: number): Task | undefined {
    return this.tasks.find(task => task.id === id);
  }

  createTask(taskData: CreateTaskRequest): Task {
    const newTask: Task = {
      id: Math.max(...this.tasks.map(t => t.id), 0) + 1,
      title: taskData.title,
      description: taskData.description,
      completed: taskData.completed ?? false,
      priority: taskData.priority ?? 'medium',
      createdAt: new Date()
    };
    
    this.tasks.push(newTask);
    return newTask;
  }

  updateTask(id: number, taskData: UpdateTaskRequest): Task | null {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return null;
    }

    const currentTask = this.tasks[taskIndex]!;
    const updatedTask: Task = {
      id: currentTask.id,
      title: taskData.title ?? currentTask.title,
      description: taskData.description ?? currentTask.description,
      completed: taskData.completed ?? currentTask.completed,
      priority: taskData.priority ?? currentTask.priority,
      createdAt: currentTask.createdAt
    };

    this.tasks[taskIndex] = updatedTask;
    return updatedTask;
  }

  deleteTask(id: number): boolean {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return false;
    }

    this.tasks.splice(taskIndex, 1);
    return true;
  }
}

export default new TaskService();
