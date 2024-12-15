import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  TextField,
  Box,
  IconButton,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import TaskForm from './TaskForm';

export default function Header({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [openTaskForm, setOpenTaskForm] = useState(false);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch?.(value);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 4 }}>
            Personal Jira
          </Typography>
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
          >
            New Task
          </Button>
        </Toolbar>
      </AppBar>
      <TaskForm open={openTaskForm} onClose={() => setOpenTaskForm(false)} />
    </>
  );
}
