// src/components/Navbar.js
import React, { useMemo } from 'react';
import {
  Avatar,
  Box,
  Button,
  Link as MuiLink,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  IconButton,
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkIcon from '@mui/icons-material/Link';
import CloseIcon from '@mui/icons-material/Close';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  navigation,
  welcome as welcomeData,
  contact as contactData,
  theme as themeData,
} from '../data';
import idPicture from '../assets/id-picture.jpg';
import hfBadge from '../assets/hf.png';
import tulaneBadge from '../assets/tulane.png';
import hunterBadge from '../assets/hunter.png';
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

function Navbar({ heroCollapsed, activeSection, isMobileNavOpen = false, onMobileNavClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));
  const showLeftSidebar = heroCollapsed && !isSmall;
  const shouldShowMobileNav = isSmall && isMobileNavOpen;

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

  const primaryNavItems = useMemo(
    () => navLinks.filter((item) => item.sectionId),
    [navLinks]
  );

  const routeNavItems = useMemo(
    () => navLinks.filter((item) => !item.sectionId),
    [navLinks]
  );

  const avatarSrc = assetSources[welcomeData?.avatar] ?? undefined;
  const navbarBorderColor = themeData?.navbarBorderColor ?? 'rgba(var(--dark-cyan-rgb), 0.25)';

  const isVisible = heroCollapsed || shouldShowMobileNav;
  const handleMobileClose = () => {
    if (typeof onMobileNavClose === 'function') {
      onMobileNavClose();
    }
  };

  const handleNavClick = (event, item) => {
    if (item.sectionId) {
      event?.preventDefault();

      if (location.pathname !== '/') {
        navigate('/', { state: { scrollToSection: item.sectionId } });
        if (shouldShowMobileNav) {
          handleMobileClose();
        }
        return;
      }

      const element = document.getElementById(item.sectionId);
      if (!scrollElementIntoView(element)) {
        scrollToTop();
      }

      if (shouldShowMobileNav) {
        handleMobileClose();
      }
      return;
    }

    if (typeof item.to === 'string' && location.pathname !== item.to) {
        navigate(item.to);
        if (shouldShowMobileNav) {
          handleMobileClose();
        }
    }
  };

  const isItemActive = (item) => {
    if (item.sectionId) {
      const targetHash = `#${item.sectionId}`;
      return activeSection === targetHash;
    }

    if (typeof item.to === 'string') {
      return location.pathname === item.to;
    }

    return false;
  };

  const renderNavButtons = (items) => {
    if (!Array.isArray(items) || items.length === 0) {
      return null;
    }

    return (
      <Stack
        direction={showLeftSidebar ? 'column' : isSmall ? 'column' : 'row'}
        spacing={showLeftSidebar ? 1 : isSmall ? 1 : 1.1}
        alignItems={showLeftSidebar || isSmall ? 'stretch' : 'center'}
        justifyContent={showLeftSidebar ? 'flex-start' : 'flex-start'}
        flexWrap={showLeftSidebar ? 'nowrap' : 'wrap'}
        rowGap={showLeftSidebar ? 0 : 1}
      >
        {items.map((item) => {
          const isActive = isItemActive(item);

          return (
              <Button
                key={item.label}
                onClick={(event) => handleNavClick(event, item)}
                sx={{
                  borderRadius: 2.4,
                  px: showLeftSidebar ? 1.8 : 2.1,
                  py: 0.6,
                  fontWeight: 700,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  width: showLeftSidebar || isSmall ? '100%' : 'auto',
                  justifyContent: 'center',
                  color: isActive ? '#f8fafc' : '#0f172a',
                  backgroundColor: isActive ? 'rgba(79, 111, 119, 0.92)' : 'rgba(255,255,255,0.9)',
                  border: '1px solid rgba(15, 23, 42, 0.14)',
                  boxShadow: isActive ? '0 12px 26px rgba(15,23,42,0.28)' : '0 4px 14px rgba(15,23,42,0.12)',
                  transform: isActive ? 'translateY(-1px)' : 'none',
                  transition: 'transform 200ms ease, box-shadow 200ms ease, background-color 200ms ease, color 200ms ease',
                  '&:hover': {
                    backgroundColor: isActive ? 'rgba(84, 130, 236, 0.86)' : 'rgba(255,255,255,1)',
                    boxShadow: '0 16px 32px rgba(15,23,42,0.24)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                {item.label}
              </Button>
          );
        })}
      </Stack>
    );
  };

  const contactChannels = contactData?.channels ?? [];
  
  return (
    <Box
      component="header"
      id="navbarbox"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: showLeftSidebar ? { md: 'clamp(240px, 24vw, 320px)', lg: 'clamp(260px, 22vw, 360px)' } : '100%',
        maxWidth: showLeftSidebar ? { md: 'clamp(240px, 24vw, 320px)', lg: 'clamp(260px, 22vw, 360px)' } : '100%',
        height: '100vh',
        zIndex: (muiTheme) => muiTheme.zIndex.appBar + 25,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : 'translateX(-110%)',
        pointerEvents: isVisible ? 'auto' : 'none',
        backgroundColor: shouldShowMobileNav ? 'rgba(17, 24, 39, 0.35)' : 'transparent',
        transition: 'opacity 520ms ease, transform 680ms cubic-bezier(0.22, 1, 0.36, 1), backdrop-filter 240ms ease',
      }}
      data-state="hidden" data-phase="out"
      role={shouldShowMobileNav ? 'dialog' : undefined}
      aria-modal={shouldShowMobileNav ? 'true' : undefined}
    >
      <Box
        id="navbar-box"
        sx={{
          width: '100%',
          maxWidth: showLeftSidebar ? '100%' : 1240,
          px: showLeftSidebar ? { md: 2, lg: 2.5 } : { xs: 2, md: 3.5 },
          pt: showLeftSidebar ? { md: 3 } : { xs: 4, md: 2 },
          pb: showLeftSidebar ? { md: 3 } : { xs: 2, md: 2 },
          // transition: 'opacity 480ms ease, transform 520ms cubic-bezier(0.22, 1, 0.36, 1)',
          opacity: 1,
          
          transform: 'translateY(0)',
          height: 'auto',
          display: 'flex',
          alignItems: 'stretch',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            borderRadius: { xs: 3, md: 4 },
            border: `1px solid ${navbarBorderColor}`,
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.08) 80%)',
            boxShadow: '0 24px 64px rgba(85, 134, 140, 0.28)',
            backdropFilter: heroCollapsed || shouldShowMobileNav ? 'blur(8px)' : 'blur(0px)',
            // transition: 'box-shadow 420ms ease, backdrop-filter 420ms ease',
            overflow: 'hidden',
            width: '100%',
            height: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {shouldShowMobileNav && (
            <IconButton
              onClick={handleMobileClose}
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                color: '#1f2937',
                zIndex: 5,
              }}
              aria-label="Close navigation"
            >
              <CloseIcon />
            </IconButton>
          )}
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                gap: { xs: 1.2, md: 1.8 },
                pt: showLeftSidebar ? { md: 3.2 } : { xs: 2.4, md: 3 },
                pb: { xs: 1.8, md: 2.4 },
                px: showLeftSidebar ? { md: 2.6 } : { xs: 2.6, md: 3.2 },
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.18) 64%, rgba(255,255,255,0.06) 100%)',
                borderBottom: '1px solid rgba(var(--dark-cyan-rgb), 0.14)',
              }}
            >
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                textTransform: 'none',
                fontSize: { xs: '2.8rem', md: '3.2rem' },
                lineHeight: 1.05,
                color: '#1f2937',
                textAlign: 'center',
              }}
            >
              {welcomeData?.name ?? ''}
            </Typography>

            {welcomeData?.roles && welcomeData.roles.length > 0 && (
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  color: '#1f2937',
                  textAlign: 'center',
                }}
              >
                {welcomeData.roles[0]}
              </Typography>
            )}

            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                justifyContent: 'center',
                width: showLeftSidebar ? { md: 148 } : { xs: 140, md: 148 },
                height: showLeftSidebar ? { md: 148 } : { xs: 140, md: 148 },
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(var(--dark-cyan-rgb), 0.35) 0%, rgba(var(--dark-cyan-rgb), 0.18) 100%)',
                border: '2px solid rgba(255, 255, 255, 0.65)',
                boxShadow: '0 24px 36px rgba(85, 134, 140, 0.28)',
              }}
            >
              <Avatar
                alt={welcomeData?.name ?? 'Profile'}
                src={avatarSrc}
                sx={{
                  width: showLeftSidebar ? { md: 132 } : { xs: 126, md: 132 },
                  height: showLeftSidebar ? { md: 132 } : { xs: 126, md: 132 },
                  border: '3px solid rgba(255, 255, 255, 0.8)',
                }}
              />
            </Box>

            {contactChannels.length > 0 && (
              <Stack spacing={0.4} alignItems="center" sx={{ width: '100%' }}>
                <Stack
                  direction="row"
                  spacing={0.6}
                  flexWrap="wrap"
                  justifyContent="center"
                  rowGap={0.5}
                >
                  {contactChannels.map((channel) => {
                    const iconKey = channel.label ? channel.label.toLowerCase() : '';
                    const key = channel.label ?? channel.href;

                    return (
                      <Tooltip key={key} title={channel.label ?? ''} placement="top" arrow>
                        <MuiLink
                          href={channel.href}
                          target={channel.href?.startsWith('http') ? '_blank' : undefined}
                          rel={channel.href?.startsWith('http') ? 'noreferrer' : undefined}
                          aria-label={channel.label}
                          onClick={() => {
                            handleMobileClose();
                          }}
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, rgba(var(--dark-cyan-rgb), 0.14) 0%, rgba(var(--dark-cyan-rgb), 0.18) 100%)',
                            color: '#1f2937',
                            border: '1px solid rgba(var(--dark-cyan-rgb), 0.22)',
                            transition: 'transform 200ms ease, box-shadow 200ms ease',
                            boxShadow: '0 10px 22px rgba(85, 134, 140, 0.16)',
                            '&:hover': {
                              transform: 'translateY(-3px) scale(1.05)',
                              boxShadow: '0 16px 28px rgba(85, 134, 140, 0.22)',
                            },
                          }}
                        >
                          {channelIcons[iconKey] ?? <LinkIcon fontSize="small" />}
                        </MuiLink>
                      </Tooltip>
                    );
                  })}
                </Stack>
              </Stack>
            )}
          </Box>

          <Stack
            spacing={showLeftSidebar ? 1.6 : 1.2}
            sx={{
              flex: showLeftSidebar ? 1 : 'initial',
              px: showLeftSidebar ? { md: 2.9 } : { xs: 2.6, md: 3.6 },
              py: { xs: 2.7, md: 3.1 },
            }}
          >
            {primaryNavItems.length > 0 && (
              <Stack spacing={1.4}>
                <Typography
                  variant="overline"
                  sx={{
                    letterSpacing: 3,
                    fontWeight: 700,
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    color: '#1f2937',
                    textAlign: showLeftSidebar || isSmall ? 'center' : 'left',
                  }}
                >
                  Sections
                </Typography>
                {renderNavButtons(primaryNavItems)}
              </Stack>
            )}
            {routeNavItems.length > 0 && (
              <Stack spacing={1.4}>
                <Typography
                  variant="overline"
                  sx={{
                    letterSpacing: 3,
                    fontWeight: 700,
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    color: '#1f2937',
                    textAlign: showLeftSidebar || isSmall ? 'center' : 'left',
                  }}
                >
                  Pages
                </Typography>
                {renderNavButtons(routeNavItems)}
              </Stack>
            )}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

export default Navbar;
