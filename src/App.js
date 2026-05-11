// src/App.js
import React, { useEffect, useMemo, useState } from 'react';
import { CssBaseline, Box, IconButton } from '@mui/material';
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
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme, useMediaQuery } from '@mui/material';

// Background:
const overlayDataUri =
  `url("data:image/svg+xml,${encodeURIComponent(`
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'>
  <defs>
    <style>
      text {
        opacity:.18;
        font-family: ui-monospace, Menlo, Consolas, monospace;
        font-weight: 200;
      }
      .vine { fill:none; stroke:rgba(34,139,34,.55); stroke-width:1.2 }
      .leaf { fill:rgba(46,139,87,.38) }
    </style>
    <pattern id='bits' width='10' height='10' patternUnits='userSpaceOnUse'>
      <text x='0' y='6' font-size='8'>0100110010011010</text>
    </pattern>
  </defs>
  <rect width='40' height='100' fill='url(#bits)'/>
  <path class='vine' d='M10,100 C15,80 12,60 18,40 C24,25 20,10 26,0'/>
  <ellipse class='leaf' cx='18' cy='40' rx='6' ry='3' transform='rotate(-20 18 40)'/>
  <ellipse class='leaf' cx='22' cy='70' rx='7' ry='3.5' transform='rotate(20 22 70)'/>
  <ellipse class='leaf' cx='14' cy='85' rx='5' ry='2.5' transform='rotate(-10 14 85)'/>
  <path class='vine' d='M30,100 C28,80 34,60 31,40 C28,25 33,10 30,0'/>
  <ellipse class='leaf' cx='30' cy='55' rx='7' ry='3.5' transform='rotate(30 30 55)'/>
  <ellipse class='leaf' cx='34' cy='20' rx='6' ry='3' transform='rotate(-30 34 20)'/>
</svg>`)}")`;

const baseGradientLayers = [
  "radial-gradient(circle at 20% 12%, rgba(255, 200, 170, 0.35), transparent 10%)",
  "radial-gradient(circle at 76% 30%, rgba(180, 225, 230, 0.6), transparent 10%)",
  "radial-gradient(circle at 26% 62%, rgba(var(--experience-rgb), 0.26), transparent 10%)",
  "radial-gradient(circle at 72% 82%, rgba(var(--projects-rgb), 0.22), transparent 10%)",
  "linear-gradient(180deg, #ffffff 0%, #fff6ec 8%, #ffe1c8 24%, rgba(255, 190, 160, 0.55) 36%, rgba(170, 220, 230, 0.6) 50%, rgba(200, 225, 250, 0.7) 62%, rgba(var(--experience-rgb), 0.55) 74%, rgba(255, 215, 235, 0.7) 86%, rgba(var(--projects-rgb), 0.55) 96%, rgba(252, 253, 255, 1) 100%)"
];

const baseGradientRepeat = [
  'no-repeat',
  'no-repeat',
  'no-repeat',
  'no-repeat',
  'no-repeat'
];

const baseGradientSize = [
  'auto',
  'auto',
  'auto',
  'auto',
  '100% 100%'
];

const baseGradientPosition = [
  'center',
  'center',
  'center',
  'center',
  'center'
];

const overlayGradientLayers = [overlayDataUri, ...baseGradientLayers];
const overlayGradientRepeat = ['repeat-y', ...baseGradientRepeat];
const overlayGradientSize = ['var(--overlay-width) var(--overlay-tile)', ...baseGradientSize];
const overlayGradientPosition = ['left top', ...baseGradientPosition];

