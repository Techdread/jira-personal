import { useState, useCallback } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Container, Box } from '@mui/material'
import theme from './theme'
import KanbanBoard from './components/KanbanBoard'
import Header from './components/Header'
import { SnackbarProvider } from './contexts/SnackbarContext'

function App() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSearch = (term, projectId) => {
    console.log('Search:', term, 'Project ID:', projectId);
    setSearchTerm(term);
  };

  const handleProjectChange = (project) => {
    console.log('Project changed:', project);
    setSelectedProject(project);
    setSearchTerm(''); // Clear search when changing projects
  };

  const handleTaskAdded = useCallback(() => {
    // Force a refresh of the KanbanBoard
    setRefreshKey(prev => prev + 1);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
          <Header 
            onSearch={handleSearch} 
            onProjectChange={handleProjectChange}
            selectedProject={selectedProject}
            onTaskAdded={handleTaskAdded}
          />
          <Container maxWidth="xl" sx={{ py: 4 }}>
            <KanbanBoard 
              key={refreshKey}
              projectId={selectedProject?.id}
              searchTerm={searchTerm}
            />
          </Container>
        </Box>
      </SnackbarProvider>
    </ThemeProvider>
  )
}

export default App
