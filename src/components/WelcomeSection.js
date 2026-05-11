// src/components/WelcomeSection.js
import React, { useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Link as MuiLink,
  Paper,
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
import PhoneEnabledRoundedIcon from '@mui/icons-material/PhoneEnabledRounded';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import idPicture from '../assets/id-picture.jpg';
import icelandPortrait from '../assets/iceland.jpeg';
import hfBadge from '../assets/hf.png';
import tulaneBadge from '../assets/tulane.png';
import hunterBadge from '../assets/hunter.png';
import {
  welcome as welcomeData,
  contact as contactData,
} from '../data';
import { sharedChipProps, sharedChipSx } from '../styles/chipStyles';
import { textOnLight, textOnDark } from '../styles/palette';

const assetSources = {
  'id-picture.jpg': idPicture,
  'iceland.jpeg': icelandPortrait,
  'hf.png': hfBadge,
  'tulane.png': tulaneBadge,
  'hunter.png': hunterBadge,
};

const textPalette = textOnLight;
const textOnDarkSurface = textOnDark;

const channelIcons = {
  email: <EmailOutlinedIcon fontSize="small" />,
  linkedin: <LinkedInIcon fontSize="small" />,
  github: <GitHubIcon fontSize="small" />,
};

const contactDetailIcons = {
  email: <EmailOutlinedIcon fontSize="small" />,
  phone: <PhoneEnabledRoundedIcon fontSize="small" />,
  resume: <FileDownloadOutlinedIcon fontSize="small" />,
  location: <PlaceOutlinedIcon fontSize="small" />,
};

// Shared styling tokens used throughout the welcome layout.
const desktopAvatarFrameSize = 212;
const desktopAvatarSize = 188;
const snapshotHeadingSx = {
  letterSpacing: 3,
  fontWeight: 700,
  color: textPalette.primary,
  textAlign: 'left',
  textTransform: 'uppercase',
  fontSize: { xs: '0.8rem', md: '0.86rem' },
};

// Gives each snapshot card a consistent heading treatment.
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

function WelcomeSection({ navOffset = false, heroCollapsed = false, activeSection = null }) {
  const theme = useTheme();
  const isCompact = useMediaQuery(theme.breakpoints.down('lg'));
  // Resolve badge/avatar filenames into usable URLs once.
  const assetMap = useMemo(() => assetSources, []);

  // Pull core welcome details (text, roles, snapshot content).
  const greeting = welcomeData?.greeting ?? 'Hello,';
  const name = welcomeData?.name ?? '';
  const intro = welcomeData?.intro ?? '';
  const tenSeconds = Array.isArray(welcomeData?.tenSeconds) ? welcomeData.tenSeconds : [];
  const roles = Array.isArray(welcomeData?.roles) ? welcomeData.roles : [];
  const primaryRole = roles.length > 0 ? roles[0] : null;
  const roleChips = roles.filter(Boolean);
  const skills = Array.isArray(welcomeData?.skills) ? welcomeData.skills : [];
  const currentlyWorkingOn = welcomeData?.currentlyWorkingOn ?? null;
  const funFact = welcomeData?.funFact ?? null;
  const affiliations = (welcomeData?.affiliations ?? []).map((affiliation) => ({
    ...affiliation,
    src: assetMap[affiliation.badge] ?? null,
  }));
  const hasCardSections = Boolean(currentlyWorkingOn || funFact || skills.length > 0);
  // Contact meta drives the sidebar links / buttons.
  const contactDetails = welcomeData?.contactDetails ?? {};
  const contactItems = Array.isArray(contactDetails?.items) ? contactDetails.items : [];
  const contactCta = contactDetails?.cta ?? null;
  const campusContactItems = contactItems.filter((item) => (item?.category ?? 'campus') === 'campus');
  const supplementalContactItems = contactItems.filter((item) => (item?.category ?? 'campus') !== 'campus' && item?.type !== 'resume');
  const contactLinkItems = [...campusContactItems, ...supplementalContactItems];
  const resumeContactItem = contactItems.find((item) => item?.type === 'resume');

  const avatarSrc = assetMap[welcomeData?.avatar] ?? null;
  const contactChannels = contactData?.channels ?? [];
  const shouldFlyLeft = heroCollapsed || Boolean(activeSection);
  const showCollapsedAvatar = !isCompact && shouldFlyLeft && avatarSrc;
  // Snapshot toggle state controls swapping core skills vs fun fact.
  const hasSkills = skills.length > 0;
  const hasFunFact = Boolean(funFact);
  const canToggleFunFact = hasSkills && hasFunFact;
  const [showFunFact, setShowFunFact] = useState(() => (!hasSkills && hasFunFact));
  const isFunFactActive = canToggleFunFact ? showFunFact : hasFunFact;
  const snapshotTitle = isFunFactActive ? 'Secret Fun Fact:' : 'Core Skills:';

  // Clicking/keyboard toggles between the two snapshot modes when available.
  const handleAvatarToggle = () => {
    if (!canToggleFunFact) {
      return;
    }
    setShowFunFact((prev) => !prev);
  };

  const handleAvatarKeyDown = (event) => {
    if (!canToggleFunFact) {
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setShowFunFact((prev) => !prev);
    }
  };

  // Maps contact metadata to final hrefs for buttons/links.
  const resolveContactHref = (item) => {
    if (!item) {
      return undefined;
    }

    if (item.type === 'email' && item.value) {
      return `mailto:${item.value}`;
    }

    if (item.type === 'phone' && item.value) {
      const digits = String(item.value).replace(/[^\d+]/g, '');
      return `tel:${digits}`;
    }

    if (item.type === 'resume') {
      return item.href ?? '/Leonardo_Matone_Resume.pdf';
    }

    if (item.href) {
      return item.href;
    }

    if (item.type === 'location' && item.value) {
      return `https://maps.google.com/?q=${encodeURIComponent(item.value)}`;
    }

    return undefined;
  };

  // Renders a contact pill with icon and text, optionally linkable.
  const renderContactLink = (item) => {
    const href = resolveContactHref(item);
    const isExternal = href ? href.startsWith('http') : false;
    const content = (
      <Stack direction="row" spacing={1.1} alignItems="center">
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(var(--dark-cyan-rgb), 0.12)',
            border: '1px solid rgba(var(--dark-cyan-rgb), 0.24)',
            color: textPalette.strong,
          }}
        >
          {contactDetailIcons[item?.type] ?? <LinkIcon fontSize="small" />}
        </Box>
        <Box>
          {item?.label ? (
            <Typography
              variant="caption"
              sx={{ textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600, color: textPalette.muted }}
            >
              {item.label}
            </Typography>
          ) : null}
          <Typography variant="body1" sx={{ fontWeight: 700, color: textPalette.strong }}>
            {item?.value ?? ''}
          </Typography>
        </Box>
      </Stack>
    );

    if (!href) {
      return (
        <Box key={(item?.label ?? '') + (item?.value ?? '')} sx={{ pr: 0.4 }}>
          {content}
        </Box>
      );
    }

    return (
      <MuiLink
        key={(item?.label ?? '') + (item?.value ?? '')}
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noreferrer' : undefined}
        underline="none"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 0.3,
          py: 0.4,
          borderRadius: 2,
          transition: 'transform 200ms ease, background-color 200ms ease, box-shadow 200ms ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            backgroundColor: 'rgba(var(--text-rgb), 0.07)',
            boxShadow: '0 10px 20px rgba(var(--shadow-rgb), 0.18)',
          },
        }}
      >
        {content}
      </MuiLink>
    );
  };

  // Special-case resume so we can show a branded button when present.
  const renderResumeButton = (item) => {
    const href = resolveContactHref(item);
    if (!href) {
      return null;
    }

    const isExternal = href.startsWith('http');
    return (
      <Button
        key={(item?.label ?? '') + (item?.value ?? '')}
        component="a"
        href={href}
        download={item?.download ?? !isExternal}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noreferrer' : undefined}
        startIcon={contactDetailIcons.resume}
        sx={{
          alignSelf: { xs: 'stretch', sm: 'flex-start' },
          backgroundColor: textPalette.primary,
          color: textOnDarkSurface.strong,
          fontWeight: 700,
          textTransform: 'none',
          px: { xs: 2.6, sm: 2.4 },
          py: { xs: 1, sm: 0.8 },
          borderRadius: 2.4,
          boxShadow: '0 12px 24px rgba(15, 23, 42, 0.22)',
          minWidth: { xs: '100%', sm: 200 },
          maxWidth: { xs: '100%', sm: 200 },
          fontSize: { sm: '0.95rem' },
          '&:hover': {
            backgroundColor: '#111827',
            boxShadow: '0 16px 26px rgba(15, 23, 42, 0.24)',
          },
        }}
      >
        {item?.value ?? 'Download Resume'}
      </Button>
    );
  };

  // Mobile layout short-circuits with a condensed single-column presentation.
  if (isCompact) {
    return (
      <Box
        id="welcome"
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: '100%',
          px: { xs: 2.4, sm: 3.4 },
          pt: { xs: 8, sm: 9 },
          pb: { xs: 6, sm: 7 },
          scrollMarginTop: 96,
          backgroundColor: 'transparent',
          color: textPalette.strong,
          boxSizing: 'border-box',
        }}
      >
        <Stack spacing={4.2} sx={{ maxWidth: 960, mx: 'auto' }}>
          {/* Mobile hero summary */}
          <Stack direction="row" spacing={2.2} alignItems="center">
            <Stack spacing={primaryRole ? 0.9 : 0.6}>
              <Typography
                variant="overline"
                sx={{ letterSpacing: 3, color: textPalette.muted, fontWeight: 600 }}
              >
                {greeting}
              </Typography>
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontWeight: 900,
                  fontSize: 'clamp(2.6rem, 6vw, 3.6rem)',
                  lineHeight: 1.5,
                  transition: 'font-size 220ms ease',
                }}
              >
                {name}
              </Typography>
            </Stack>

            {avatarSrc ? (
              <Avatar
                alt={name}
                src={avatarSrc}
                sx={{
                  width: 'clamp(78px, 20vw, 144px)',
                  height: 'clamp(78px, 20vw, 144px)',
                  border: '3px solid rgba(0, 0, 0, 0.12)',
                  boxShadow: '0 12px 26px rgba(15, 23, 42, 0.16)',
                  transition: 'width 220ms ease, height 220ms ease',
                }}
              />
            ) : null}
          </Stack>

          {contactChannels.length > 0 ? (
            <Stack direction="row" spacing={0.6} flexWrap="wrap" rowGap={0.75}>
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
                        color: textPalette.primary,
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
          ) : null}

          {intro ? (
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1.08rem', sm: '1.12rem' },
                lineHeight: 1.7,
                color: textPalette.primary,
              }}
            >
              {intro}
            </Typography>
          ) : null}

          {roleChips.length > 0 ? (
            <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={0.6}>
              {roleChips.map((role) => (
                <Chip
                  key={role}
                  label={role}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(var(--text-rgb), 0.10)',
                    color: textPalette.strong,
                    fontWeight: 600,
                    letterSpacing: 0.4,
                  }}
                />
              ))}
            </Stack>
          ) : null}

          {tenSeconds.length > 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.4, sm: 2.8 },
                borderRadius: 3,
                backgroundColor: 'var(--surface-raised)',
                border: '1px solid var(--border-soft)',
                boxShadow: '0 12px 32px rgba(var(--shadow-rgb), 0.12)',
              }}
            >
              <Stack spacing={1.4}>
                <Typography
                  variant="overline"
                  sx={{ letterSpacing: 3, fontWeight: 600, color: textPalette.muted }}
                >
                  Me in 10 seconds
                </Typography>
                <Stack spacing={1.2}>
                  {tenSeconds.map((paragraph, index) => (
                    <Typography
                      key={index}
                      variant="body1"
                      sx={{
                        fontSize: { xs: '1.05rem', sm: '1.1rem' },
                        lineHeight: 1.7,
                        color: textPalette.primary,
                      }}
                    >
                      {paragraph}
                    </Typography>
                  ))}
                </Stack>
              </Stack>
            </Paper>
          ) : null}

          {skills.length > 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.2, sm: 2.6 },
                borderRadius: 3,
                backgroundColor: 'var(--surface-raised)',
                border: '1px solid var(--border-soft)',
              }}
            >
              <Stack spacing={1.0}>
                <Typography
                  variant="overline"
                  sx={{
                    letterSpacing: 3,
                    fontWeight: 700,
                    color: textPalette.primary,
                    textAlign: 'left',
                  }}
                >
                  Core Skills
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {skills.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      {...sharedChipProps}
                      sx={{
                        ...sharedChipSx,
                      }}
                    />
                  ))}
                </Box>
              </Stack>
            </Paper>
          ) : null}

          {contactLinkItems.length > 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.2, sm: 2.6 },
                borderRadius: 3,
                backgroundColor: 'var(--surface-raised)',
                border: '1px solid var(--border-soft)',
              }}
            >
              <Stack spacing={1.2}>
                {contactLinkItems.map((item) => renderContactLink(item))}
              </Stack>
            </Paper>
          ) : null}

          {(resumeContactItem || contactCta?.href) ? (
            <Stack
              spacing={1}
              direction={{ xs: 'column', sm: 'row' }}
              alignItems={{ xs: 'stretch', sm: 'center' }}
              justifyContent="flex-start"
              sx={{
                gap: { xs: 1, sm: 1.4 },
                mt: 0.5,
              }}
            >
              {resumeContactItem ? renderResumeButton(resumeContactItem) : null}
              {contactCta?.href ? (
                <Button
                  component="a"
                  href={contactCta.href}
                  target="_blank"
                  rel="noreferrer"
                  variant="outlined"
                  size="medium"
                  sx={{
                    alignSelf: { xs: 'stretch', sm: 'flex-start' },
                    textTransform: 'none',
                    fontWeight: 700,
                    letterSpacing: 0.6,
                    borderRadius: 2.1,
                    borderColor: 'var(--border-strong)',
                    color: textPalette.strong,
                  px: { xs: 2.6, sm: 2.2 },
                  py: { xs: 0.88, sm: 0.72 },
                  minWidth: { xs: '100%', sm: 200 },
                  maxWidth: { xs: '100%', sm: 200 },
                  fontSize: { sm: '0.95rem' },
                    '&:hover': {
                      borderColor: textPalette.strong,
                      backgroundColor: 'rgba(var(--text-rgb), 0.10)',
                    },
                  }}
                >
                  {contactCta.label ?? 'Reserve a time'}
                </Button>
              ) : null}
            </Stack>
          ) : null}
        </Stack>
      </Box>
    );
  }

  // Desktop layout shows the hero narrative alongside the avatar column.
  return (
    <Box
      id="welcome"
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        height: '100vh',
        minHeight: '100vh',
        paddingRight: { xs: 3, md: 6, lg: 8 },
        paddingLeft: { lg: 20 },
        scrollMarginTop: { xs: 96, md: 128 },
        backgroundColor: 'transparent',
        color: textPalette.strong,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        transition: 'padding-left 620ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          maxWidth: 1280,
          mx: 'auto',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          columnGap: { xs: 0, md: 5 },
          rowGap: { xs: 4, md: 0 },
          alignItems: 'stretch',
          minHeight: 0,
        }}
      >

        {/* Intro content */}
        <Stack
          id="intro"
          spacing={{ xs: 3, md: 3.6 }}
          sx={{
            flex: { xs: 1, md: 2.25 },
            minHeight: 0,
            justifyContent: 'center',
            overflow: { xs: 'visible', md: 'auto' },
            pr: { xs: 0, md: 3 },
          }}
        >
          <Stack spacing={1.6}>
            <Typography
              variant="overline"
              sx={{ letterSpacing: 3, color: textPalette.muted, fontWeight: 600 }}
            >
              {greeting}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { xs: 'flex-start', md: 'center' },
                gap: { xs: 1.8, md: 2.4 },
                flexWrap: 'wrap',
              }}
            >
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontWeight: 1000,
                  fontSize: { xs: '3.4rem', md: '3.9rem', lg: '4.3rem' },
                  lineHeight: 1.08,
                  textAlign: 'left',
                  minWidth: 0,
                }}
              >
                {name}
              </Typography>

              <Stack
                direction="row"
                spacing={0.6}
                alignItems="center"
                rowGap={0.5}
                flexWrap="wrap"
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
                          color: textPalette.primary,
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

              {showCollapsedAvatar ? (
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 118,
                    height: 118,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(var(--dark-cyan-rgb), 0.35) 0%, rgba(var(--dark-cyan-rgb), 0.18) 100%)',
                    border: '2px solid rgba(255, 255, 255, 0.68)',
                    boxShadow: '0 24px 36px rgba(85, 134, 140, 0.28)',
                    ml: { md: 2 },
                  }}
                >
                  <Avatar
                    alt={name || 'Profile'}
                    src={avatarSrc ?? undefined}
                    sx={{
                      width: 100,
                      height: 100,
                      border: '4px solid rgba(255, 255, 255, 0.82)',
                    }}
                  />
                </Box>
              ) : null}
            </Box>
          {intro ? (
            <Typography
              variant="body1"
              sx={{
                maxWidth: 720,
                fontSize: { xs: '1.06rem', md: '1.12rem' },
                lineHeight: 1.7,
                color: textPalette.primary,
              }}
            >
              {intro}
            </Typography>
          ) : null}
          </Stack>

          {roleChips.length > 0 && (
            <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={0.6}>
              {roleChips.map((role) => (
                <Chip
                  key={role}
                  label={role}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(var(--text-rgb), 0.10)',
                    color: textPalette.strong,
                    fontWeight: 600,
                    letterSpacing: 0.4,
                  }}
                />
              ))}
            </Stack>
          )}
          {tenSeconds.length > 0 && (
            <Stack spacing={1.4}>
              <Typography
                variant="overline"
                sx={{ letterSpacing: 3, fontWeight: 600, color: textPalette.muted }}
              >
                Me in 10 seconds:
              </Typography>
              <Stack spacing={1.2}>
                {tenSeconds.map((paragraph, index) => (
                  <Typography
                    key={index}
                    variant="body1"
                    sx={{
                      fontSize: { xs: '1.08rem', md: '1.14rem' },
                      lineHeight: 1.8,
                      color: textPalette.primary,
                    }}
                  >
                    {paragraph}
                  </Typography>
                ))}
              </Stack>
            </Stack>
          )}

          {contactItems.length > 0 && (
            <Paper
              elevation={0}
              sx={{
                p: { xs: 1.9, md: 2.3 },
                borderRadius: 2.6,
                backgroundColor: 'var(--surface-overlay)',
                border: '1px solid var(--border-default)',
              }}
            >
              <Stack spacing={1.6}>
                {contactLinkItems.length > 0 ? (
                  <Box
                    sx={{
                      display: 'grid',
                      gap: { xs: 1, md: 1.2 },
                      gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, minmax(0, 1fr))',
                      },
                    }}
                  >
                    {contactLinkItems.map((item) => renderContactLink(item))}
                  </Box>
                ) : null}
              </Stack>
            </Paper>
          )}

          {(resumeContactItem || contactCta?.href) ? (
            <Stack
              spacing={1}
              direction={{ xs: 'column', sm: 'row' }}
              alignItems={{ xs: 'stretch', sm: 'center' }}
              justifyContent="flex-start"
              sx={{
                gap: { xs: 1, sm: 1.4 },
                mt: 1,
              }}
            >
              {resumeContactItem ? renderResumeButton(resumeContactItem) : null}
              {contactCta?.href ? (
                <Button
                  component="a"
                  href={contactCta.href}
                  target="_blank"
                  rel="noreferrer"
                  variant="outlined"
                  size="medium"
                  sx={{
                    alignSelf: { xs: 'stretch', sm: 'flex-start' },
                    textTransform: 'none',
                    fontWeight: 700,
                    letterSpacing: 0.6,
                    borderRadius: 2.1,
                    borderColor: 'var(--border-strong)',
                    color: textPalette.strong,
                    px: { xs: 2.6, sm: 2.2 },
                    py: { xs: 0.88, sm: 0.72 },
                    minWidth: { xs: '100%', sm: 200 },
                    maxWidth: { xs: '100%', sm: 200 },
                    fontSize: { sm: '0.95rem' },
                    '&:hover': {
                      borderColor: textPalette.strong,
                      backgroundColor: 'rgba(var(--text-rgb), 0.10)',
                    },
                  }}
                >
                  {contactCta.label ?? 'Reserve a time'}
                </Button>
              ) : null}
            </Stack>
          ) : null}

          </Stack>

        {/* Snapshot column: avatar, rotating snapshot content, contact links */}
        <Box
          sx={(theme) => ({
            flex: { xs: 'none', md: '0 0 312px' },
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 0,
            ml: { md: 'auto' },
            maxWidth: { md: 312 },
            transition: 'transform 680ms cubic-bezier(0.22, 1, 0.36, 1), opacity 360ms ease',
            transform: 'translateX(0)',
            opacity: 1,
            [theme.breakpoints.up('md')]: {
              transform: shouldFlyLeft ? 'translateX(-140%)' : 'translateX(0)',
              opacity: shouldFlyLeft ? 0 : 1,
              pointerEvents: shouldFlyLeft ? 'none' : 'auto',
            },
          })}
        >
          <Box
            onClick={handleAvatarToggle}
            onKeyDown={handleAvatarKeyDown}
            role={canToggleFunFact ? 'button' : undefined}
            tabIndex={canToggleFunFact ? 0 : undefined}
            aria-pressed={canToggleFunFact ? isFunFactActive : undefined}
            aria-label={canToggleFunFact ? 'Toggle fun fact view' : undefined}
            sx={{
              borderRadius: { xs: 3, md: 4 },
              border: 'none',
              background: 'linear-gradient(180deg, rgba(var(--welcome-rgb), 0.55) 0%, var(--surface-base) 100%)',
              boxShadow: '0 24px 64px rgba(var(--shadow-rgb), 0.28)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              width: { xs: '100%', sm: 'min(320px, 100%)', md: 312 },
              minWidth: { xs: 'auto', md: 312 },
              maxWidth: { xs: '100%', md: 312 },
              mr: { md: 0 },
              ml: { md: 'auto' },
              minHeight: 'auto',
              maxHeight: 'none',
              overflowY: 'visible',
              mt: { xs: 3, md: 2 },
              px: { xs: 2.4, sm: 2.8, md: 3.2 },
              py: { xs: 2.6, sm: 3, md: 3.6 },
              transition: 'transform 280ms ease, box-shadow 280ms ease',
              willChange: 'transform, box-shadow',
              cursor: canToggleFunFact ? 'pointer' : 'default',
              outline: 'none',
              textAlign: 'left',
              font: 'inherit',
              '&:hover': {
                transform: 'translateY(-10px)',
                boxShadow: '0 32px 72px rgba(85, 134, 140, 0.36)',
              },
              ...(canToggleFunFact
                ? {
                    '&:hover .avatar-ring': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 36px 64px rgba(85, 134, 140, 0.36)',
                    },
                  }
                : {}),
              '&:focus-visible': {
                outline: '3px solid rgba(var(--dark-cyan-rgb), 0.38)',
                outlineOffset: 6,
              },
            }}
          >
            <Stack
              id="avatar-block"
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
              sx={{ width: '100%', flexGrow: 1, minHeight: 0 }}
            >
              <Box sx={{ width: '100%' }}>
                {/* Avatar portrait with hover ring and primary role */}
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
                  <Box
                    className="avatar-ring"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: { xs: 'min(212px, 56vw)', sm: 'min(220px, 46vw)', md: desktopAvatarFrameSize },
                      height: { xs: 'min(212px, 56vw)', sm: 'min(220px, 46vw)', md: desktopAvatarFrameSize },
                      borderRadius: '50%',
                      background:
                        'linear-gradient(135deg, rgba(var(--dark-cyan-rgb), 0.38) 0%, rgba(var(--dark-cyan-rgb), 0.16) 100%)',
                      border: '2px solid rgba(255, 255, 255, 0.65)',
                      boxShadow: '0 28px 44px rgba(85, 134, 140, 0.34)',
                      transition: 'transform 260ms ease, box-shadow 260ms ease',
                    }}
                  >
                    <Avatar
                      alt={name || 'Profile'}
                      src={avatarSrc ?? undefined}
                      sx={{
                        width: { xs: 'calc(100% - 32px)', sm: 'calc(100% - 36px)', md: desktopAvatarSize },
                        height: { xs: 'calc(100% - 32px)', sm: 'calc(100% - 36px)', md: desktopAvatarSize },
                        border: {
                          xs: '3px solid rgba(255, 255, 255, 0.88)',
                          md: '4px solid rgba(255, 255, 255, 0.82)',
                        },
                        boxShadow: '0 24px 46px rgba(15, 23, 42, 0.24)',
                      }}
                    />
                  </Box>
                  {primaryRole ? (
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 1000,
                        color: textPalette.strong,
                        letterSpacing: 0.6,
                        textAlign: 'center',
                      }}
                    >
                      {primaryRole}
                    </Typography>
                  ) : null}
                  {affiliations.length > 0 ? (
                    <Stack
                      direction="row"
                      spacing={1.1}
                      flexWrap="wrap"
                      rowGap={1}
                      justifyContent="center"
                    >
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
                                onClick={(event) => event.stopPropagation()}
                                onKeyDown={(event) => event.stopPropagation()}
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

              {hasCardSections ? (
                <Stack
                  spacing={{ xs: 2.4, md: 2.6 }}
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
                  sx={{ width: '100%', flexGrow: 1, minHeight: 0 }}
                  alignItems="flex-start"
                >
                  {/* Skills / fun fact snapshot - fades between the two */}
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
                            <Box
                              sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'flex-start',
                                gap: 0.9,
                              }}
                            >
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
                                color: textPalette.primary,
                                textAlign: 'left',
                                // textShadow: '3px 1px 1px rgba(169, 220, 174, 0.88)',
                                lineHeight: 1.6,
                                fontSize: { xs: '0.82rem', md: '0.88rem' },
                                maxWidth: 300,
                                mx: 0,
                              }}
                            >
                              {funFact}
                            </Typography>
                          </Box>
                        ) : null}
                      </Box>
                    </SnapshotSection>
                  ) : null}

                  {/* Current project blurb */}
                  {currentlyWorkingOn ? (
                    <SnapshotSection title="Currently Working On:">
                      <Typography
                        variant="body2"
                        sx={{
                          color: textPalette.primary,
                          lineHeight: 1.5,
                          textAlign: 'left',
                          maxWidth: 320,
                        }}
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
    </Box>
  );
}

export default WelcomeSection;
