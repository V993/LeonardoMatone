// src/components/EducationSection.js
import {
  Box,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
  Button,
  Link as MuiLink,
  Avatar,
} from '@mui/material';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import Diversity3RoundedIcon from '@mui/icons-material/Diversity3Rounded';
import { education as educationData, educationCopy } from '../data';
import tulaneBadge from '../assets/tulane.png';
import hunterBadge from '../assets/hunter.png';

const extractYears = (text) => {
  if (typeof text !== 'string') {
    return [];
  }
  const matches = text.match(/(19|20)\d{2}/g);
  return matches ? matches.map(Number) : [];
};

function EducationSection({ navOffset = false }) {
  const programs = Array.isArray(educationData) ? educationData : [];
  const copy = educationCopy ?? {};
  const statsCopy = copy.stats ?? {};

  const assetMap = {
    'Tulane University': tulaneBadge,
    'Hunter College': hunterBadge
  };

  const focusAreas = Array.from(
    new Set(
      programs.flatMap((program) =>
        Array.isArray(program.focusAreas) ? program.focusAreas : []
      )
    )
  );

  const allYears = programs
    .map((program) => program.timeframe)
    .filter(Boolean)
    .flatMap(extractYears);
  const earliestYear = allYears.length > 0 ? Math.min(...allYears) : null;
  const latestYear = allYears.length > 0 ? Math.max(...allYears) : null;
  const spanYears = earliestYear && latestYear ? Math.max(0, latestYear - earliestYear + 1) : null;

  const totalHighlights = programs.reduce(
    (total, program) => total + ((program.highlights ?? []).length),
    0
  );

  const statTiles = [
    {
      id: 'programs',
      icon: <SchoolRoundedIcon sx={{ color: 'rgb(var(--education-rgb))' }} />,
      value: programs.length,
      label: statsCopy.programs,
    },
    {
      id: 'span',
      icon: <AccessTimeRoundedIcon sx={{ color: 'rgb(var(--education-rgb))' }} />,
      value: spanYears,
      label: statsCopy.span,
    },
    {
      id: 'focus',
      icon: <WorkspacePremiumRoundedIcon sx={{ color: 'rgb(var(--education-rgb))' }} />,
      value: focusAreas.length,
      label: statsCopy.focus,
    },
    {
      id: 'community',
      icon: <Diversity3RoundedIcon sx={{ color: 'rgb(var(--education-rgb))' }} />,
      value: totalHighlights,
      label: statsCopy.community,
    },
  ].filter((tile) => tile.value && tile.label);

  return (
    <Box
      id="education"
      sx={{
        position: 'relative',
        minHeight: '100vh',
        minWidth: '100vw',
        px: { xs: 3, md: 6, lg: 8 },
        py: { xs: 6, md: 8 },
        mt: 0,
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
            'radial-gradient(circle at top right, rgba(var(--education-rgb), 0.18), transparent 55%), linear-gradient(180deg, rgba(var(--education-rgb), 0.86) 0%, rgba(var(--education-rgb), 0.64) 52%, rgba(255, 255, 255, 0.92) 100%)',
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '24%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(var(--experience-rgb), 0.12) 100%)',
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

          {/* Side column: Header + Quick Facts in boxed panel */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.4, md: 2.8 },
                borderRadius: 3,
                border: '1px solid rgba(var(--education-rgb), 0.22)',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(var(--education-rgb), 0.08) 100%)',
                boxShadow: '0 18px 38px rgba(85, 134, 140, 0.12)'
              }}
            >
              <Stack spacing={{ xs: 2.2, md: 2.6 }} alignItems={{ xs: 'flex-start', md: 'flex-start' }}>
                <Stack spacing={1}>
                  {copy.eyebrow ? (
                    <Typography variant="overline" sx={{ letterSpacing: 3, color: 'rgba(30, 64, 175, 0.76)' }}>
                      {copy.eyebrow}
                    </Typography>
                  ) : null}
                  {copy.title ? (
                    <Typography variant="h3" fontWeight={700}>
                      {copy.title}
                    </Typography>
                  ) : null}
                  {copy.description ? (
                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420 }}>
                      {copy.description}
                    </Typography>
                  ) : null}
                </Stack>

                {statTiles.length > 0 && (
                  <Stack spacing={1.25}>
                    {statTiles.map((tile) => (
                      <Stack key={tile.id} direction="row" spacing={1.2} alignItems="center" sx={{
                        border: '1px solid rgba(var(--education-rgb), 0.22)',
                        borderRadius: 2,
                        px: 1.5,
                        py: 1.2,
                        backgroundColor: 'rgba(219, 234, 254, 0.78)'
                      }}>
                        {tile.icon}
                        <Stack spacing={0.25}>
                          <Typography variant="h6" fontWeight={700}>{tile.value}</Typography>
                          <Typography variant="body2" color="text.secondary">{tile.label}</Typography>
                        </Stack>
                      </Stack>
                    ))}
                  </Stack>
                )}
              </Stack>
            </Paper>
          </Grid>
          {/* Main column: Universities */}
          <Grid item xs={12} md={8}>
            <Stack spacing={{ xs: 2.4, md: 3 }}>
              {programs.map((program, index) => (
                <Paper
                  key={`${program.institution}-${index}`}
                  elevation={0}
                  sx={{
                    p: { xs: 2.3, md: 2.8 },
                    borderRadius: 3,
                    border: '1px solid rgba(var(--education-rgb), 0.22)',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(var(--education-rgb), 0.08) 100%)',
                  }}
                >
                  <Stack spacing={1.1}>
                    <Stack direction="row" alignItems="center" spacing={1.25}>
                      <Avatar
                        alt={program.institution}
                        src={program.badge ? assetMap[program.badge] : assetMap[program.institution]}
                        sx={{ width: 36, height: 36, bgcolor: 'rgba(var(--education-rgb), 0.2)', color: 'text.primary' }}
                      >
                        {(!assetMap[program.badge] && !assetMap[program.institution]) && (program.institution?.[0] || 'U')}
                      </Avatar>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 0.4, sm: 1.2 }} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 800 }}>
                          {program.institution}
                        </Typography>
                        {Array.isArray(program.degrees) && program.degrees.length > 0 ? (
                          <Stack direction="row" spacing={0.6} flexWrap="wrap">
                            {program.degrees.map((deg, i) => (
                              <Chip key={i} label={deg} size="small" sx={{ fontWeight: 600 }} />
                            ))}
                          </Stack>
                        ) : (
                          program.degree ? <Chip label={program.degree} size="small" sx={{ fontWeight: 600 }} /> : null
                        )}
                      </Stack>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {program.timeframe}
                      {program.location ? ` • ${program.location}` : ''}
                    </Typography>
                    {/* Condensed details: show only small key chips and limited coursework */}
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {program.advisor && <Chip label={`Advisor: ${program.advisor}`} size="small" />}
                    </Stack>

                    {Array.isArray(program.courses) && program.courses.length > 0 && (
                      <Stack spacing={0.5}>
                        <Typography variant="subtitle2">Selected Coursework</Typography>
                        <Stack direction="row" flexWrap="wrap" gap={0.6}>
                          {program.courses.slice(0, 4).map((course) => (
                            <Chip key={course} label={course} size="small" />
                          ))}
                        </Stack>
                      </Stack>
                    )}

                    {(program.distinctions || program.gpa || (Array.isArray(program.honors) && program.honors.length > 0)) && (
                      <Typography variant="body2" color="text.secondary">
                        {program.distinctions
                          ? program.distinctions
                          : [
                              program.gpa ? `GPA: ${program.gpa}` : null,
                              ...((program.honors || []))
                            ]
                              .filter(Boolean)
                              .join(' • ')}
                      </Typography>
                    )}
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default EducationSection;
