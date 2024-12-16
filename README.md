# Personal Jira-like Tracker App

A personal task management application with Kanban board functionality, built with React and Node.js.

## Features

- Multiple project support with custom colors
- Kanban board with drag-and-drop functionality
- Create, edit, and delete tasks
- Set task priority and status
- Search tasks within projects
- Dark theme UI
- Responsive design

## Tech Stack

- Frontend: React with Vite, Material UI
- Backend: Node.js with Express
- Data Storage: JSON file

## Getting Started

1. Install dependencies:
   ```bash
   npm run install-all
   ```

2. Set up data files:
   ```bash
   # Create the data directory
   mkdir data
   
   # Copy sample data files (optional)
   cp backend/sample-data/projects.json data/
   cp backend/sample-data/tasks.json data/
   ```

   If you don't copy the sample data, empty data files will be created automatically when you start the server.

3. Start the development servers:
   ```bash
   npm run dev
   ```

This will start both the backend server (port 5000) and frontend development server (port 5173).

## Project Structure

- `/frontend` - React frontend application
  - `/src/components` - React components
  - `/src/contexts` - React context providers
- `/backend` - Express backend server
  - `/routes` - API route handlers
  - `/sample-data` - Example data files
- `/data` - JSON file storage (created at runtime)
