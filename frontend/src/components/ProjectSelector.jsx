import { useState } from 'react';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Typography,
  IconButton,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CircleIcon from '@mui/icons-material/Circle';
import ProjectForm from './ProjectForm';

export default function ProjectSelector({ 
  projects, 
  selectedProject, 
  onProjectChange,
  onProjectCreated 
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [projectFormOpen, setProjectFormOpen] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProjectSelect = (project) => {
    onProjectChange(project);
    handleClose();
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button
          id="project-selector-button"
          aria-controls={open ? 'project-selector-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          endIcon={<KeyboardArrowDownIcon />}
          sx={{ 
            textTransform: 'none',
            color: 'text.primary',
            '&:hover': { bgcolor: 'action.hover' }
          }}
        >
          {selectedProject ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircleIcon sx={{ color: selectedProject.color, fontSize: 12 }} />
              <Typography variant="subtitle1">
                {selectedProject.name}
              </Typography>
            </Box>
          ) : (
            'Select Project'
          )}
        </Button>
        <IconButton
          size="small"
          onClick={() => setProjectFormOpen(true)}
          sx={{ ml: 1 }}
        >
          <AddIcon />
        </IconButton>
      </Box>

      <Menu
        id="project-selector-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'project-selector-button',
        }}
      >
        {projects.map((project) => (
          <MenuItem 
            key={project.id}
            onClick={() => handleProjectSelect(project)}
            selected={selectedProject?.id === project.id}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircleIcon sx={{ color: project.color, fontSize: 12 }} />
              <Typography>{project.name}</Typography>
            </Box>
          </MenuItem>
        ))}
        {projects.length > 0 && <Divider />}
        <MenuItem onClick={() => {
          setProjectFormOpen(true);
          handleClose();
        }}>
          <AddIcon sx={{ mr: 1, fontSize: 20 }} />
          New Project
        </MenuItem>
      </Menu>

      <ProjectForm
        open={projectFormOpen}
        onClose={() => setProjectFormOpen(false)}
        onSubmit={(newProject) => {
          onProjectCreated(newProject);
          setProjectFormOpen(false);
        }}
      />
    </>
  );
}
