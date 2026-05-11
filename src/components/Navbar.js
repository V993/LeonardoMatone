// src/components/Navbar.js
import React, { useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Chip,
  Divider,
  Drawer,
  Link as MuiLink,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  IconButton,
} from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import CloseIcon from '@mui/icons-material/Close';
import { welcome as welcomeData } from '../data';
import idPicture from '../assets/id-picture.jpg';
import icelandPicture from '../assets/iceland.jpeg';
import hfBadge from '../assets/hf.png';
import tulaneBadge from '../assets/tulane.png';
import hunterBadge from '../assets/hunter.png';
import { sharedChipProps, sharedChipSx } from '../styles/chipStyles';

const assetSources = {
  'id-picture.jpg': idPicture,
  'iceland.jpeg': icelandPicture,
  'hf.png': hfBadge,
  'tulane.png': tulaneBadge,
  'hunter.png': hunterBadge,
};

const desktopAvatarFrameSize = 212;
const desktopAvatarSize = 188;

const snapshotHeadingSx = {
  letterSpacing: 3,
  fontWeight: 700,
  color: 'var(--text-primary)',
  textAlign: 'left',
  textTransform: 'uppercase',
  fontSize: { xs: '0.8rem', md: '0.86rem' },
};

function SnapshotSection({ title, children }) {
  return (
    <Stack spacing={{ xs: 1, md: 1.1 }} sx={{ width: '100%' }} alignItems="flex-start">
      <Typography variant="overline" sx={{ ...snapshotHeadingSx, width: '100%' }}>
        {title}
      </Typography>
      {children}
    </Stack>
  );
}

