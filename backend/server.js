const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
fs.mkdir(dataDir, { recursive: true }).catch(console.error);
const tasksFile = path.join(dataDir, 'tasks.json');

// Initialize tasks.json if it doesn't exist
async function initTasksFile() {
    try {
        await fs.access(tasksFile);
    } catch {
        await fs.writeFile(tasksFile, JSON.stringify([], null, 2));
    }
}

// API Routes
app.get('/api/tasks', async (req, res) => {
    try {
        const data = await fs.readFile(tasksFile, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: 'Error reading tasks' });
    }
});

app.post('/api/tasks', async (req, res) => {
    try {
        const data = await fs.readFile(tasksFile, 'utf8');
        const tasks = JSON.parse(data);
        const newTask = {
            id: Date.now().toString(),
            ...req.body,
            createdAt: new Date().toISOString()
        };
        tasks.push(newTask);
        await fs.writeFile(tasksFile, JSON.stringify(tasks, null, 2));
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ error: 'Error creating task' });
    }
});

app.put('/api/tasks/:id', async (req, res) => {
    try {
        const data = await fs.readFile(tasksFile, 'utf8');
        const tasks = JSON.parse(data);
        const taskIndex = tasks.findIndex(task => task.id === req.params.id);
        
        if (taskIndex === -1) {
            return res.status(404).json({ error: 'Task not found' });
        }

        tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
        await fs.writeFile(tasksFile, JSON.stringify(tasks, null, 2));
        res.json(tasks[taskIndex]);
    } catch (error) {
        res.status(500).json({ error: 'Error updating task' });
    }
});

app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const data = await fs.readFile(tasksFile, 'utf8');
        const tasks = JSON.parse(data);
        const filteredTasks = tasks.filter(task => task.id !== req.params.id);
        
        if (filteredTasks.length === tasks.length) {
            return res.status(404).json({ error: 'Task not found' });
        }

        await fs.writeFile(tasksFile, JSON.stringify(filteredTasks, null, 2));
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error deleting task' });
    }
});

// Initialize and start server
initTasksFile().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(console.error);
