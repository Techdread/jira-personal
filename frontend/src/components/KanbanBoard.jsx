import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
  Box,
  Card,
  Typography,
  Grid,
  Paper,
  IconButton,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TaskForm from './TaskForm';
import { useSnackbar } from '../contexts/SnackbarContext';

const STATUSES = ['To Do', 'In Progress', 'Testing', 'Done'];

const priorityColors = {
  Low: '#4caf50',
  Medium: '#ff9800',
  High: '#f44336',
};

const TaskCard = ({ task, provided, onEdit, onDelete }) => (
  <Card
    ref={provided.innerRef}
    {...provided.draggableProps}
    {...provided.dragHandleProps}
    sx={{ p: 2, mb: 2 }}
  >
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        mb: 1,
      }}
    >
      <Typography variant="subtitle1" sx={{ flex: 1 }}>
        {task.title}
      </Typography>
      <Box>
        <IconButton size="small" onClick={() => onEdit(task)}>
          <EditIcon />
        </IconButton>
        <IconButton size="small" onClick={() => onDelete(task.id)}>
          <DeleteIcon />
        </IconButton>
      </Box>
    </Box>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
      {task.description}
    </Typography>
    <Chip
      label={task.priority}
      size="small"
      sx={{
        bgcolor: priorityColors[task.priority],
        color: 'white',
      }}
    />
  </Card>
);

export default function KanbanBoard() {
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const { showSnackbar } = useSnackbar();

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tasks');
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      showSnackbar('Error fetching tasks', 'error');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId) return;

    const task = tasks.find((t) => t.id === draggableId);
    const updatedTask = { ...task, status: destination.droppableId };

    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) throw new Error('Failed to update task');
      
      setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)));
      showSnackbar('Task status updated');
    } catch (error) {
      showSnackbar('Error updating task', 'error');
    }
  };

  const handleDelete = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete task');

      setTasks(tasks.filter((t) => t.id !== taskId));
      showSnackbar('Task deleted');
    } catch (error) {
      showSnackbar('Error deleting task', 'error');
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Grid container spacing={2}>
          {STATUSES.map((status) => (
            <Grid item xs={12} sm={6} md={3} key={status}>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: 'background.paper',
                  minHeight: '70vh',
                }}
              >
                <Typography variant="h6" gutterBottom>
                  {status}
                </Typography>
                <Droppable droppableId={status}>
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      sx={{ minHeight: '100px' }}
                    >
                      {tasks
                        .filter((task) => task.status === status)
                        .map((task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={index}
                          >
                            {(dragProvided) => (
                              <TaskCard
                                task={task}
                                provided={dragProvided}
                                onEdit={setEditTask}
                                onDelete={handleDelete}
                              />
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </DragDropContext>
      {editTask && (
        <TaskForm
          open={Boolean(editTask)}
          onClose={() => setEditTask(null)}
          task={editTask}
          onSubmit={fetchTasks}
        />
      )}
    </>
  );
}
