// src/components/ExperienceSection.js
import React from 'react';
import {
  Box,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import Groups2RoundedIcon from '@mui/icons-material/Groups2Rounded';
import { Avatar } from '@mui/material';
import tulaneBadge from '../assets/tulane.png';
import hfBadge from '../assets/hf.png';
import SectionCard from './SectionCard';
import StyledCard from './styled/StyledCard';
import { experience as experienceData, experienceCopy } from '../data';

function ExperienceSection({ navOffset = false }) {
  const currentJobs = experienceData?.current ?? [];
  const pastJobs = experienceData?.history ?? [];

  const overview = experienceCopy ?? {};
  const statsCopy = overview.stats ?? {};
  const snapshotLabel = overview.snapshotLabel ?? '';
  const activeDescription = statsCopy.active?.description ?? '';
  const yearsDescription = statsCopy.years?.description ?? '';
  const teamsDescription = statsCopy.teams?.description ?? '';
  const historyLabel = overview.historyLabel ?? '';

  const activeRoles = currentJobs.length;
  const archivedRoles = pastJobs.length;

  const allTimeframes = currentJobs
    .map((role) => role?.timeframe)
    .filter(Boolean);

  const extractYears = (text) => {
    if (typeof text !== 'string') {
      return [];
    }

    const matches = text.match(/(19|20)\d{2}/g);
    return matches ? matches.map(Number) : [];
  };

  const allYears = allTimeframes.flatMap(extractYears);
  const earliestYear = allYears.length > 0 ? Math.min(...allYears) : null;
  const latestYear = (() => {
    if (!allTimeframes.length) {
      return null;
    }

    const present = allTimeframes.some((range) => /present|current/i.test(range ?? ''));
    if (present) {
      return new Date().getFullYear();
    }

    return allYears.length > 0 ? Math.max(...allYears) : null;
  })();

  const computedYears = (() => {
    if (!earliestYear || !latestYear) {
      return null;
    }

    const span = Math.max(0, latestYear - earliestYear + 1);
    return span >= 1 ? span : null;
  })();

  return (
    <Box
      id="experience"
      sx={{
        position: 'relative',
        minHeight: '100vh',
        minWidth: '100vw',
        px: { xs: 3, md: 6, lg: 8 },
        py: { xs: 6, md: 8 },
        scrollMarginTop: { xs: 96, md: 128 },
        // scroll snapping disabled site-wide
        background: 'none',
        overflow: 'hidden',
        pl: navOffset
          ? { md: 'calc(280px + 48px)', lg: 'calc(320px + 64px)' }
          : undefined,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100vw',
          height: '100%',
          background:
            'radial-gradient(circle at top left, rgba(var(--experience-rgb), 0.18), transparent 55%), linear-gradient(180deg, rgba(var(--experience-rgb), 0.82) 0%, rgba(var(--experience-rgb), 0.62) 52%, rgba(255, 255, 255, 0.92) 100%)',
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '24%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(var(--projects-rgb), 0.12) 100%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          maxWidth: 1200,
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 4, md: 6 },
        }}
      >
        <Grid container spacing={{ xs: 3, md: 4 }} alignItems="stretch">
          <Grid item xs={12} md={7}>
            <Stack spacing={{ xs: 2.5, md: 3 }} alignItems={{ xs: 'flex-start', md: 'flex-start' }}>
              <Stack spacing={1}>
              <Typography variant="overline" sx={{ letterSpacing: 3, color: 'text.secondary' }}>
                {overview.eyebrow ?? ''}
              </Typography>
              <Typography variant="h2" fontWeight={700}>
                {overview.title ?? ''}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 640 }}>
                {overview.description ?? ''}
              </Typography>
            </Stack>

              {/* Highlights intentionally removed per request */}
            </Stack>
          </Grid>

          <Grid item xs={12} md={5}>
            <StyledCard data-variant="project" sx={{ height: '100%' }}>
              <Stack spacing={2.2}>
              {snapshotLabel ? (
                <Typography variant="subtitle2" color="text.secondary" sx={{ letterSpacing: 0.8 }}>
                  {snapshotLabel}
                </Typography>
              ) : null}
              <Stack spacing={1.75}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <WorkspacePremiumRoundedIcon sx={{ color: 'rgb(var(--experience-rgb))' }} />
                  <Stack spacing={0.25}>
                    <Typography variant="h5" fontWeight={700}>
                      {activeRoles}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {activeDescription}
                    </Typography>
                  </Stack>
                </Stack>

                {computedYears && (
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <AccessTimeRoundedIcon sx={{ color: 'rgb(var(--experience-rgb))' }} />
                    <Stack spacing={0.25}>
                      <Typography variant="h5" fontWeight={700}>
                        {computedYears}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {yearsDescription}
                      </Typography>
                    </Stack>
                  </Stack>
                )}

                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Groups2RoundedIcon sx={{ color: 'rgb(var(--experience-rgb))' }} />
                  <Stack spacing={0.25}>
                    <Typography variant="h5" fontWeight={700}>
                      {activeRoles + archivedRoles}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {teamsDescription}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>

              {pastJobs.length > 0 && (
                <>
                  <Divider sx={{ my: 1.75 }} />
                  {historyLabel ? (
                    <Typography variant="subtitle2" color="text.secondary" sx={{ letterSpacing: 0.8 }}>
                      {historyLabel}
                    </Typography>
                  ) : null}
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {pastJobs.map((role, index) => (
                      <Chip
                        key={`${role}-${index}`}
                        label={role}
                        variant="outlined"
                        sx={{
                          borderRadius: 999,
                          borderColor: 'rgba(var(--experience-rgb), 0.26)',
                          backgroundColor: 'rgba(var(--experience-rgb), 0.08)',
                          color: 'rgb(64, 52, 0)',
                        }}
                      />
                    ))}
                  </Stack>
                </>
              )}
              </Stack>
            </StyledCard>
          </Grid>
        </Grid>

        <Divider sx={{ borderStyle: 'dashed', borderColor: 'rgba(var(--experience-rgb), 0.24)' }} />

        <Grid container spacing={{ xs: 3, md: 4 }}>
          {currentJobs.map((job, index) => (
            <Grid key={job.title ?? index} item xs={12} sm={6} lg={4}>
              <SectionCard
                variant="project"
                cornerIcon={(function () {
                  const sub = (job?.subtitle || '').toLowerCase();
                  const title = (job?.title || '').toLowerCase();
                  if (sub.includes('tulane') || title.includes('tulane')) {
                    return (
                      <Avatar src={tulaneBadge} alt="Tulane University" variant="circular" sx={{ width: 30, height: 30, border: '2px solid rgba(255,255,255,0.8)' }} />
                    );
                  }
                  if (sub.includes('healthfirst') || title.includes('healthfirst')) {
                    return (
                      <Avatar src={hfBadge} alt="Healthfirst" variant="circular" sx={{ width: 30, height: 30, border: '2px solid rgba(255,255,255,0.8)' }} />
                    );
                  }
                  return null;
                })()}
                title={job.title}
                subtitle={job.subtitle}
                timeframe={job.timeframe}
                bullets={job.bullets}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default ExperienceSection;
