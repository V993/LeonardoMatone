// src/components/WelcomeSection.js
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Chip,
  Avatar,
  Stack,
  Link as MuiLink,
  Button,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkIcon from '@mui/icons-material/Link';
import { useLocation, useNavigate } from 'react-router-dom';
import idPicture from '../assets/id-picture.jpg';
import hfBadge from '../assets/hf.png';
import tulaneBadge from '../assets/tulane.png';
import hunterBadge from '../assets/hunter.png';
import {
  welcome as welcomeData,
  contact as contactData,
  navigation,
  theme as themeData,
} from '../data';
import { scrollElementIntoView, scrollToTop } from '../utils/scroll';

const assetSources = {
  'id-picture.jpg': idPicture,
  'hf.png': hfBadge,
  'tulane.png': tulaneBadge,
  'hunter.png': hunterBadge
};

const channelIcons = {
  email: <EmailOutlinedIcon fontSize="small" />,
  linkedin: <LinkedInIcon fontSize="small" />,
  github: <GitHubIcon fontSize="small" />,
};

const SECTION_ORDER = ['about', 'education', 'experience', 'projects'];

function WelcomeSection({ heroCollapsed, onHeroCollapseChange }) {
  const heroRef = useRef(null);
  const heroHeightRef = useRef(0);
  const [measuredHeight, setMeasuredHeight] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useLayoutEffect(() => {
    if (heroRef.current && heroHeightRef.current === 0) {
      const nextHeight = heroRef.current.scrollHeight;
      heroHeightRef.current = nextHeight;
      setMeasuredHeight(nextHeight);
    }
  }, []);

  useEffect(() => {
    const updateHeight = () => {
      if (!heroRef.current) {
        return;
      }
      const nextHeight = heroRef.current.scrollHeight;
      if (nextHeight > 0 && nextHeight !== heroHeightRef.current) {
        heroHeightRef.current = nextHeight;
        setMeasuredHeight(nextHeight);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, [heroCollapsed]);

  useEffect(() => {
    if (!onHeroCollapseChange) {
      return undefined;
    }

    if (typeof window === 'undefined') {
      return undefined;
    }

    const container = document.getElementById('main-content');

    const handleScroll = () => {
      if (!heroRef.current) {
        return;
      }

      const baseHeight = heroHeightRef.current || heroRef.current.offsetHeight || window.innerHeight;
      const collapsePoint = Math.max(baseHeight * 0.45, 240);
      const containerScroll = container ? container.scrollTop : 0;
      const windowScroll = typeof window !== 'undefined' ? window.scrollY : 0;
      const hasContainerScroll =
        container && container.scrollHeight > container.clientHeight + 8;

      const currentScroll = hasContainerScroll ? containerScroll : windowScroll;
      const collapsed = currentScroll >= collapsePoint;
      onHeroCollapseChange(collapsed);
    };

    handleScroll();

    container?.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container?.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [onHeroCollapseChange]);

  const assetMap = useMemo(() => assetSources, []);
  const navLinks = useMemo(() => {
    const sorted = (navigation ?? [])
      .filter((item) => item.label?.toLowerCase() !== 'welcome')
      .map((item) => {
        if (item.type === 'hash') {
          const rawPath = item.path ?? '';
          const hash = rawPath.startsWith('#') ? rawPath : `#${rawPath}`;
          const sectionId = hash.replace('#', '');
          return {
            ...item,
            sectionId,
            hash,
          };
        }

        return {
          ...item,
          to: item.path ?? '/',
        };
      });

    return sorted.sort((a, b) => {
      const aIndex = a.sectionId ? SECTION_ORDER.indexOf(a.sectionId) : SECTION_ORDER.length;
      const bIndex = b.sectionId ? SECTION_ORDER.indexOf(b.sectionId) : SECTION_ORDER.length;
      return aIndex - bIndex;
    });
  }, []);

  const scrollToNavItem = (item) => {
    if (item.sectionId) {
      if (location.pathname !== '/') {
        navigate('/', { state: { scrollToSection: item.sectionId } });
        return;
      }

      const element = document.getElementById(item.sectionId);
      if (!scrollElementIntoView(element)) {
        scrollToTop();
      }

      return;
    }

    if (typeof item.to === 'string' && location.pathname !== item.to) {
        navigate(item.to);
    }
  };

  const arrowTarget = useMemo(
    () => navLinks.find((item) => item.sectionId),
    [navLinks]
  );

  const handleArrowClick = () => {
    if (arrowTarget) {
      scrollToNavItem(arrowTarget);
    }
  };

  const handleNavClick = (item) => {
    scrollToNavItem(item);
  };

  const isItemActive = () => false;

  const skills = welcomeData?.skills ?? [];
  const roles = welcomeData?.roles ?? [];
  const affiliations = (welcomeData?.affiliations ?? []).map((affiliation) => ({
    ...affiliation,
    src: assetMap[affiliation.badge] ?? null,
  }));

  const avatarSrc = assetMap[welcomeData?.avatar] ?? null;
  const primaryColor = themeData?.primaryColor ?? welcomeData?.highlightColor ?? 'rgb(var(--dark-cyan-rgb))';
  const greeting = welcomeData?.greeting ?? 'Hello,';
  const name = welcomeData?.name ?? '';
  const intro = welcomeData?.intro ?? '';
  const contactChannels = contactData?.channels ?? [];
  const heroMaxHeight = measuredHeight > 0 ? `${measuredHeight}px` : '1400px';

  return (
    <Box
      id="welcome"
      ref={heroRef}
      sx={{
        position: 'relative',
        minHeight: heroCollapsed ? 0 : '100vh',
        maxHeight: heroCollapsed ? '0px' : heroMaxHeight,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'center',
        px: { xs: 3, md: 6 },
        py: heroCollapsed ? 0 : { xs: 4, md: 6 },
        // scroll snapping disabled site-wide
        opacity: heroCollapsed ? 0 : 1,
        pointerEvents: heroCollapsed ? 'none' : 'auto',
        transform: heroCollapsed ? 'translateY(-40px)' : 'none',
        transition:
          'opacity 360ms ease, transform 520ms cubic-bezier(0.22, 1, 0.36, 1), max-height 640ms cubic-bezier(0.22, 1, 0.36, 1), padding 360ms ease',
        overflow: 'hidden',
        background: 'none',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100vw',
          height: '100%',
          background: 'radial-gradient(circle at top left, rgba(var(--welcome-rgb), 0.18), transparent 55%), linear-gradient(180deg, rgba(var(--welcome-rgb), 0.86) 0%, rgba(var(--welcome-rgb), 0.64) 52%, rgba(255, 255, 255, 0.92) 100%)',
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '24%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(var(--about-rgb), 0.12) 100%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          borderRadius: { xs: 3, md: 4 },
          background:
            'linear-gradient(180deg, rgba(var(--dark-cyan-rgb), 0.10) 0%, rgba(var(--mauve-rgb), 0.08) 60%, rgba(255, 255, 255, 0.98) 100%)',
          border: '1px solid rgba(var(--dark-cyan-rgb), 0.22)',
          boxShadow: '0 28px 60px rgba(85, 134, 140, 0.18)',
          p: { xs: 3, md: 4 },
          maxWidth: 1100,
          width: '100%',
          mx: 'auto',
          transition: 'transform 520ms cubic-bezier(0.22, 1, 0.36, 1)',
          transform: heroCollapsed ? 'translateY(-32px) scale(0.94)' : 'none',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 30% 30%, rgba(var(--dark-cyan-rgb), 0.22), rgba(var(--dark-cyan-rgb), 0.05) 60%, transparent 75%)',
            pointerEvents: 'none',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: '24%',
            background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(var(--about-rgb), 0.14) 100%)',
            pointerEvents: 'none',
          },
        }}
      >
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
          <Grid item xs={12} md={7}>
            <Stack spacing={{ xs: 2.5, md: 3 }}>
              <Stack spacing={1}>
                <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 3 }}>
                  {greeting}
                </Typography>
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '2.4rem', md: '3rem' },
                    lineHeight: 1.1,
                  }}
                >
                  <span style={{ color: primaryColor }}>{name}</span>
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 580 }}>
                  {intro}
                </Typography>
              </Stack>

              {contactChannels.length > 0 && (
                <Stack direction="row" spacing={1.2} alignItems="center">
                  {contactChannels.map((channel) => (
                    <MuiLink
                      key={channel.label}
                      href={channel.href}
                      target={channel.href?.startsWith('http') ? '_blank' : undefined}
                      rel={channel.href?.startsWith('http') ? 'noreferrer' : undefined}
                      aria-label={channel.label}
                      sx={{
                        color: 'text.primary',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(var(--dark-cyan-rgb), 0.14) 0%, rgba(var(--dark-cyan-rgb), 0.18) 100%)',
                        border: '1px solid rgba(var(--dark-cyan-rgb), 0.22)',
                        boxShadow: '0 10px 22px rgba(85, 134, 140, 0.16)',
                        transition: 'transform 200ms ease, box-shadow 200ms ease, filter 180ms ease',
                        '&:hover': {
                          transform: 'translateY(-2px) scale(1.05)',
                          boxShadow: '0 16px 28px rgba(85, 134, 140, 0.22)',
                          filter: 'brightness(1.05)',
                        },
                      }}
                    >
                      {channelIcons[channel.label?.toLowerCase()] ?? <LinkIcon fontSize="small" />}
                    </MuiLink>
                  ))}
                </Stack>
              )}

              {roles.length > 0 && (
                <Stack spacing={1}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Roles
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {roles.map((role) => (
                      <Chip key={role} label={role} size="small" color="secondary" sx={{ fontWeight: 600 }} />
                    ))}
                  </Box>
                </Stack>
              )}

              {skills.length > 0 && (
                <Stack spacing={1}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Core Skills
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {skills.map((skill) => (
                      <Chip key={skill} label={skill} size="small" />
                    ))}
                  </Box>
                </Stack>
              )}
            </Stack>
          </Grid>

          <Grid item xs={12} md={5}>
            <Stack spacing={3} alignItems="center" sx={{ height: '100%' }} justifyContent="center">
              <Box
                sx={{
                  position: 'relative',
                  width: { xs: 240, md: 260 },
                  height: { xs: 240, md: 260 },
                  borderRadius: '50%',
                  background:
                    'radial-gradient(circle at 30% 30%, rgba(var(--welcome-rgb), 0.28), rgba(var(--welcome-rgb), 0.05) 60%, transparent 75%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 18px 44px rgba(85, 134, 140, 0.26)',
                  border: '1px solid rgba(var(--welcome-rgb), 0.18)',
                }}
              >
                <Avatar
                  alt={name || 'Profile'}
                  src={avatarSrc ?? undefined}
                  sx={{ width: { xs: 210, md: 230 }, height: { xs: 210, md: 230 } }}
                />
              </Box>

              {affiliations.length > 0 && (
                <Stack direction="row" spacing={1.5} justifyContent="center" flexWrap="wrap">
                  {affiliations.map((affiliation) => (
                    <Avatar
                      key={affiliation.name}
                      alt={affiliation.name}
                      src={affiliation.src ?? undefined}
                      sx={{ width: 46, height: 46 }}
                    />
                  ))}
                </Stack>
              )}
            </Stack>
          </Grid>
        </Grid>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 1, sm: 1.25 }}
          flexWrap="wrap"
          alignItems={{ xs: 'stretch', sm: 'center' }}
          justifyContent={{ xs: 'flex-start', sm: 'center' }}
          sx={{ mt: { xs: 3.5, md: 4 } }}
        >
          {navLinks
            .filter((item) => item.sectionId)
            .map((item) => {
            const isActive = isItemActive(item);

            return (
              <Button
                key={item.label}
                onClick={() => handleNavClick(item)}
                sx={{
                  borderRadius: 0,
                  px: 1,
                  py: 0.25,
                  minWidth: 'auto',
                  fontWeight: 700,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  background: 'transparent',
                  color: isActive ? primaryColor : 'rgb(var(--dark-cyan-rgb))',
                  border: 'none',
                  boxShadow: 'none',
                  filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.15))',
                  transition: 'transform 160ms ease, filter 160ms ease',
                  '&:hover': {
                    background: 'transparent',
                    transform: 'translateY(-1px)',
                    filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.18))',
                  },
                }}
              >
                {item.label}
              </Button>
            );
          })}
        </Stack>
      </Box>

      <Box
        onClick={handleArrowClick}
        sx={{
          position: 'absolute',
          bottom: { xs: 24, md: 36 },
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          color: primaryColor,
          cursor: 'pointer',
          opacity: heroCollapsed ? 0 : 1,
          pointerEvents: heroCollapsed ? 'none' : 'auto',
          transition: 'opacity 260ms ease',
        }}
        role="button"
        aria-label="Scroll to next section"
      >
        <Typography variant="body2" sx={{ letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: 700 }}>
          Scroll
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: heroCollapsed ? 'none' : 'heroArrowPulse 1.6s ease-in-out infinite alternate',
            '@keyframes heroArrowPulse': {
              from: { transform: 'translateY(0)' },
              to: { transform: 'translateY(10px)' },
            },
          }}
        >
          <KeyboardArrowDownIcon fontSize="large" />
        </Box>
      </Box>
    </Box>
  );
}

export default WelcomeSection;
