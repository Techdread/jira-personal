import { useState, useEffect } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Container, Box } from '@mui/material'
import theme from './theme'
import KanbanBoard from './components/KanbanBoard'
import TaskForm from './components/TaskForm'
import Header from './components/Header'
import { SnackbarProvider } from './contexts/SnackbarContext'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
          <Header />
          <Container maxWidth="xl" sx={{ py: 4 }}>
            <KanbanBoard />
          </Container>
        </Box>
      </SnackbarProvider>
    </ThemeProvider>
  )
}

export default App
