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
import SectionCard from './SectionCard';
import { experience as experienceData, experienceCopy } from '../data';

function ExperienceSection() {
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
        px: { xs: 3, md: 6, lg: 8 },
        py: { xs: 6, md: 8 },
        scrollMarginTop: { xs: 96, md: 128 },
        scrollSnapAlign: { xs: 'none', md: 'start' },
        scrollSnapStop: { xs: 'normal', md: 'always' },
        background: 'linear-gradient(180deg, rgba(240, 253, 244, 0.82) 0%, rgba(221, 242, 231, 0.62) 52%, rgba(255, 255, 255, 0.92) 100%)',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at top left, rgba(22, 163, 74, 0.12), transparent 55%)',
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
              <Typography variant="overline" sx={{ letterSpacing: 3, color: 'rgba(22, 101, 52, 0.7)' }}>
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
            <Stack
              spacing={2.2}
              sx={{
                height: '100%',
                p: { xs: 2.5, md: 3 },
                borderRadius: 3,
                border: '1px solid rgba(22, 101, 52, 0.18)',
                background: 'linear-gradient(135deg, rgba(240, 253, 244, 0.95) 0%, rgba(209, 250, 229, 0.88) 100%)',
                boxShadow: '0 18px 38px rgba(22, 101, 52, 0.18)',
              }}
            >
              {snapshotLabel ? (
                <Typography variant="subtitle2" color="text.secondary" sx={{ letterSpacing: 0.8 }}>
                  {snapshotLabel}
                </Typography>
              ) : null}
              <Stack spacing={1.75}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <WorkspacePremiumRoundedIcon sx={{ color: '#14532d' }} />
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
                    <AccessTimeRoundedIcon sx={{ color: '#166534' }} />
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
                  <Groups2RoundedIcon sx={{ color: '#0f5132' }} />
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
                          borderColor: 'rgba(22, 101, 52, 0.26)',
                          backgroundColor: 'rgba(22, 101, 52, 0.08)',
                          color: '#064e3b',
                        }}
                      />
                    ))}
                  </Stack>
                </>
              )}
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ borderStyle: 'dashed', borderColor: 'rgba(22, 101, 52, 0.24)' }} />

        <Grid container spacing={{ xs: 3, md: 4 }}>
          {currentJobs.map((job, index) => (
            <Grid key={job.title ?? index} item xs={12} sm={6} lg={4}>
              <SectionCard
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
