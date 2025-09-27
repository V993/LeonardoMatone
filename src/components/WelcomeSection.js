// src/components/WelcomeSection.js
import React, { useMemo } from 'react';
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
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkIcon from '@mui/icons-material/Link';
import PhoneEnabledRoundedIcon from '@mui/icons-material/PhoneEnabledRounded';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import idPicture from '../assets/id-picture.jpg';
import hfBadge from '../assets/hf.png';
import tulaneBadge from '../assets/tulane.png';
import hunterBadge from '../assets/hunter.png';
import {
  welcome as welcomeData,
  contact as contactData,
} from '../data';
import { sharedChipProps, sharedChipSx } from '../styles/chipStyles';

const assetSources = {
  'id-picture.jpg': idPicture,
  'hf.png': hfBadge,
  'tulane.png': tulaneBadge,
  'hunter.png': hunterBadge,
};

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

function WelcomeSection({ navOffset = false, heroCollapsed = false, activeSection = null }) {
  const assetMap = useMemo(() => assetSources, []);

  const greeting = welcomeData?.greeting ?? 'Hello,';
  const name = welcomeData?.name ?? '';
  const intro = welcomeData?.intro ?? '';
  const tenSeconds = Array.isArray(welcomeData?.tenSeconds) ? welcomeData.tenSeconds : [];
  const roles = Array.isArray(welcomeData?.roles) ? welcomeData.roles : [];
  const primaryRole = roles.length > 0 ? roles[0] : null;
  const supportingRoles = roles.slice(1);
  const skills = Array.isArray(welcomeData?.skills) ? welcomeData.skills : [];
  const affiliations = (welcomeData?.affiliations ?? []).map((affiliation) => ({
    ...affiliation,
    src: assetMap[affiliation.badge] ?? null,
  }));
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

  const resolveContactHref = (item) => {
    if (!item) {
      return undefined;
    }

    if (item.href) {
      return item.href;
    }

    if (item.type === 'email' && item.value) {
      return `mailto:${item.value}`;
    }

    if (item.type === 'phone' && item.value) {
      const digits = String(item.value).replace(/[^\d+]/g, '');
      return `tel:${digits}`;
    }

    if (item.type === 'resume') {
      return '/resume.pdf';
    }

    if (item.type === 'location' && item.value) {
      return `https://maps.google.com/?q=${encodeURIComponent(item.value)}`;
    }

    return undefined;
  };

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
            color: '#0f172a',
          }}
        >
          {contactDetailIcons[item?.type] ?? <LinkIcon fontSize="small" />}
        </Box>
        <Box>
          {item?.label ? (
            <Typography
              variant="caption"
              sx={{ textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600, color: 'rgba(15, 23, 42, 0.56)' }}
            >
              {item.label}
            </Typography>
          ) : null}
          <Typography variant="body1" sx={{ fontWeight: 700, color: '#0f172a' }}>
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
            backgroundColor: 'rgba(15, 23, 42, 0.05)',
            boxShadow: '0 10px 20px rgba(15, 23, 42, 0.14)',
          },
        }}
      >
        {content}
      </MuiLink>
    );
  };

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
          alignSelf: 'flex-start',
          backgroundColor: '#1f2937',
          color: '#f8fafc',
          fontWeight: 700,
          textTransform: 'none',
          px: 2.6,
          py: 1,
          borderRadius: 2.4,
          boxShadow: '0 12px 24px rgba(15, 23, 42, 0.22)',
          '&:hover': {
            backgroundColor: '#111827',
            boxShadow: '0 16px 30px rgba(15, 23, 42, 0.28)',
          },
        }}
      >
        {item?.value ?? 'Download Resume'}
      </Button>
    );
  };

  return (
    <Box
      id="welcome"
      sx={{
        position: 'relative',
        width: '100vw',
        minWidth: '100vw',
        height: '100vh',
        minHeight: '100vh',
        paddingRight: { xs: 3, md: 6, lg: 8 },
        paddingLeft: {lg: 20 },
        // py: { xs: 4, md: 5 },
        scrollMarginTop: { xs: 96, md: 128 },
        backgroundColor: 'transparent',
        color: '#0f172a',
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
              sx={{ letterSpacing: 3, color: 'rgba(15, 23, 42, 0.7)', fontWeight: 600 }}
            >
              {greeting}
            </Typography>

            <Stack 
              direction="row" 
              spacing={4}
              flexWrap="wrap"
              justifyContent="left"
              rowGap={0.5}
            >
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2.9rem', md: '3.4rem', lg: '3.8rem' },
                  lineHeight: 1.08,
                }}
              >
                {name}
              </Typography>
              {/* About Me  */}
              <Stack
                direction="row"
                spacing={0.6}
                flexWrap="wrap"
                justifyContent="center"
                alignItems="center"
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
            {intro ? (
              <Typography
                variant="body1"
                sx={{
                  maxWidth: 720,
                  fontSize: { xs: '1.06rem', md: '1.12rem' },
                  lineHeight: 1.7,
                  color: 'rgba(15, 23, 42, 0.82)',
                }}
              >
                {intro}
              </Typography>
            ) : null}
          </Stack>

          {supportingRoles.length > 0 && (
            <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={0.6}>
              {supportingRoles.map((role) => (
                <Chip
                  key={role}
                  label={role}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(15, 23, 42, 0.08)',
                    color: '#0f172a',
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
                sx={{ letterSpacing: 3, fontWeight: 600, color: 'rgba(15, 23, 42, 0.7)' }}
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
                      color: 'rgba(15, 23, 42, 0.84)',
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
                backgroundColor: 'rgba(255, 255, 255, 0.82)',
                border: '1px solid rgba(15, 23, 42, 0.12)',
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
                    textTransform: 'none',
                    fontWeight: 700,
                    letterSpacing: 0.6,
                    borderRadius: 2.1,
                    borderColor: 'rgba(15, 23, 42, 0.32)',
                    color: '#0f172a',
                    px: 2.6,
                    py: 0.88,
                    minWidth: { xs: '100%', sm: 'auto' },
                    '&:hover': {
                      borderColor: '#0f172a',
                      backgroundColor: 'rgba(15, 23, 42, 0.08)',
                    },
                  }}
                >
                  {contactCta.label ?? 'Reserve a time'}
                </Button>
              ) : null}
            </Stack>
          ) : null}

        </Stack>
        
        {/* Avatar box */}
        <Box
          sx={(theme) => ({
            flex: { xs: 'none', md: 1 },
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 0,
            ml: { md: 'auto' },
            maxWidth: { md: 280 },
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
          <Paper
            elevation={0}
            sx={{
              borderRadius: 5,
              px: { xs: 2.4, sm: 2.8, md: 3.4 },
              py: { xs: 2.6, sm: 3, md: 4 },
              background:
                'linear-gradient(170deg, rgba(var(--dark-cyan-rgb), 0.18) 0%, rgba(255,255,255,0.96) 68%)',
              border: '1px solid rgba(var(--dark-cyan-rgb), 0.24)',
              boxShadow: '0 24px 52px rgba(85, 134, 140, 0.18)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              width: { xs: '100%', sm: 'min(340px, 100%)', md: 320 },
              maxWidth: { xs: '100%', md: 320 },
              mr: { md: 0 },
              ml: { md: 'auto' },
              minWidth: 0,
              height: 'auto',
              overflowY: 'auto',
              mt: { xs: 3, md: 2 },
            }}
          >
            <Stack
              id="avatar-block"
              // spacing={{ xs: 2.6, md: 3.2 }}
              alignItems="center"
              sx={{ width: '100%', justifyContent: 'flex-start', flexGrow: 1, minHeight: 0 }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: { xs: 'min(176px, 52vw)', sm: 'min(188px, 48vw)', md: 164 },
                  height: { xs: 'min(176px, 52vw)', sm: 'min(188px, 48vw)', md: 164 },
                  borderRadius: '50%',
                  background:
                    'linear-gradient(135deg, rgba(var(--dark-cyan-rgb), 0.35) 0%, rgba(var(--dark-cyan-rgb), 0.18) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid rgba(255, 255, 255, 0.65)',
                  boxShadow: '0 24px 36px rgba(85, 134, 140, 0.28)',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    inset: 12,
                    borderRadius: '50%',
                    border: '1px dashed rgba(var(--dark-cyan-rgb), 0.24)',
                    pointerEvents: 'none',
                  },
                }}
              >
                <Avatar
                  alt={name || 'Profile'}
                  src={avatarSrc ?? undefined}
                  sx={{
                    width: { xs: 'calc(100% - 28px)', md: 140 },
                    height: { xs: 'calc(100% - 28px)', md: 140 },
                    border: '4px solid rgba(255, 255, 255, 0.8)',
                  }}
                />
              </Box>
              <br></br>

              {affiliations.length > 0 && (
                <Stack spacing={{ xs: 1.2, md: 1.4 }} sx={{ width: '100%' }}>
                  <Stack direction="row" spacing={1.25} justifyContent="center" flexWrap="wrap">
                    {affiliations.map((affiliation) => (
                      <Avatar
                        key={affiliation.name}
                        alt={affiliation.name}
                        src={affiliation.src ?? undefined}
                        sx={{ width: 44, height: 44 }}
                      />
                    ))}
                  </Stack>
                </Stack>
              )}

              {primaryRole ? (
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 900,
                    textAlign: 'center',
                    color: '#1f2937',
                    textShadow: '0 12px 26px rgba(0,0,0,0.16)',
                    mt: { xs: 1.6, md: 1.8 },
                    paddingBottom: { xs: 1.2, md: 1.4 }
                  }}
                >
                  {primaryRole}
                </Typography>
              ) : null}
              <Divider flexItem sx={{ borderColor: 'rgba(var(--dark-cyan-rgb), 0.18)' }} />

              {skills.length > 0 && (
                <Stack spacing={{ xs: 1.6, md: 1.8 }} sx={{ width: '100%' }}>
                  <Typography
                    variant="overline"
                    sx={{
                      letterSpacing: 3,
                      color: '#1f2937',
                      fontWeight: 700,
                      textAlign: 'center',
                      fontSize: { xs: '0.9rem', md: '1rem' },
                    }}
                  >
                    Core Skills
                  </Typography>
                  <Divider flexItem sx={{ borderColor: 'rgba(var(--dark-cyan-rgb), 0.18)' }} />
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                    {skills.map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        {...sharedChipProps}
                        sx={{
                          ...sharedChipSx,
                          color: '#1f2937',
                          borderColor: 'rgba(31,41,55,0.22)',
                        }}
                      />
                    ))}
                  </Box>
                </Stack>
              )}

              {contactChannels.length > 0 && (
                <Stack spacing={0.8} alignItems="center" sx={{ width: '100%' }}>
                  <Typography
                    variant="overline"
                    sx={{
                      letterSpacing: 3,
                      color: '#1f2937',
                      fontWeight: 700,
                      textAlign: 'center',
                      fontSize: { xs: '0.9rem', md: '1rem' },
                    }}
                  >
                    Quick Links
                  </Typography>
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
            </Stack>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

export default WelcomeSection;
