// src/components/EducationSection.js
import React from 'react';
import {
  Avatar,
  Box,
  Chip,
  Link as MuiLink,
  Stack,
  Typography,
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
      backgroundColor: 'rgba(255,255,255,0.82)',
      p: { xs: 1.6, md: 1.9 },
      backdropFilter: 'blur(4px)',
    }}
  >
    <Stack spacing={0.6}>
      <Typography variant="overline" sx={{ letterSpacing: 3, fontWeight: 600, color: 'rgba(30,64,175,0.72)' }}>
        Academic Track
      </Typography>
      {timeframe ? (
        <Typography variant="body2" color="rgba(15, 23, 42, 0.72)">
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
      spacing={1.8}
      sx={{
        borderRadius: 3,
        border: '1px solid rgba(var(--experience-rgb), 0.16)',
        backgroundColor: 'rgba(255,255,255,0.74)',
        p: { xs: 1.6, md: 1.9 },
        backdropFilter: 'blur(4px)',
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
            color: '#1f2937',
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
        <Typography variant="body1" sx={{ color: 'rgba(15, 23, 42, 0.82)', lineHeight: 1.7 }}>
          {personalNote}
        </Typography>
      ) : null}

      {hasHighlights ? (
        <Stack
          component="ul"
          spacing={0.55}
          sx={{ listStyle: 'disc', pl: 2.1, color: 'rgba(15, 23, 42, 0.82)', m: 0 }}
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
              sx={{ fontWeight: 600, color: 'rgba(37, 99, 235, 0.9)' }}
            >
              {link.label}
            </MuiLink>
          ))}
        </Stack>
      )}
    </Stack>
  );
};

function EducationSection({ navOffset = false }) {
  const timeline = Array.isArray(educationData) ? educationData : [];

  return (
    <Box
      id="education"
      sx={{
        position: 'relative',
        minWidth: '100vw',
        minHeight: 'auto',
        paddingBottom: '5vh',
        px: { xs: 3, md: 6, lg: 8 },
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
        maxWidth: 980,
        mx: 'auto',
        width: '100%',
      }}
    >
        <Box
          sx={{
            position: 'relative',
            mt: { xs: 3, md: 4 },
            display: 'grid',
            rowGap: { xs: 2.4, md: 3.2 },
            overflow: 'visible',
            '&::before': {
              content: '""',
              position: 'absolute',
              display: { xs: 'none', md: 'block' },
              left: '50%',
              top: 0,
              bottom: -56,
              width: '4px',
              height: 'calc(100% + 56px)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              boxShadow: '0 0 22px rgba(255, 255, 255, 0.48)',
              transform: 'translateX(-2px)',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              display: { xs: 'none', md: 'block' },
              left: 'calc(50% - 8px)',
              bottom: -72,
              width: 0,
              height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderTop: '14px solid rgba(255, 255, 255, 0.95)',
              boxShadow: '0 0 16px rgba(255, 255, 255, 0.4)',
            },
          }}
        >
          {timeline.map((item, index) => {
            const entries = formatEntries(item);

            return (
              <Box
                key={`${item.institution}-${item.timeframe}-${index}`}
                sx={{
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
                <Box sx={{ order: { xs: 2, md: 1 } }}>
                  <DegreePanel timeframe={item.timeframe} degrees={entries} />
                </Box>

                <Box
                  sx={{
                    order: { xs: 1, md: 2 },
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    py: { xs: 0.4, md: 0 },
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
                    }}
                  />
                </Box>

                <Box sx={{ order: { xs: 3, md: 3 } }}>
                  <InstitutionPanel item={item} degrees={entries} />
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

export default EducationSection;
