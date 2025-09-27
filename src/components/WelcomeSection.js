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
  const contactHeading = contactDetails?.heading ?? 'On Campus';
  const contactCta = contactDetails?.cta ?? null;

  const avatarSrc = assetMap[welcomeData?.avatar] ?? null;
  const contactChannels = contactData?.channels ?? [];
  const shouldFlyLeft = heroCollapsed || Boolean(activeSection);

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
                p: { xs: 2.2, md: 2.6 },
                borderRadius: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.78)',
                border: '1px solid rgba(15, 23, 42, 0.08)',
              }}
            >
              <Stack spacing={1.6}>
                <Typography
                  variant="overline"
                  sx={{ letterSpacing: 3, fontWeight: 600, color: 'rgba(15, 23, 42, 0.72)' }}
                >
                  {contactHeading}
                </Typography>

                <Stack spacing={1.1}>
                  {contactItems.map((item) => (
                    <Stack key={item.label ?? item.value} spacing={0.2}>
                      {item.label ? (
                        <Typography
                          variant="caption"
                          sx={{
                            textTransform: 'uppercase',
                            letterSpacing: 1.4,
                            color: 'rgba(15, 23, 42, 0.58)',
                            fontWeight: 600,
                          }}
                        >
                          {item.label}
                        </Typography>
                      ) : null}
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#0f172a' }}>
                        {item.value}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>

                {contactCta?.href ? (
                  <Button
                    component="a"
                    href={contactCta.href}
                    target="_blank"
                    rel="noreferrer"
                    variant="contained"
                    size="medium"
                    sx={{
                      alignSelf: 'flex-start',
                      bgcolor: '#1f2937',
                      color: '#f8fafc',
                      fontWeight: 700,
                      textTransform: 'none',
                      letterSpacing: 0.6,
                      px: 2.8,
                      py: 1,
                      borderRadius: 999,
                      boxShadow: '0 12px 22px rgba(15, 23, 42, 0.24)',
                      '&:hover': {
                        bgcolor: '#111827',
                        boxShadow: '0 16px 30px rgba(15, 23, 42, 0.28)',
                      },
                    }}
                  >
                    {contactCta.label ?? 'View calendar'}
                  </Button>
                ) : null}
              </Stack>
            </Paper>
          )}

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