const HomeSections = ({ navOffset, heroCollapsed, activeSection }) => (
  <>
    <WelcomeSection
      navOffset={navOffset}
      heroCollapsed={heroCollapsed}
      activeSection={activeSection}
    />
    <AboutSection navOffset={navOffset} />
    <EducationSection navOffset={navOffset} />
    <ExperienceSection navOffset={navOffset} />
    <ProjectsSection navOffset={navOffset} />
  </>
);

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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const theme = useTheme();
  const isCompact = useMediaQuery(theme.breakpoints.down('lg'));
  const navOffset = useMemo(() => (pathname === '/' ? heroCollapsed : true), 
  [heroCollapsed, pathname]);

  useEffect(() => {
    if (!isCompact && mobileNavOpen) {
      setMobileNavOpen(false);
    }
  }, [isCompact, mobileNavOpen]);

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
      setHeroCollapsed(true);
      setActiveSection(null);
      return undefined;
    }

    const container = getScrollContainer();
    if (!container) {
      setHeroCollapsed(false);
      setActiveSection(null);
      return undefined;
    }

    const getSections = () => SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean);

    let frame = null;

    const updateStateFromScroll = () => {
      frame = null;
      const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 0;
      const welcomeSection = document.getElementById('welcome');
      const welcomeHeight = welcomeSection?.offsetHeight || viewportHeight || 0;
      const threshold = Math.max(welcomeHeight * 0.5, 240);
      const collapsed = container.scrollTop >= threshold;
      setHeroCollapsed((prev) => (prev === collapsed ? prev : collapsed));

      const sections = getSections();
      if (!sections.length) {
        setActiveSection(null);
        return;
      }

      const scrollPosition = container.scrollTop + 1;
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
      frame = window.requestAnimationFrame(updateStateFromScroll);
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
  }, [pathname]);

  return (
    <>
      {isCompact && !mobileNavOpen ? (
        <IconButton
          onClick={() => setMobileNavOpen(true)}
          sx={{
            position: 'fixed',
            top: { xs: 12, sm: 16 },
            left: { xs: 12, sm: 16 },
            zIndex: 30,
            bgcolor: 'rgba(255,255,255,0.92)',
            boxShadow: '0 6px 16px rgba(15, 23, 42, 0.2)',
            border: '1px solid rgba(15,23,42,0.12)',
          }}
          aria-label="Open navigation"
        >
          <MenuIcon />
        </IconButton>
      ) : null}

      <Navbar
        heroCollapsed={heroCollapsed}
        isMobileNavOpen={mobileNavOpen}
        onMobileNavClose={() => setMobileNavOpen(false)}
      />
      <ScrollToHash />
      <Box
        component="main"
        id="main-content"
        sx={{
          position: 'relative',
          minHeight: '100vh',
          height: { xs: 'auto', lg: '100vh' },
          overflowY: { xs: 'visible', lg: 'auto' },
          overflowX: 'visible',
          scrollBehavior: 'smooth',
          backgroundColor: '#e6ddd1',
          pt: 0,
          // Full-width container; sections handle their own left offset when navbar is visible
          pr: 0,
          scrollPaddingTop: { xs: '120px', md: '140px' },
          boxSizing: 'border-box',
          transition: 'margin 560ms cubic-bezier(0.22, 1, 0.36, 1), width 560ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {/* Background stuff goes here: */}
        <Box
          sx={(theme) => ({
            position: 'relative',
            minHeight: '100%',
            '--overlay-width': 'clamp(120px, 16vw, 240px)',
            '--overlay-tile': '360px',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 0,
              backgroundImage: baseGradientLayers.join(', '),
              backgroundRepeat: baseGradientRepeat.join(', '),
              backgroundSize: baseGradientSize.join(', '),
              backgroundPosition: baseGradientPosition.join(', '),
            },
            [theme.breakpoints.up('sm')]: {
              '&::before': {
                backgroundImage: overlayGradientLayers.join(', '),
                backgroundRepeat: overlayGradientRepeat.join(', '),
                backgroundSize: overlayGradientSize.join(', '),
                backgroundPosition: overlayGradientPosition.join(', '),
                transition: 'background-size 350ms ease',
              },
              '&:has(#hero-sentinel:not(:in-view))': {
                '--overlay-width': 'clamp(200px, 26vw, 420px)',
              },
            },
            '& > *:not(#hero-sentinel)': { position: 'relative', zIndex: 1 },
          })}
        >
          {/* Invisible sentinel that’s exactly 100vh tall at the top of the page */}
          <Box
            id="hero-sentinel"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100vh',
              width: 1,
              pointerEvents: 'none',
              opacity: 0,
            }}
          />
          <Routes>
            <Route
              path="/"
              element={
                <HomeSections
                  navOffset={navOffset}
                  heroCollapsed={heroCollapsed}
                  activeSection={activeSection}
                />
              }
            />
            <Route
              path="/blog"
              element={<BlogPage />}
            />
            <Route
              path="/projects/:id"
              element={<ProjectPage />}
            />
          </Routes>
        </Box>
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
