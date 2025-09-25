// src/App.js
import React, { useEffect, useCallback, useState } from 'react';
import { CssBaseline, Box } from '@mui/material';
import Navbar from './components/Navbar';
import WelcomeSection from './components/WelcomeSection';
import ExperienceSection from './components/ExperienceSection';
import ProjectsSection from './components/ProjectsSection';
import AboutSection from './components/AboutSection';
import EducationSection from './components/EducationSection';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import BlogPage from './components/BlogPage';
import ProjectPage from './components/ProjectPage';
import { scrollToHash, scrollToTop, getScrollContainer, scrollElementIntoView } from './utils/scroll';

const HomeSections = ({ heroCollapsed, onHeroCollapseChange }) => {
  useEffect(() => {
    onHeroCollapseChange(false);

    return () => {
      onHeroCollapseChange(true);
    };
  }, [onHeroCollapseChange]);

  return (
    <>
      <WelcomeSection
        heroCollapsed={heroCollapsed}
        onHeroCollapseChange={onHeroCollapseChange}
      />
      <Box
        sx={{
          opacity: heroCollapsed ? 1 : 0,
          pointerEvents: heroCollapsed ? 'auto' : 'none',
          transform: heroCollapsed ? 'translateY(0)' : 'translateY(60px)',
          transition: 'opacity 520ms ease, transform 520ms ease',
          pt: heroCollapsed ? { xs: 80, md: 90 } : 0,
        }}
      >
        <AboutSection navOffset={heroCollapsed} />
        <EducationSection navOffset={heroCollapsed} />
        <ExperienceSection navOffset={heroCollapsed} />
        <ProjectsSection navOffset={heroCollapsed} />
      </Box>
    </>
  );
};

const BlogRoute = ({ onHeroCollapseChange }) => {
  useEffect(() => {
    onHeroCollapseChange(true);
  }, [onHeroCollapseChange]);

  return <BlogPage />;
};

const ProjectRoute = ({ onHeroCollapseChange }) => {
  useEffect(() => {
    onHeroCollapseChange(true);
  }, [onHeroCollapseChange]);

  return <ProjectPage />;
};

const SECTION_IDS = ['about', 'education', 'experience', 'projects'];

function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash && scrollToHash(hash)) {
      return;
    }

    scrollToTop();
  }, [pathname, hash]);

  return null;
}

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;
  const [heroCollapsed, setHeroCollapsed] = useState(() => pathname !== '/');
  const [activeSection, setActiveSection] = useState(null);

  const handleHeroCollapseChange = useCallback((collapsed) => {
    setHeroCollapsed((prev) => (prev === collapsed ? prev : collapsed));
  }, []);

  useEffect(() => {
    const pendingSection = location.state?.scrollToSection;
    if (pathname !== '/' || !pendingSection) {
      return undefined;
    }

    if (typeof window === 'undefined') {
      navigate(pathname, { replace: true, state: null });
      return undefined;
    }

    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 12;

    const attemptScroll = () => {
      if (cancelled) {
        return;
      }

      const element = document.getElementById(pendingSection);
      if (element) {
        scrollElementIntoView(element);
        navigate(pathname, { replace: true, state: null });
        return;
      }

      if (attempts < maxAttempts) {
        attempts += 1;
        window.requestAnimationFrame(attemptScroll);
      } else {
        scrollToTop();
        navigate(pathname, { replace: true, state: null });
      }
    };

    attemptScroll();

    return () => {
      cancelled = true;
    };
  }, [location.state, navigate, pathname]);

  useEffect(() => {
    if (pathname !== '/') {
      setActiveSection(null);
      return undefined;
    }

    const container = getScrollContainer();
    if (!container) {
      setActiveSection(null);
      return undefined;
    }

    const getSections = () => SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean);

    let frame = null;

    const updateActiveSection = () => {
      frame = null;
      const sections = getSections();

      if (!sections.length) {
        setActiveSection(null);
        return;
      }

      const paddingValue = (() => {
        try {
          const computed = window.getComputedStyle(container);
          const value = computed?.scrollPaddingTop || computed?.scrollPadding || '0';
          const parsed = parseFloat(value);
          return Number.isFinite(parsed) ? parsed : 0;
        } catch (error) {
          return 0;
        }
      })();

      const scrollPosition = container.scrollTop + paddingValue + 1;
      let current = null;

      for (const section of sections) {
        if (scrollPosition >= section.offsetTop) {
          current = `#${section.id}`;
        } else {
          break;
        }
      }

      setActiveSection((prev) => (prev === current ? prev : current));
    };

    const scheduleUpdate = () => {
      if (frame !== null) {
        return;
      }
      frame = window.requestAnimationFrame(updateActiveSection);
    };

    scheduleUpdate();

    container.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      container.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [pathname, heroCollapsed]);

  return (
    <>
      <Navbar heroCollapsed={heroCollapsed} activeSection={activeSection} />
      <ScrollToHash />
      <Box
        component="main"
        id="main-content"
        sx={{
          minHeight: '100vh',
          height: '100vh',
          overflowY: 'auto',
          overflowX: 'visible',
          // scroll snapping disabled site-wide
          scrollBehavior: 'smooth',
          backgroundColor: 'background.default',
          pt: 0,
          // Full-width container; sections handle their own left offset when navbar is visible
          pr: 0,
          scrollPaddingTop: { xs: '120px', md: '140px' },
          boxSizing: 'border-box',
          transition: 'margin 320ms ease, width 320ms ease',
        }}
      >
        <Routes>
          <Route
            path="/"
            element={
              <HomeSections
                heroCollapsed={heroCollapsed}
                onHeroCollapseChange={handleHeroCollapseChange}
              />
            }
          />
          <Route
            path="/blog"
            element={<BlogRoute onHeroCollapseChange={handleHeroCollapseChange} />}
          />
          <Route
            path="/projects/:id"
            element={<ProjectRoute onHeroCollapseChange={handleHeroCollapseChange} />}
          />
        </Routes>
      </Box>
    </>
  );
}

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <CssBaseline />
      <AppContent />
    </Router>
  );
}

export default App;
