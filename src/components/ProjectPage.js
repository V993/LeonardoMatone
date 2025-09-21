// src/components/ProjectPage.js
import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { getProjectById } from '../data';

function ProjectPage() {
  const { id } = useParams();

  // Fetch project data based on the id
  const project = getProjectById(id); // Implement this function

  if (!project) {
    return <Typography variant="h6">Project not found.</Typography>;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        {project.title}
      </Typography>
      {/* Display project details */}
      <Typography variant="body1">{project.fullDescription}</Typography>
      {/* Add more details as needed */}
    </Box>
  );
}

export default ProjectPage;
