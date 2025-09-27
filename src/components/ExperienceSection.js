// src/components/ExperienceSection.js
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Avatar,
  Box,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import Groups2RoundedIcon from '@mui/icons-material/Groups2Rounded';
import { experience as experienceData, experienceCopy } from '../data';
import tulaneBadge from '../assets/tulane.png';
import hfBadge from '../assets/hf.png';

const MAX_STACK_DEPTH = 2;
const MAX_OFFSET_X = 50;
const CARD_HEIGHT_MD = 400;
const CARD_HEIGHT_SM = 350;
const RIGHT_GUTTER = 24;

function ExperienceSection({ navOffset = false }) {
  const currentJobs = experienceData?.current ?? [];
  const pastJobs = experienceData?.history ?? [];

  const overview = experienceCopy ?? {};
  const statsCopy = overview.stats ?? {};
  const activeDescription = statsCopy.active?.description ?? '';
  const yearsDescription = statsCopy.years?.description ?? '';
  const teamsDescription = statsCopy.teams?.description ?? '';

  const activeRoles = currentJobs.length;
  const archivedRoles = pastJobs.length;

  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const [activeJobIndex, setActiveJobIndex] = useState(0);
  const cardBaseHeight = isMdUp ? CARD_HEIGHT_MD : CARD_HEIGHT_SM;

  const rolodexContainerRef = useRef(null);
  const [availableRightSpace, setAvailableRightSpace] = useState(MAX_OFFSET_X * MAX_STACK_DEPTH);

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

  useEffect(() => {
    if (!currentJobs.length) {
      setActiveJobIndex(0);
      return;
    }

    setActiveJobIndex((prev) => (prev >= currentJobs.length ? currentJobs.length - 1 : prev));
  }, [currentJobs.length]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    if (!isMdUp) {
      setAvailableRightSpace(MAX_OFFSET_X * MAX_STACK_DEPTH);
      return undefined;
    }

    const updateRightSpace = () => {
      const container = rolodexContainerRef.current;
      if (!container) {
        setAvailableRightSpace(MAX_OFFSET_X * MAX_STACK_DEPTH);
        return;
      }

      const rect = container.getBoundingClientRect();
      const viewportWidth = window.innerWidth || 0;
      const availableSpace = Math.max(0, viewportWidth - rect.right - RIGHT_GUTTER);
      setAvailableRightSpace(availableSpace);
    };

    updateRightSpace();
    window.addEventListener('resize', updateRightSpace);

    let resizeObserver;
    if (typeof ResizeObserver !== 'undefined' && rolodexContainerRef.current) {
      resizeObserver = new ResizeObserver(() => updateRightSpace());
      resizeObserver.observe(rolodexContainerRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateRightSpace);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [isMdUp]);

  const statsItems = useMemo(
    () =>
      [
        {
          key: 'active',
          label: 'Active Roles',
          value: activeRoles,
          description: activeDescription,
          icon: WorkspacePremiumRoundedIcon,
        },
        computedYears
          ? {
              key: 'years',
              label: 'Years Spanning',
              value: computedYears,
              description: yearsDescription,
              icon: AccessTimeRoundedIcon,
            }
          : null,
        {
          key: 'teams',
          label: 'Teams Partnered',
          value: activeRoles + archivedRoles,
          description: teamsDescription,
          icon: Groups2RoundedIcon,
        },
      ].filter(Boolean),
    [activeDescription, activeRoles, archivedRoles, computedYears, teamsDescription, yearsDescription]
  );

  const technicalHighlights = useMemo(() => {
    if (Array.isArray(overview?.technicalHighlights) && overview.technicalHighlights.length > 0) {
      return overview.technicalHighlights.slice(0, 3);
    }

    return [
      'Lead end-to-end ML experiments from data prep to deployment.',
      'Scale research prototypes into production services across teams.',
      'Champion collaborative workflows between engineers and scientists.',
    ];
  }, [overview?.technicalHighlights]);

  const totalJobs = currentJobs.length;
  const safeActiveIndex = totalJobs > 0 ? Math.max(0, Math.min(activeJobIndex, totalJobs - 1)) : 0;
  const trailingCardCount = Math.min(MAX_STACK_DEPTH, Math.max(0, totalJobs - 1));
  const offsetDivisor = trailingCardCount === 0 ? 1 : trailingCardCount;
  const normalizedOffsetX = Math.max(0, Math.min(MAX_OFFSET_X, availableRightSpace / offsetDivisor));

  const getBadgeForJob = (job) => {
    const sub = (job?.subtitle || '').toLowerCase();
    const title = (job?.title || '').toLowerCase();

    if (sub.includes('tulane') || title.includes('tulane')) {
      return tulaneBadge;
    }

    if (sub.includes('healthfirst') || title.includes('healthfirst')) {
      return hfBadge;
    }

    return null;
  };

  const renderJobCardBody = (job, isActive, hasNav) => {
    const badgeSrc = getBadgeForJob(job);
    const bullets = Array.isArray(job?.bullets) ? job.bullets : [];
    const summary = typeof job?.summary === 'string' && job.summary.trim().length > 0 ? job.summary.trim() : '';
    const hasDetails = summary || bullets.length > 0;

    return (
      <Stack
        spacing={1.4}
        sx={{
          height: '100%',
          pt: isActive && hasNav ? 2.4 : 0.8,
          pb: hasNav ? 3.6 : 1.4,
          transition: 'padding 160ms ease',
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" sx={{ flexShrink: 0 }}>
          {badgeSrc ? <Avatar src={badgeSrc} alt={job?.subtitle ?? 'Organization'} sx={{ width: 40, height: 40 }} /> : null}
          <Stack spacing={0.4}>
            {job?.subtitle ? (
              <Typography variant="caption" sx={{ fontWeight: 600, letterSpacing: 0.6 }}>
                {job.subtitle}
              </Typography>
            ) : null}
            {job?.title ? (
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {job.title}
              </Typography>
            ) : null}
            {job?.timeframe ? (
              <Typography variant="body2" color="text.secondary">
                {job.timeframe}
              </Typography>
            ) : null}
          </Stack>
        </Stack>

        {hasDetails ? (
          <Stack
            spacing={1.2}
            aria-hidden={!isActive}
            sx={{
              mt: 1.6,
              flexGrow: 1,
              opacity: isActive ? 1 : 0,
              visibility: isActive ? 'visible' : 'hidden',
              pointerEvents: isActive ? 'auto' : 'none',
              transition: 'opacity 160ms ease',
            }}
          >
            {summary ? (
              <Typography variant="body1" sx={{ color: 'rgba(15, 23, 42, 0.84)', lineHeight: 1.6 }}>
                {summary}
              </Typography>
            ) : null}

            {bullets.length > 0 ? (
              <Box
                component="ul"
                sx={{
                  listStyle: 'none',
                  m: 0,
                  p: 0,
                  display: 'grid',
                  rowGap: 0.75,
                }}
              >
                <Typography
                  component="li"
                  variant="subtitle2"
                  sx={{ fontWeight: 700, color: 'rgba(15, 23, 42, 0.9)', mb: 0.2 }}
                >
                  Highlights
                </Typography>
                {bullets.map((bullet, idx) => (
                  <Typography
                    key={idx}
                    component="li"
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      position: 'relative',
                      paddingLeft: '1.45rem',
                      lineHeight: 1.62,
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: '0.55rem',
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: 'rgba(var(--experience-rgb), 0.75)',
                        boxShadow: '0 0 12px rgba(var(--experience-rgb), 0.38)',
                      },
                    }}
                  >
                    {bullet}
                  </Typography>
                ))}
              </Box>
            ) : null}
          </Stack>
        ) : (
          <Box sx={{ flexGrow: 1, mt: 1.6 }} />
        )}
      </Stack>
    );
  };

  const handleAdvance = (direction) => {
    if (!totalJobs) {
      return;
    }

    setActiveJobIndex((prev) => {
      if (direction === 'next') {
        return (prev + 1) % totalJobs;
      }

      return (prev - 1 + totalJobs) % totalJobs;
    });
  };

  return (
    <Box
      id="experience"
      sx={{
        position: 'relative',
        minWidth: '100vw',
        px: { xs: 3, md: 6, lg: 8 },
        py: { xs: 3, md: 4 },
        scrollMarginTop: { xs: 96, md: 128 },
        background: 'none',
        overflow: 'hidden',
        pl: {
          xs: 0,
          md: navOffset ? 'calc(280px + 48px)' : 0,
          lg: navOffset ? 'calc(320px + 64px)' : 0,
        },
        transition: 'padding-left 620ms cubic-bezier(0.22, 1, 0.36, 1)',
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
        <Grid container spacing={{ xs: 6, md: 8 }} alignItems="stretch">
          {/* Left content, main experience title/content */}
          <Grid item xs={12} md={4} lg={5}>
            <Stack spacing={{ xs: 2.8, md: 3.2 }} alignItems={{ xs: 'flex-start', md: 'flex-start' }}>
              <Stack spacing={1.2}>
                {overview.eyebrow ? (
                  <Typography variant="overline" sx={{ letterSpacing: 3, color: 'text.secondary' }}>
                    {overview.eyebrow}
                  </Typography>
                ) : null}
                {overview.title ? (
                  <Typography variant="h2" fontWeight={700}>
                    {overview.title}
                  </Typography>
                ) : null}
                {overview.description ? (
                  <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 640 }}>
                    {overview.description}
                  </Typography>
                ) : null}
              </Stack>

              <Box
                sx={{
                  borderRadius: 3,
                  border: '1px solid rgba(var(--experience-rgb), 0.3)',
                  background: 'linear-gradient(165deg, rgba(var(--experience-rgb), 0.18) 0%, rgba(255,255,255,0.94) 70%)',
                  p: { xs: 2.2, md: 2.6 },
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.6,
                }}
              >
                <Stack spacing={1.2}>
                  {statsItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Stack key={item.key} direction="row" spacing={1.2} alignItems="center">
                        <Box
                          sx={{
                            width: 42,
                            height: 42,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(var(--experience-rgb), 0.16)',
                          }}
                        >
                          <Icon sx={{ color: 'rgb(var(--experience-rgb))' }} />
                        </Box>
                        <Stack spacing={0.2}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            {item.value} · {item.label}
                          </Typography>
                          {item.description ? (
                            <Typography variant="body2" color="text.secondary">
                              {item.description}
                            </Typography>
                          ) : null}
                        </Stack>
                      </Stack>
                    );
                  })}
                </Stack>

                {technicalHighlights.length > 0 ? (
                  <>
                    <Divider sx={{ borderColor: 'rgba(var(--experience-rgb), 0.3)' }} />
                    <Stack spacing={0.8}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Technical Highlights
                      </Typography>
                      <Box component="ul" sx={{ pl: 3, m: 0, display: 'grid', rowGap: 0.6 }}>
                        {technicalHighlights.map((highlight, idx) => (
                          <Typography key={idx} component="li" variant="body2">
                            {highlight}
                          </Typography>
                        ))}
                      </Box>
                    </Stack>
                  </>
                ) : null}
              </Box>
            </Stack>
          </Grid>

          {/* Right content, role rolodex */}
          <Grid
            id="rolodex"
            item
            xs={12}
            md={7}
            lg={7}
            sx={{
              position: 'relative',
              maxWidth: 1200,
              minHeight: '80vh',
              mx: 'auto',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: 4, md: 6 },
            }}
          >
            {totalJobs === 0 ? (
              <Box sx={{ border: '1px solid #0f172a', borderRadius: 2, p: 2 }}>
                <Typography variant="body2">Experience data unavailable.</Typography>
              </Box>
            ) : isMdUp ? (
              <Box
                ref={rolodexContainerRef}
                sx={{
                  position: 'relative',
                  minHeight: 480,
                  pt: 2,
                  pb: 14,
                  overflow: 'visible',
                }}
              >
                {currentJobs.map((job, index) => {
                  const relativeIndex = (index - safeActiveIndex + totalJobs) % totalJobs;
                  if (relativeIndex > MAX_STACK_DEPTH) {
                    return null;
                  }

                  const depth = relativeIndex;
                  const isActive = relativeIndex === 0;
                  const offsetX = normalizedOffsetX;
                  const offsetY = -116;
                  const translateX = offsetX * depth;
                  const translateY = offsetY * depth;
                  const cardBackground = isActive
                    ? 'linear-gradient(160deg, rgba(var(--experience-rgb), 0.95) 0%, rgba(255,255,255,0.98) 72%)'
                    : 'linear-gradient(164deg, rgba(var(--experience-rgb), 0.78) 0%, rgba(255,255,255,0.92) 85%)';
                  const cardBorder = isActive
                    ? '1px solid rgba(var(--experience-rgb), 0.56)'
                    : '1px solid rgba(var(--experience-rgb), 0.32)';
                  // const cardShadow = isActive
                  //   ? '0 34px 68px -38px rgba(15,23,42,0.55), 0 22px 48px -28px rgba(15,23,42,0.35)'
                  //   : '0 28px 52px -42px rgba(15,23,42,0.35), 0 18px 34px -28px rgba(15,23,42,0.25)';
                  const cardOverlayBorder = isActive ? 'rgba(255,255,255,0.38)' : 'rgba(255,255,255,0.28)';
                  const accentGlow = isActive ? 'rgba(var(--experience-rgb), 0.58)' : 'rgba(var(--experience-rgb), 0.36)';
                  const inactiveOpacity = isActive ? 1 : 0.92;

                  const handleCardClick = (event) => {
                    if (totalJobs <= 1) {
                      return;
                    }
                    event.stopPropagation();
                    if (isActive) {
                      handleAdvance('next');
                    } else {
                      setActiveJobIndex(index);
                    }
                  };

                  return (
                    <Box
                      key={job.title ?? index}
                      onClick={handleCardClick}
                      role={totalJobs > 1 ? 'button' : undefined}
                      tabIndex={totalJobs > 1 ? (isActive ? 0 : -1) : undefined}
                      aria-label={job.title ? `${job.title} role card` : 'Experience role card'}
                      sx={{
                        position: 'absolute',
                        top: '20vh',
                        left: 0,
                        right: 0,
                        width: '100%',
                        transform: `translate3d(${translateX}px, ${translateY}px, 0)`,
                        transformOrigin: 'top left',
                        zIndex: 40 - depth,
                        transition:
                          'transform 180ms ease, box-shadow 220ms ease, background 220ms ease, border 220ms ease, opacity 160ms ease',
                        pointerEvents: 'auto',
                        filter: 'none',
                        opacity: inactiveOpacity,
                        background: cardBackground,
                        border: cardBorder,
                        // boxShadow: cardShadow,
                        backdropFilter: 'blur(14px) saturate(160%)',
                        height: cardBaseHeight,
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 3,
                        padding: { xs: 2.4, md: 2.8 },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          inset: 0,
                          borderRadius: 'inherit',
                          border: `1px solid ${cardOverlayBorder}`,
                          pointerEvents: 'none',
                        },
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          top: 16,
                          left: 24,
                          right: 24,
                          height: 2,
                          borderRadius: 999,
                          background: `linear-gradient(90deg, transparent 0%, ${accentGlow} 18%, rgba(255,255,255,0.65) 48%, ${accentGlow} 82%, transparent 100%)`,
                          opacity: isActive ? 1 : 0.75,
                          pointerEvents: 'none',
                        },
                        '&:hover': totalJobs > 1
                          ? {
                              boxShadow: '100px 0 100px -100px rgba(15,23,42,0.58)',
                              opacity: 1,
                            }
                          : undefined,
                        cursor: totalJobs > 1 ? 'pointer' : 'default',
                      }}
                    >
                      {isActive && totalJobs > 1 ? (
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          sx={{
                            position: 'absolute',
                            bottom: 20,
                            right: 24,
                            border: '1px solid #0f172a',
                            borderRadius: 999,
                            px: 1.4,
                            py: 0.5,
                            backgroundColor: '#fff',
                            boxShadow: '0 18px 28px -22px rgba(15,23,42,0.35)',
                          }}
                        >
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                            {safeActiveIndex + 1} / {totalJobs}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleAdvance('prev');
                            }}
                            aria-label="Show previous role"
                            sx={{
                              border: '1px solid #0f172a',
                              bgcolor: '#fff',
                            }}
                          >
                            <ArrowBackIosNewRoundedIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleAdvance('next');
                            }}
                            aria-label="Show next role"
                            sx={{
                              border: '1px solid #0f172a',
                              bgcolor: '#fff',
                            }}
                          >
                            <ArrowForwardIosRoundedIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      ) : null}

                      {renderJobCardBody(job, isActive, totalJobs > 1)}
                    </Box>
                  );
                })}
              </Box>
            ) : (
              <Stack spacing={2.4}>
                {currentJobs.map((job, index) => (
                  <Box
                    key={job.title ?? index}
                    sx={{
                      borderRadius: 3,
                      border: '1px solid rgba(var(--experience-rgb), 0.32)',
                      background: 'linear-gradient(160deg, rgba(var(--experience-rgb), 0.18) 0%, rgba(255,255,255,0.96) 76%)',
                      p: 2.4,
                    }}
                  >
                    {renderJobCardBody(job, true, false)}
                  </Box>
                ))}
              </Stack>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default ExperienceSection;
