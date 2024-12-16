import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from '@mui/material';
import { ChromePicker } from 'react-color';
import { useSnackbar } from '../contexts/SnackbarContext';

export default function ProjectForm({ open, onClose, project, onSubmit }) {
  const { showSnackbar } = useSnackbar();
  const [formData, setFormData] = useState(
    project || {
      name: '',
      description: '',
      color: '#2196f3',
    }
  );
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = project 
        ? `http://localhost:5000/api/projects/${project.id}`
        : 'http://localhost:5000/api/projects';
        
      const response = await fetch(url, {
        method: project ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      });
      
      if (!response.ok) throw new Error('Failed to save project');
      
      const savedProject = await response.json();
      showSnackbar('Project saved successfully');
      onSubmit?.(savedProject);
      handleClose();
    } catch (error) {
      showSnackbar('Error saving project', 'error');
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      color: '#2196f3',
    });
    setShowColorPicker(false);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm" 
      fullWidth
      aria-labelledby="project-dialog-title"
    >
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <DialogTitle id="project-dialog-title">
          {project ? 'Edit Project' : 'New Project'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Project Name"
            fullWidth
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange}
          />
          <Box sx={{ mt: 2 }}>
            <Button
              onClick={() => setShowColorPicker(!showColorPicker)}
              sx={{
                bgcolor: formData.color,
                color: 'white',
                '&:hover': {
                  bgcolor: formData.color,
                  opacity: 0.9,
                },
              }}
            >
              Select Color
            </Button>
            {showColorPicker && (
              <Box sx={{ mt: 2, position: 'relative' }}>
                <ChromePicker
                  color={formData.color}
                  onChange={(color) => setFormData(prev => ({ ...prev, color: color.hex }))}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {project ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