function Navbar({ heroCollapsed, isMobileNavOpen = false, onMobileNavClose }) {
  const theme = useTheme();
  const isCompact = useMediaQuery(theme.breakpoints.down('lg'));
  const showLeftSidebar = heroCollapsed && !isCompact;
  const shouldShowMobileNav = isCompact && isMobileNavOpen;

  // Welcome data
  const name = welcomeData?.name ?? '';
  const roles = Array.isArray(welcomeData?.roles) ? welcomeData.roles : [];
  const primaryRole = roles.length > 0 ? roles[0] : null;
  const skills = Array.isArray(welcomeData?.skills) ? welcomeData.skills : [];
  const funFact = welcomeData?.funFact ?? null;
  const currentlyWorkingOn = welcomeData?.currentlyWorkingOn ?? null;
  const affiliations = useMemo(
    () =>
      (welcomeData?.affiliations ?? []).map((a) => ({
        ...a,
        src: assetSources[a.badge] ?? null,
      })),
    []
  );

  const hasSkills = skills.length > 0;
  const hasFunFact = Boolean(funFact);
  const canToggleFunFact = hasSkills && hasFunFact;
  const [showFunFact, setShowFunFact] = useState(!hasSkills && hasFunFact);
  const isFunFactActive = canToggleFunFact ? showFunFact : hasFunFact;
  const snapshotTitle = isFunFactActive ? 'Secret Fun Fact:' : 'Core Skills:';
  const hasCardSections = Boolean(currentlyWorkingOn || funFact || skills.length > 0);

  const avatarSrc = assetSources[welcomeData?.avatar] ?? undefined;

  const handleMobileClose = () => {
    if (typeof onMobileNavClose === 'function') {
      onMobileNavClose();
    }
  };

  const navCard = (
    <Box
      component="nav"
      aria-label="Primary navigation"
      sx={{
        position: 'relative',
        borderRadius: { xs: 3, md: 4 },
        border: 'none',
        background: 'linear-gradient(180deg, rgba(var(--welcome-rgb), 0.55) 20%, var(--surface-base) 100%)',
        boxShadow: '0 24px 64px rgba(var(--shadow-rgb), 0.28)',
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
          sx={{ position: 'absolute', top: 12, right: 12, color: 'var(--text-primary)', zIndex: 5 }}
          aria-label="Close navigation"
        >
          <CloseIcon />
        </IconButton>
      )}

      {/* Scrollable body */}
      <Box sx={{ flexGrow: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

        {/* Snapshot card content — matches WelcomeSection snapshot column exactly */}
        <Box
          onClick={canToggleFunFact ? () => setShowFunFact((p) => !p) : undefined}
          role={canToggleFunFact ? 'button' : undefined}
          tabIndex={canToggleFunFact ? 0 : undefined}
          onKeyDown={
            canToggleFunFact
              ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setShowFunFact((p) => !p);
                  }
                }
              : undefined
          }
          aria-pressed={canToggleFunFact ? isFunFactActive : undefined}
          sx={{
            px: { xs: 2.4, sm: 2.8, md: 3.2 },
            pt: { xs: 2.6, sm: 3, md: 3.6 },
            pb: 2.4,
            cursor: canToggleFunFact ? 'pointer' : 'default',
            outline: 'none',
            '&:focus-visible': {
              outline: '3px solid rgba(var(--dark-cyan-rgb), 0.38)',
              outlineOffset: 6,
            },
          }}
        >
          <Stack
            spacing={{ xs: 2.4, md: 2.6 }}
            divider={
              hasCardSections ? (
                <Divider
                  flexItem
                  sx={{
                    borderColor: 'var(--card-divider)',
                    alignSelf: 'stretch',
                    my: { xs: 1.8, md: 2 },
                  }}
                />
              ) : null
            }
            sx={{ width: '100%' }}
          >
            {/* Avatar block */}
            <Box sx={{ width: '100%' }}>
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: { xs: 1.8, md: 2.4 },
                  textAlign: 'center',
                }}
              >
                {(name || primaryRole) ? (
                  <Box sx={{ width: '100%', textAlign: 'left' }}>
                    {primaryRole ? (
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                          letterSpacing: 1.2,
                          opacity: 0.55,
                          textTransform: 'uppercase',
                          display: 'block',
                          mb: 0.4,
                        }}
                      >
                        {primaryRole}
                      </Typography>
                    ) : null}
                    {name ? (
                      <Typography
                        component="p"
                        sx={{
                          fontWeight: 900,
                          fontSize: { xs: '1.7rem', md: '1.85rem' },
                          color: 'var(--text-primary)',
                          letterSpacing: 0,
                          lineHeight: 1.1,
                        }}
                      >
                        {name}
                      </Typography>
                    ) : null}
                  </Box>
                ) : null}

                <Box
                  className="avatar-ring"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: { xs: 'min(212px, 56vw)', sm: 'min(220px, 46vw)', md: desktopAvatarFrameSize },
                    height: { xs: 'min(212px, 56vw)', sm: 'min(220px, 46vw)', md: desktopAvatarFrameSize },
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(var(--dark-cyan-rgb), 0.38) 0%, rgba(var(--dark-cyan-rgb), 0.16) 100%)',
                    border: '2px solid rgba(255, 255, 255, 0.65)',
                    boxShadow: '0 28px 44px rgba(85, 134, 140, 0.34)',
                    transition: 'transform 260ms ease, box-shadow 260ms ease',
                  }}
                >
                  <Avatar
                    alt={name || 'Profile'}
                    src={avatarSrc}
                    sx={{
                      width: { xs: 'calc(100% - 32px)', sm: 'calc(100% - 36px)', md: desktopAvatarSize },
                      height: { xs: 'calc(100% - 32px)', sm: 'calc(100% - 36px)', md: desktopAvatarSize },
                      border: { xs: '3px solid rgba(255, 255, 255, 0.88)', md: '4px solid rgba(255, 255, 255, 0.82)' },
                      boxShadow: '0 24px 46px rgba(15, 23, 42, 0.24)',
                    }}
                  />
                </Box>

                {affiliations.length > 0 ? (
                  <Stack direction="row" spacing={1.1} flexWrap="wrap" rowGap={1} justifyContent="center">
                    {affiliations.map((affiliation) => {
                      const googleSearchHref = affiliation?.name
                        ? `https://www.google.com/search?q=${encodeURIComponent(affiliation.name)}`
                        : undefined;

                      const avatarNode = (
                        <Avatar
                          alt={affiliation.name}
                          src={affiliation.src ?? undefined}
                          sx={{
                            width: 42,
                            height: 42,
                            boxShadow: '0 10px 18px rgba(15, 23, 42, 0.18)',
                            border: '2px solid rgba(255, 255, 255, 0.8)',
                          }}
                        />
                      );

                      return (
                        <Tooltip key={affiliation.name} title={affiliation.name ?? ''} placement="top" arrow>
                          {googleSearchHref ? (
                            <MuiLink
                              href={googleSearchHref}
                              target="_blank"
                              rel="noreferrer"
                              underline="none"
                              sx={{ display: 'inline-flex' }}
                              onClick={(e) => e.stopPropagation()}
                              onKeyDown={(e) => e.stopPropagation()}
                            >
                              {avatarNode}
                            </MuiLink>
                          ) : (
                            avatarNode
                          )}
                        </Tooltip>
                      );
                    })}
                  </Stack>
                ) : null}
              </Box>
            </Box>

            {/* Skills / fun fact + currently working on */}
            {hasCardSections ? (
              <Stack
                spacing={{ xs: 1.2, md: 1.4 }}
                divider={
                  <Divider
                    flexItem
                    sx={{
                      borderColor: 'var(--card-divider)',
                      alignSelf: 'stretch',
                      my: { xs: 1.8, md: 2 },
                    }}
                  />
                }
                sx={{ width: '100%' }}
                alignItems="flex-start"
              >
                {(hasSkills || hasFunFact) ? (
                  <SnapshotSection title={snapshotTitle}>
                    <Box
                      sx={{
                        position: 'relative',
                        width: '100%',
                        display: 'grid',
                        alignItems: 'start',
                        justifyItems: 'start',
                      }}
                    >
                      {hasSkills ? (
                        <Box
                          sx={{
                            gridArea: '1 / 1 / 2 / 2',
                            opacity: isFunFactActive ? 0 : 1,
                            pointerEvents: isFunFactActive ? 'none' : 'auto',
                            transition: 'opacity 260ms ease',
                            width: '100%',
                          }}
                        >
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', gap: 0.9 }}>
                            {skills.map((skill) => (
                              <Chip
                                key={skill}
                                label={skill}
                                {...sharedChipProps}
                                sx={{
                                  ...sharedChipSx,
                                  px: 1.4,
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      ) : null}

                      {hasFunFact ? (
                        <Box
                          sx={{
                            gridArea: '1 / 1 / 2 / 2',
                            opacity: isFunFactActive ? 1 : 0,
                            pointerEvents: isFunFactActive ? 'auto' : 'none',
                            transition: 'opacity 260ms ease',
                            width: '100%',
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'var(--text-primary)',
                              lineHeight: 1.6,
                              fontSize: { xs: '0.82rem', md: '0.88rem' },
                              maxWidth: 300,
                            }}
                          >
                            {funFact}
                          </Typography>
                        </Box>
                      ) : null}
                    </Box>
                  </SnapshotSection>
                ) : null}

                {currentlyWorkingOn ? (
                  <SnapshotSection title="Currently Working On:">
                    <Typography
                      variant="body2"
                      sx={{ color: 'var(--text-primary)', lineHeight: 1.5, textAlign: 'left', maxWidth: 320 }}
                    >
                      {currentlyWorkingOn}
                    </Typography>
                  </SnapshotSection>
                ) : null}
              </Stack>
            ) : null}
          </Stack>
        </Box>

      </Box>
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
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'stretch', justifyContent: 'center', p: 1.5 }}>
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
