// src/components/Navbar.js
import React, { useMemo } from 'react';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Link as MuiLink,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkIcon from '@mui/icons-material/Link';
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

function Navbar({ heroCollapsed, activeSection }) {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));
  const showLeftSidebar = heroCollapsed && !isSmall;

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

  const avatarSrc = assetSources[welcomeData?.avatar] ?? undefined;
  const primaryColor = themeData?.primaryColor ?? 'rgb(var(--dark-cyan-rgb))';
  const navbarBorderColor = themeData?.navbarBorderColor ?? 'rgba(var(--dark-cyan-rgb), 0.25)';

  const affiliations = useMemo(
    () =>
      (welcomeData?.affiliations ?? []).map((affiliation) => ({
        ...affiliation,
        src: assetSources[affiliation.badge] ?? undefined,
      })),
    []
  );

  const handleNavClick = (event, item) => {
    if (item.sectionId) {
      event?.preventDefault();

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
                borderRadius: 2,
                px: showLeftSidebar ? 1.6 : 1.8,
                py: 0.55,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: 'uppercase',
                width: showLeftSidebar || isSmall ? '100%' : 'auto',
                justifyContent: 'center',
                color: isActive ? primaryColor : 'rgb(var(--dark-cyan-rgb))',
                backgroundColor: isActive ? 'rgba(var(--dark-cyan-rgb), 0.22)' : 'rgba(var(--dark-cyan-rgb), 0.08)',
                border: '1px solid rgba(var(--dark-cyan-rgb), 0.24)',
                boxShadow: isActive ? '0 10px 24px rgba(85, 134, 140, 0.22)' : 'none',
                transition: 'all 220ms ease',
                '&:hover': {
                  backgroundColor: 'rgba(var(--dark-cyan-rgb), 0.32)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 12px 28px rgba(85, 134, 140, 0.26)',
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
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: showLeftSidebar ? { md: 280, lg: 320 } : '100%',
        maxWidth: showLeftSidebar ? { md: 280, lg: 320 } : '100%',
        height: showLeftSidebar ? '100vh' : 'auto',
        zIndex: (muiTheme) => muiTheme.zIndex.appBar + 2,
        display: 'flex',
        justifyContent: showLeftSidebar ? 'flex-start' : 'center',
        alignItems: showLeftSidebar ? 'stretch' : 'flex-start',
        pointerEvents: heroCollapsed ? 'auto' : 'none',
        transition: 'width 320ms ease, max-width 320ms ease',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: showLeftSidebar ? '100%' : 1240,
          px: showLeftSidebar ? { md: 2, lg: 2.5 } : { xs: 2, md: 3.5 },
          pt: showLeftSidebar ? { md: 3 } : { xs: 1, md: 1.5 },
          pb: showLeftSidebar ? { md: 3 } : { xs: 1.25, md: 1.75 },
          transition: 'opacity 420ms ease, transform 420ms ease',
          opacity: heroCollapsed ? 1 : 0,
          transform: heroCollapsed ? 'translateY(0)' : 'translateY(-28px)',
          height: showLeftSidebar ? '100%' : 'auto',
          display: 'flex',
          alignItems: 'stretch',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            borderRadius: { xs: 3, md: 4 },
            border: `1px solid ${navbarBorderColor}`,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(var(--dark-cyan-rgb), 0.06) 45%, rgba(255, 255, 255, 0.98) 100%)',
            boxShadow: heroCollapsed ? '0 24px 64px rgba(85, 134, 140, 0.28)' : '0 8px 20px rgba(85, 134, 140, 0.14)',
            backdropFilter: heroCollapsed ? 'blur(18px)' : 'none',
            transition: 'box-shadow 420ms ease, backdrop-filter 420ms ease',
            overflow: 'hidden',
            width: '100%',
            height: showLeftSidebar ? '100%' : 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              gap: 3.1,
              pt: showLeftSidebar ? { md: 6 } : { xs: 5, md: 5.6 },
              pb: { xs: 3.8, md: 4 },
              px: showLeftSidebar ? { md: 3.5 } : { xs: 3.25, md: 4 },
              background: 'linear-gradient(180deg, rgba(var(--dark-cyan-rgb), 0.12) 0%, rgba(var(--dark-cyan-rgb), 0.06) 100%)',
              borderBottom: '1px solid rgba(var(--dark-cyan-rgb), 0.14)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: showLeftSidebar ? { md: 176 } : { xs: 156, md: 164 },
                height: showLeftSidebar ? { md: 176 } : { xs: 156, md: 164 },
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
                  width: showLeftSidebar ? { md: 150 } : { xs: 140, md: 144 },
                  height: showLeftSidebar ? { md: 150 } : { xs: 140, md: 144 },
                  border: '4px solid rgba(255, 255, 255, 0.8)',
                }}
              />
            </Box>

            {affiliations.length > 0 && (
              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                justifyContent="center"
                rowGap={0.9}
              >
                {affiliations.map((affiliation) => (
                  <Avatar
                    key={affiliation.name}
                    alt={affiliation.name}
                    src={affiliation.src}
                    sx={{ width: 36, height: 36, boxShadow: '0 8px 16px rgba(85, 134, 140, 0.2)' }}
                  />
                ))}
              </Stack>
            )}
          </Box>

          <Stack
            spacing={showLeftSidebar ? 3.2 : 2.9}
            sx={{
              flex: showLeftSidebar ? 1 : 'initial',
              px: showLeftSidebar ? { md: 2.9 } : { xs: 2.6, md: 3.6 },
              py: { xs: 2.7, md: 3.1 },
            }}
          >
            <Stack
              spacing={showLeftSidebar ? 1.8 : 1.6}
              alignItems={showLeftSidebar || isSmall ? 'center' : 'flex-start'}
              textAlign={showLeftSidebar || isSmall ? 'center' : 'left'}
              sx={{ width: '100%' }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 800, letterSpacing: 2.4, textTransform: 'uppercase' }}>
                {welcomeData?.name ?? ''}
              </Typography>

              {welcomeData?.roles && welcomeData.roles.length > 0 && (
                <Typography variant="body2" color="text.secondary">
                  {welcomeData.roles[0]}
                </Typography>
              )}

              {contactChannels.length > 0 && (
                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  flexWrap="wrap"
                  columnGap={1.15}
                  rowGap={0.85}
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
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, rgba(var(--dark-cyan-rgb), 0.14) 0%, rgba(var(--dark-cyan-rgb), 0.18) 100%)',
                            color: 'text.primary',
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
              )}

            </Stack>

            {primaryNavItems.length > 0 && (
              <Divider sx={{ borderColor: 'rgba(var(--dark-cyan-rgb), 0.18)' }} />
            )}

            {primaryNavItems.length > 0 && (
              <Stack spacing={1.25}>
                <Typography variant="overline" sx={{ letterSpacing: 2, color: 'text.secondary', textAlign: showLeftSidebar || isSmall ? 'center' : 'left' }}>
                  Sections
                </Typography>
                {renderNavButtons(primaryNavItems)}
              </Stack>
            )}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

export default Navbar;
