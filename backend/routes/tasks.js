const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const dataDir = path.join(__dirname, '..', '..', 'data');
const tasksFile = path.join(dataDir, 'tasks.json');

// Ensure data files exist with correct format
async function initDataFiles() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    try {
      const data = await fs.readFile(tasksFile, 'utf8');
      const parsed = JSON.parse(data);
      
      if (Array.isArray(parsed)) {
        await fs.writeFile(tasksFile, JSON.stringify({ tasks: parsed }, null, 2));
      } else if (!parsed.tasks) {
        await fs.writeFile(tasksFile, JSON.stringify({ tasks: [] }, null, 2));
      }
    } catch (error) {
      await fs.writeFile(tasksFile, JSON.stringify({ tasks: [] }, null, 2));
    }
  } catch (error) {
    console.error('Error initializing data files:', error);
  }
}

initDataFiles();

// Get tasks with optional project filter and search
router.get('/', async (req, res) => {
  try {
    const data = await fs.readFile(tasksFile, 'utf8');
    const fileData = JSON.parse(data);
    let tasks = fileData.tasks || [];
    
    // Filter by project if projectId is provided
    if (req.query.projectId) {
      console.log('Filtering by project ID:', req.query.projectId);
      tasks = tasks.filter(task => {
        console.log('Task project ID:', task.projectId);
        return task.projectId && task.projectId.toString() === req.query.projectId.toString();
      });
      console.log('Filtered tasks:', tasks.length);
    }

    // Filter by search term if provided
    if (req.query.search) {
      const searchTerm = req.query.search.toLowerCase();
      tasks = tasks.filter(task => 
        (task.title && task.title.toLowerCase().includes(searchTerm)) ||
        (task.description && task.description.toLowerCase().includes(searchTerm))
      );
    }
    
    res.json(tasks);
  } catch (error) {
    console.error('Error reading tasks:', error);
    res.status(500).json({ error: 'Error reading tasks', details: error.message });
  }
});

// Create new task
router.post('/', async (req, res) => {
  try {
    const data = await fs.readFile(tasksFile, 'utf8');
    const fileData = JSON.parse(data);
    const tasks = fileData.tasks || [];
    
    const newTask = {
      id: Date.now().toString(),
      ...req.body,
      projectId: req.body.projectId.toString(), // Ensure projectId is a string
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    tasks.push(newTask);
    await fs.writeFile(tasksFile, JSON.stringify({ tasks }, null, 2));
    
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Error creating task' });
  }
});

// Update task
router.put('/:id', async (req, res) => {
  try {
    const data = await fs.readFile(tasksFile, 'utf8');
    const fileData = JSON.parse(data);
    const tasks = fileData.tasks || [];
    
    const index = tasks.findIndex(t => t.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const updatedTask = {
      ...tasks[index],
      ...req.body,
      id: req.params.id,
      projectId: req.body.projectId.toString(), // Ensure projectId is a string
      updatedAt: new Date().toISOString(),
    };
    
    tasks[index] = updatedTask;
    await fs.writeFile(tasksFile, JSON.stringify({ tasks }, null, 2));
    
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Error updating task' });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const data = await fs.readFile(tasksFile, 'utf8');
    const fileData = JSON.parse(data);
    const tasks = fileData.tasks || [];
    
    const filteredTasks = tasks.filter(t => t.id !== req.params.id);
    if (tasks.length === filteredTasks.length) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    await fs.writeFile(tasksFile, JSON.stringify({ tasks: filteredTasks }, null, 2));
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Error deleting task' });
  }
});

module.exports = router;
