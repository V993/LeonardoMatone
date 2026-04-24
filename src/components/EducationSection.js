// src/components/EducationSection.js
import React from 'react';
import {
  Avatar,
  Box,
  Chip,
  Divider,
  Link as MuiLink,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { education as educationData } from '../data';
import tulaneBadge from '../assets/tulane.png';
import hunterBadge from '../assets/hunter.png';
import { sharedChipProps, sharedChipSx } from '../styles/chipStyles';

const badgeMap = {
  'Tulane University': tulaneBadge,
  'Hunter College': hunterBadge,
};

const formatEntries = (item) => {
  if (Array.isArray(item.degrees) && item.degrees.length > 0) {
    return item.degrees.map((degree) => ({
      title: degree.title ?? '',
      focusAreas: Array.isArray(degree.focusAreas) ? degree.focusAreas : [],
      highlights: Array.isArray(degree.highlights) ? degree.highlights : [],
      links: Array.isArray(degree.links) ? degree.links : [],
    }));
  }

  const focusAreas = Array.isArray(item.focusAreas) ? item.focusAreas : [];
  const highlights = Array.isArray(item.highlights)
    ? item.highlights
    : Array.isArray(item.achievements)
      ? item.achievements
      : [];
  const links = Array.isArray(item.links) ? item.links : [];

  return [
    {
      title: item.degree ?? '',
      focusAreas,
      highlights,
      links,
    },
  ];
};

const DegreePanel = ({ timeframe, degrees }) => (
  <Stack
    spacing={1.8}
    sx={{
      borderRadius: 3,
      border: '1px solid rgba(var(--education-rgb), 0.14)',
      backgroundColor: 'rgba(255,255,255,1.0)',
      p: { xs: 1.6, md: 1.9 },
      backdropFilter: 'blur(4px)',
      width: '75%',
      justifySelf: 'right'
    }}
  >
    <Stack spacing={0.6}>
      <Typography variant="overline" sx={{ letterSpacing: 3, fontWeight: 600, color: '#000000' }}>
        Academic Track
      </Typography>
      {timeframe ? (
        <Typography variant="body2" sx={{ color: '#000000' }}>
          {timeframe}
        </Typography>
      ) : null}
    </Stack>

    <Stack spacing={1.4}>
      {degrees.map((degree) => (
        <Stack
          key={degree.title}
          spacing={1.1}
          sx={{
            borderRadius: 3,
            border: '1px solid rgba(15, 23, 42, 0.08)',
            backgroundColor: 'rgba(255,255,255,0.68)',
            p: { xs: 1.6, md: 1.9 },
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {degree.title}
          </Typography>
          {degree.focusAreas.length > 0 && (
            <Stack direction="row" spacing={0.6} flexWrap="wrap" rowGap={0.6}>
              {degree.focusAreas.slice(0, 5).map((focus) => (
                <Chip
                  key={focus}
                  label={focus}
                  {...sharedChipProps}
                  sx={{ ...sharedChipSx, fontSize: '0.72rem', px: 1 }}
                />
              ))}
            </Stack>
          )}
        </Stack>
      ))}
    </Stack>
  </Stack>
);

const InstitutionPanel = ({ item, degrees }) => {
  const badgeSrc = badgeMap[item.institution] ?? undefined;
  const combinedHighlights = degrees.flatMap((degree) => degree.highlights);
  const combinedLinks = degrees.flatMap((degree) => degree.links);
  const personalNote = (() => {
    if (typeof item.details === 'string' && item.details.trim().length > 0) {
      return item.details.trim();
    }

    const fallbacks = degrees
      .map((degree) => degree.note || degree.description || degree.summary)
      .filter((entry) => typeof entry === 'string' && entry.trim().length > 0);

    return fallbacks.length > 0 ? fallbacks[0] : null;
  })();
  const hasHighlights = combinedHighlights.length > 0;
  const hasNote = Boolean(personalNote);

  return (
    <Stack
      spacing={1}
      sx={{
        borderRadius: 3,
        border: '1px solid rgba(var(--experience-rgb), 0.16)',
        backgroundColor: 'rgba(255, 255, 255, 1.0)',
        p: { xs: 2.4, md: 2.8 },
        backdropFilter: 'blur(4px)',
        width: '90%',
      }}
    >
      <Stack direction="row" spacing={1.3} alignItems="center">
        <Avatar
          alt={item.institution}
          src={badgeSrc}
          sx={{
            width: 40,
            height: 40,
            bgcolor: 'rgba(var(--education-rgb), 0.2)',
            color: '#000000',
            fontWeight: 700,
          }}
        >
          {(!badgeSrc && item.institution) ? item.institution[0] : null}
        </Avatar>
        <Stack spacing={0.2}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {item.institution}
          </Typography>
          {item.location ? (
            <Typography variant="body2" color="text.secondary">
              {item.location}
            </Typography>
          ) : null}
        </Stack>
      </Stack>

      {hasNote ? (
        <Typography variant="body1" sx={{ color: '#000000', lineHeight: 1.7 }}>
          {personalNote}
        </Typography>
      ) : null}

      {hasHighlights ? (
        <Stack
          component="ul"
          spacing={0.55}
          sx={{ listStyle: 'disc', pl: 2.1, color: '#000000', m: 0 }}
        >
          {combinedHighlights.map((highlight, idx) => (
            <Typography key={idx} component="li" variant="body2">
              {highlight}
            </Typography>
          ))}
        </Stack>
      ) : null}

      {combinedLinks.length > 0 && (
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {combinedLinks.map((link, idx) => (
            <MuiLink
              key={`${link.href}-${idx}`}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              sx={{ fontWeight: 600, color: '#000000' }}
            >
              {link.label}
            </MuiLink>
          ))}
        </Stack>
      )}
    </Stack>
  );
};

const MobileEducationCard = ({ item, timeframe, degrees }) => {
  const badgeSrc = badgeMap[item.institution] ?? undefined;
  const combinedHighlights = degrees.flatMap((degree) => degree.highlights);

  return (
    <Stack
      spacing={1.6}
      sx={{
        borderRadius: 3,
        border: '1px solid rgba(var(--education-rgb), 0.22)',
        backgroundColor: 'rgba(255,255,255,0.92)',
        p: 1.8,
      }}
    >
      <Stack direction="row" spacing={1.2} alignItems="center">
        <Avatar
          alt={item.institution}
          src={badgeSrc}
          sx={{
            width: 44,
            height: 44,
            bgcolor: 'rgba(var(--education-rgb), 0.2)',
            color: '#000000',
            fontWeight: 700,
          }}
        >
          {!badgeSrc && item.institution ? item.institution[0] : null}
        </Avatar>
        <Stack spacing={0.2}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {item.institution}
          </Typography>
          {timeframe ? (
            <Typography variant="body2" sx={{ color: '#000000' }}>
              {timeframe}
            </Typography>
          ) : null}
          {item.location ? (
            <Typography variant="body2" color="text.secondary">
              {item.location}
            </Typography>
          ) : null}
        </Stack>
      </Stack>

      <Stack spacing={1.4}>
        {degrees.map((degree) => (
          <Stack
            key={degree.title}
            spacing={1}
            sx={{
              borderRadius: 3,
              border: '1px solid rgba(15, 23, 42, 0.08)',
              backgroundColor: 'rgba(255,255,255,0.86)',
              p: 1.4,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {degree.title}
            </Typography>
            {degree.focusAreas.length > 0 && (
              <Stack direction="row" spacing={0.6} flexWrap="wrap" rowGap={0.6}>
                {degree.focusAreas.slice(0, 5).map((focus) => (
                  <Chip
                    key={focus}
                    label={focus}
                    {...sharedChipProps}
                    sx={{ ...sharedChipSx, fontSize: '0.7rem', px: 1 }}
                  />
                ))}
              </Stack>
            )}
          </Stack>
        ))}
      </Stack>

      {combinedHighlights.length > 0 ? (
        <Stack spacing={0.6}>
          {combinedHighlights.map((highlight, idx) => (
            <Typography key={idx} variant="body2" sx={{ color: '#000000' }}>
              • {highlight}
            </Typography>
          ))}
        </Stack>
      ) : null}
    </Stack>
  );
};

function EducationSection({ navOffset = false }) {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const timeline = Array.isArray(educationData) ? educationData : [];

  return (
    <Box
      id="education"
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: 'auto',
        pt: { xs: 1, md: 1 },
        pb: { xs: 5, md: 7 },
        pr: { xs: 2.4, md: 6, lg: 8 },
        scrollMarginTop: { xs: 96, md: 128 },
        background: 'none',
        overflowX: 'hidden',
        overflowY: 'visible',
        pl: {
          xs: 2.4,
          md: 6,
          lg: navOffset ? 'calc(320px + 64px)' : 8,
        },
        transition: 'padding-left 620ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
    <Box
      sx={{
        position: 'relative',
        maxWidth: 1200,
        mx: 'auto',
        width: '100%',
      }}
    >
        {/* Education box, removed as it looks weird */}
        {/* <Box
          sx={{
            mb: { xs: 3, md: 4 },
            display: 'inline-flex',
            flexDirection: 'column',
            gap: 1.2,
            px: 2.8,
            py: 2,
            borderRadius: 3,
            // background: 'linear-gradient(135deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.62) 100%)',
            // border: '1px solid rgba(255,255,255,0.6)',
            // boxShadow: '0 8px 32px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            width: '100%',
          }}
        >
          <Typography
            variant="overline"
            sx={{ letterSpacing: 3, fontWeight: 700, color: '#ffffff' }}
          >
            Academic Journey
          </Typography>
          <Typography variant="h2" fontWeight={700} sx={{ color: '#ffffff' }}>
            Education
          </Typography>
        </Box> */}
        <Stack
          spacing={{ xs: 4, md: 6 }}
          sx={(theme) => ({
           	position: 'relative',
           	mt: { xs: 3, md: 4 },
           	[theme.breakpoints.up('md')]: {
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -12,
                bottom: -25,
                left: '50%',
                width: 4,
                transform: 'translateX(-2px)',
                backgroundColor: 'rgba(255, 255, 255, 0.96)',
                boxShadow: '0 0 20px rgba(255, 255, 255, 0.42)',
                zIndex: 1,
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -30,
                left: '50%',
                width: 28,
                height: 24,
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(255, 255, 255, 0.96)',
                clipPath: 'polygon(50% 100%, 0 0, 100% 0)',
                boxShadow: '0 12px 24px rgba(255, 255, 255, 0.28)',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                zIndex: 1,
              },
            },
          })}
        >
          {timeline.map((item, index) => {
            const entries = formatEntries(item);

            if (!isMdUp) {
              return (
                <React.Fragment key={`${item.institution}-${item.timeframe}-${index}`}>
                  <MobileEducationCard item={item} timeframe={item.timeframe} degrees={entries} />
                  {index < timeline.length - 1 ? (
                    <Divider
                      sx={{
                        alignSelf: 'stretch',
                        borderColor: 'rgba(255,255,255,0.35)',
                        borderStyle: 'dashed',
                      }}
                    />
                  ) : null}
                </React.Fragment>
              );
            }

            return (
              <React.Fragment key={`${item.institution}-${item.timeframe}-${index}`}>
                <Box
                  sx={{
                    position: 'relative',
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      md: 'minmax(0, 1fr) 40px minmax(0, 1fr)',
                    },
                    columnGap: { md: 2.6 },
                    rowGap: { xs: 1.6, md: 0 },
                    alignItems: 'stretch',
                  }}
                >
                <Box sx={{ order: { xs: 1, md: 1 }, position: 'relative', zIndex: 2 }}>
                  <DegreePanel timeframe={item.timeframe} degrees={entries} />
                </Box>

                <Box
                  sx={{
                    order: { xs: 3, md: 2 },
                    display: { xs: 'none', md: 'flex' },
                    justifyContent: 'center',
                    alignItems: 'center',
                    py: { md: 0 },
                  }}
                >
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    border: '3px solid rgba(var(--education-rgb), 0.35)',
                    boxShadow: '0 0 18px rgba(255, 255, 255, 0.52)',
                    position: 'relative',
                    zIndex: 2,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: -10,
                      borderRadius: '50%',
                      border: '1px dashed rgba(134, 239, 172, 0.45)',
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      inset: -4,
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(134, 239, 172, 0.28) 0%, rgba(134, 239, 172, 0) 70%)',
                      zIndex: -1,
                    },
                  }}
                />
              </Box>

                  <Box sx={{ order: { xs: 2, md: 3 }, position: 'relative', zIndex: 2}}>
                    <InstitutionPanel item={item} degrees={entries} />
                  </Box>
                </Box>
                {index < timeline.length - 1 ? (
                  <Divider
                    sx={{
                      alignSelf: 'stretch',
                      borderColor: 'rgba(255,255,255,0.25)',
                      borderStyle: 'dashed',
                      display: { xs: 'block', md: 'none' },
                    }}
                  />
                ) : null}
              </React.Fragment>
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
}

export default EducationSection;
