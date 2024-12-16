const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const dataDir = path.join(__dirname, '..', '..', 'data');
const projectsFile = path.join(dataDir, 'projects.json');
const tasksFile = path.join(dataDir, 'tasks.json');

// Ensure data files exist
async function initDataFiles() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    try {
      await fs.access(projectsFile);
    } catch {
      await fs.writeFile(projectsFile, JSON.stringify({ projects: [] }, null, 2));
    }
  } catch (error) {
    console.error('Error initializing data files:', error);
  }
}

initDataFiles();

// Get all projects
router.get('/', async (req, res) => {
  try {
    const data = await fs.readFile(projectsFile, 'utf8');
    const { projects } = JSON.parse(data);
    res.json(projects);
  } catch (error) {
    console.error('Error reading projects:', error);
    res.status(500).json({ error: 'Error reading projects' });
  }
});

// Create new project
router.post('/', async (req, res) => {
  try {
    const data = await fs.readFile(projectsFile, 'utf8');
    const { projects } = JSON.parse(data);
    
    const newProject = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    projects.push(newProject);
    await fs.writeFile(projectsFile, JSON.stringify({ projects }, null, 2));
    
    res.status(201).json(newProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Error creating project' });
  }
});

// Update project
router.put('/:id', async (req, res) => {
  try {
    const data = await fs.readFile(projectsFile, 'utf8');
    const { projects } = JSON.parse(data);
    
    const index = projects.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const updatedProject = {
      ...projects[index],
      ...req.body,
      id: req.params.id,
      updatedAt: new Date().toISOString(),
    };
    
    projects[index] = updatedProject;
    await fs.writeFile(projectsFile, JSON.stringify({ projects }, null, 2));
    
    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Error updating project' });
  }
});

// Delete project and its tasks
router.delete('/:id', async (req, res) => {
  try {
    // Delete project
    const projectData = await fs.readFile(projectsFile, 'utf8');
    const { projects } = JSON.parse(projectData);
    const filteredProjects = projects.filter(p => p.id !== req.params.id);
    
    if (projects.length === filteredProjects.length) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    await fs.writeFile(projectsFile, JSON.stringify({ projects: filteredProjects }, null, 2));
    
    // Delete associated tasks
    const tasksData = await fs.readFile(tasksFile, 'utf8');
    const { tasks } = JSON.parse(tasksData);
    const filteredTasks = tasks.filter(t => t.projectId !== req.params.id);
    await fs.writeFile(tasksFile, JSON.stringify({ tasks: filteredTasks }, null, 2));
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Error deleting project' });
  }
});

module.exports = router;
