import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import { useSnackbar } from '../contexts/SnackbarContext';

const PRIORITIES = ['Low', 'Medium', 'High'];
const STATUSES = ['To Do', 'In Progress', 'Testing', 'Done'];

export default function TaskForm({ open, onClose, task, onSubmit, projectId }) {
  const { showSnackbar } = useSnackbar();
  const [formData, setFormData] = useState(
    task || {
      title: '',
      description: '',
      status: 'To Do',
      priority: 'Medium',
      projectId: projectId,
    }
  );

  useEffect(() => {
    if (!task) {
      setFormData((prev) => ({ ...prev, projectId: projectId }));
    }
  }, [projectId, task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.projectId) {
      showSnackbar('Please select a project first', 'error');
      return;
    }

    try {
      const url = task
        ? `http://localhost:5000/api/tasks/${task.id}`
        : 'http://localhost:5000/api/tasks';

      const response = await fetch(url, {
        method: task ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          projectId: projectId || task?.projectId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error('Failed to save task');

      showSnackbar('Task saved successfully');
      onSubmit?.(); // Call onSubmit to refresh the tasks
      handleClose(); // Close the dialog after successful save
    } catch (error) {
      showSnackbar('Error saving task', 'error');
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      status: 'To Do',
      priority: 'Medium',
      projectId: projectId,
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="task-dialog-title"
      disableEnforceFocus
      disableRestoreFocus
    >
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <DialogTitle id="task-dialog-title">
          {task ? 'Edit Task' : 'New Task'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Title"
            fullWidth
            value={formData.title}
            onChange={handleChange}
            required
            InputProps={{
              id: 'task-title-input',
            }}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
            InputProps={{
              id: 'task-description-input',
            }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="priority-label">Priority</InputLabel>
            <Select
              labelId="priority-label"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              label="Priority"
            >
              {PRIORITIES.map((priority) => (
                <MenuItem key={priority} value={priority}>
                  {priority}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              name="status"
              value={formData.status}
              onChange={handleChange}
              label="Status"
            >
              {STATUSES.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} type="button">
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            {task ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
