import { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  TextField,
  Box,
  IconButton,
  InputAdornment,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import TaskForm from './TaskForm';
import ProjectSelector from './ProjectSelector';

export default function Header({ onSearch, onProjectChange, selectedProject: propSelectedProject }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [openTaskForm, setOpenTaskForm] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (propSelectedProject) {
      setSelectedProject(propSelectedProject);
    }
  }, [propSelectedProject]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/projects');
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      console.log('Fetched projects:', data);
      setProjects(data);
      if (data.length > 0 && !selectedProject) {
        const initialProject = data[0];
        setSelectedProject(initialProject);
        onProjectChange?.(initialProject);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch?.(value, selectedProject?.id);
  };

  const handleProjectChange = (project) => {
    console.log('Project selected:', project);
    setSelectedProject(project);
    onProjectChange?.(project);
    setSearchTerm('');
    onSearch?.('', project.id);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" component="div" sx={{ mr: 4 }}>
            Personal Jira
          </Typography>

          <ProjectSelector
            projects={projects}
            selectedProject={selectedProject}
            onProjectChange={handleProjectChange}
            onProjectCreated={(newProject) => {
              setProjects([...projects, newProject]);
              handleProjectChange(newProject);
            }}
          />

          <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
          
          <Box sx={{ flexGrow: 1 }}>
            <TextField
              size="small"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={handleSearch}
              sx={{ 
                backgroundColor: 'background.paper',
                borderRadius: 1,
                width: { xs: '100%', sm: '300px' }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenTaskForm(true)}
            disabled={!selectedProject}
          >
            New Task
          </Button>
        </Toolbar>
      </AppBar>

      {openTaskForm && (
        <TaskForm
          open={openTaskForm}
          onClose={() => setOpenTaskForm(false)}
          projectId={selectedProject?.id}
        />
      )}
    </>
  );
}
