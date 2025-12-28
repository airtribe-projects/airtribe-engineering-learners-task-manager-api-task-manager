// this is a simple in-memory data store for tasks
let tasks = []
let nextId = 1

// GET /tasks: Retrieve all tasks
// Added filtering by completed and sorting by creation date
export const getAllTasks = ({ completed, sortByDate }) => {
    let result = [...tasks]

    // Filtering: Filter by completed
    if (completed !== undefined) {
        result = result.filter(task => task.completed === completed)
    }

    // Sorting: Sort by creation date
    if (sortByDate) {
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    }
    return result
}

// GET /tasks/:id: Retrieve a specific task by its ID
export const getTaskById = (id) => {
    return tasks.find(task => task.id === id)
}

// GET /tasks/priority/:priority: Retrieve tasks by priority
export const getTasksByPriority = (priority) => {
    return tasks.filter(task => task.priority === priority)
}

// POST /tasks: Create a new task with the required fields (title, description, completed)
export const createTask = ({ title, description, completed=false, priority }) => {
    const newTask = {
        id: nextId++,
        title,
        description,
        completed,
        priority,
        createdAt: new Date().toISOString()
    }

    tasks.push(newTask)
    return newTask
}

// PUT /tasks/:id: Update an existing task by its ID
export const updateTask = (id, updatedData) => {
    const taskIndex = tasks.findIndex(task => task.id === id)

    if (taskIndex === -1) return null

    tasks[taskIndex] = {
        ...tasks[taskIndex],
        ...updatedData
    }

    return tasks[taskIndex]
}

// DELETE /tasks/:id: Delete a task by its ID
export const deleteTask = (id) => {
    const taskIndex = tasks.findIndex(task => task.id === id)

    if (taskIndex === -1) return false

    tasks.splice(taskIndex, 1)
    return true
}
