// src/App.js
import React from 'react';
import { CssBaseline, Box } from '@mui/material';
import Navbar from './components/Navbar';
import WelcomeSection from './components/WelcomeSection';
import ExperienceSection from './components/ExperienceSection';
import ProjectsSection from './components/ProjectsSection';
import EducationSection from './components/EducationSection';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BlogPage from './components/BlogPage';
import ProjectPage from './components/ProjectPage';

function App() {
  return (
    <Router>
      <CssBaseline />
      <Navbar />
      <Box
        sx={{
          marginLeft: '240px', // Width of the Drawer
          minHeight: '100vh',
          overflowY: 'auto',
          scrollSnapType: 'y mandatory',
          scrollBehavior: 'smooth',
          backgroundColor: 'background.default',
        }}
      >

        <Routes>
          {/* Main Content */}
          <Route
            path="/LeonardoMatone/"
            element={
              <>
                <WelcomeSection />
                <ExperienceSection />
                <ProjectsSection />
                <EducationSection />
              </>
            }
          />
          {/* Blog Page */}
          <Route path="/blog" element={<BlogPage />} />
          {/* Project Page */}
          <Route path="/projects/:id" element={<ProjectPage />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
