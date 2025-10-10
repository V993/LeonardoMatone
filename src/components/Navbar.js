// src/components/Navbar.js
import React, { useMemo } from 'react';
import {
  Avatar,
  Box,
  Button,
  Drawer,
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
import icelandPicture from '../assets/iceland.jpeg';
import hfBadge from '../assets/hf.png';
import tulaneBadge from '../assets/tulane.png';
import hunterBadge from '../assets/hunter.png';
import { scrollElementIntoView, scrollToTop } from '../utils/scroll';

const assetSources = {
  'id-picture.jpg': idPicture,
  'hf.png': hfBadge,
  'tulane.png': tulaneBadge,
  'hunter.png': hunterBadge,
  'iceland.jpeg': icelandPicture
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
  const isCompact = useMediaQuery(theme.breakpoints.down('lg'));
  const showLeftSidebar = heroCollapsed && !isCompact;
  const shouldShowMobileNav = isCompact && isMobileNavOpen;

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
  const desktopPanelBackground = 'linear-gradient(180deg, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.08) 80%)';
  const desktopHeaderBackground = 'linear-gradient(180deg, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.18) 64%, rgba(255,255,255,0.06) 100%)';
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
        direction={showLeftSidebar || isCompact ? 'column' : 'row'}
        spacing={showLeftSidebar ? 1 : isCompact ? 1 : 1.1}
        alignItems={showLeftSidebar || isCompact ? 'stretch' : 'center'}
        justifyContent="flex-start"
        flexWrap={showLeftSidebar ? 'nowrap' : isCompact ? 'nowrap' : 'wrap'}
        rowGap={showLeftSidebar || isCompact ? 0 : 1}
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
                  width: showLeftSidebar || isCompact ? '100%' : 'auto',
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
  const showAvatar = !isCompact && Boolean(avatarSrc);

  const navCard = (
    <Box
      component="nav"
      aria-label="Primary navigation"
      sx={{
        position: 'relative',
        borderRadius: { xs: 3, md: 4 },
        border: `1px solid ${navbarBorderColor}`,
        background: showLeftSidebar || !isCompact ? desktopPanelBackground : 'rgba(255, 255, 255, 0.94)',
        boxShadow: '0 24px 64px rgba(85, 134, 140, 0.28)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        overflow: 'hidden',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '100%',
        minHeight: 0,
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
          flexDirection: 'column',
          alignItems: 'center',
          gap: isCompact ? 1.2 : 1.6,
          pt: showLeftSidebar ? { md: 2.6 } : { xs: 2.4, md: 2.8 },
          pb: { xs: 1.6, md: 2 },
          px: showLeftSidebar ? { md: 2.2 } : { xs: 2.1, md: 2.6 },
          background: showLeftSidebar || !isCompact ? desktopHeaderBackground : 'transparent',
          borderBottom: '1px solid rgba(var(--dark-cyan-rgb), 0.14)',
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            textTransform: 'none',
            fontSize: isCompact ? '2.3rem' : { xs: '2.8rem', md: '3.2rem' },
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
              fontSize: isCompact ? '1.05rem' : undefined,
            }}
          >
            {welcomeData.roles[0]}
          </Typography>
        )}

        {showAvatar && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: { md: 148 },
              height: { md: 148 },
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
                width: { md: 132 },
                height: { md: 132 },
                border: '3px solid rgba(255, 255, 255, 0.8)',
              }}
            />
          </Box>
        )}

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
        spacing={showLeftSidebar ? 1.6 : 1.4}
        sx={{
          flexGrow: 1,
          minHeight: 0,
          px: showLeftSidebar ? { md: 2.3 } : { xs: 1.8, md: 2.8 },
          py: { xs: 1.8, md: 2.4 },
          overflowY: 'auto',
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
                textAlign: showLeftSidebar || isCompact ? 'center' : 'left',
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
                textAlign: showLeftSidebar || isCompact ? 'center' : 'left',
              }}
            >
              Pages
            </Typography>
            {renderNavButtons(routeNavItems)}
          </Stack>
        )}
      </Stack>
    </Box>
  );

  const navPanel = (
    <Box
      sx={{
        width: '100%',
        maxWidth: showLeftSidebar ? '100%' : isCompact ? 'min(420px, 92vw)' : 1240,
        mx: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: showLeftSidebar ? { md: 1.5, lg: 2 } : isCompact ? 0 : { xs: 1.4, md: 2.6 },
        py: showLeftSidebar ? { md: 2.2 } : isCompact ? 0 : { xs: 2.2, md: 1.6 },
      }}
    >
      {navCard}
    </Box>
  );

  if (shouldShowMobileNav) {
    return (
      <Drawer
        anchor="left"
        open={isMobileNavOpen}
        onClose={handleMobileClose}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: {
            width: '100vw',
            height: 'min-content',
            background: 'transparent',
            boxShadow: 'none',
            display: 'flex',
            alignItems: 'stretch',
          },
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'center',
            p: 1.5,
          }}
        >
          {navPanel}
        </Box>
      </Drawer>
    );
  }

  if (!isCompact) {
    return (
      <Box
        component="aside"
        id="navbarbox"
        sx={{
          position: 'fixed',
          top: '50%',
          left: 0,
          // width: '23vw',
          maxWidth: { md: 'clamp(240px, 24vw, 320px)', lg: 'clamp(260px, 22vw, 360px)' },
          height: '100vh',
          zIndex: (muiTheme) => muiTheme.zIndex.appBar + 25,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          pointerEvents: showLeftSidebar ? 'auto' : 'none',
          opacity: showLeftSidebar ? 1 : 0,
          transform: showLeftSidebar ? 'translateY(-50%) translateX(0)' : 'translateY(-50%) translateX(64px)',
          transition: 'opacity 360ms ease, transform 360ms ease',
        }}
      >
        {navPanel}
      </Box>
    );
  }

  return null;
}

export default Navbar;
