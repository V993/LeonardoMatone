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
} from '@mui/material';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import Diversity3RoundedIcon from '@mui/icons-material/Diversity3Rounded';
import { education as educationData, educationCopy } from '../data';

const extractYears = (text) => {
  if (typeof text !== 'string') {
    return [];
  }
  const matches = text.match(/(19|20)\d{2}/g);
  return matches ? matches.map(Number) : [];
};

function EducationSection() {
  const programs = Array.isArray(educationData) ? educationData : [];
  const copy = educationCopy ?? {};
  const statsCopy = copy.stats ?? {};

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
      icon: <SchoolRoundedIcon sx={{ color: '#1e3a8a' }} />,
      value: programs.length,
      label: statsCopy.programs,
    },
    {
      id: 'span',
      icon: <AccessTimeRoundedIcon sx={{ color: '#1d4ed8' }} />,
      value: spanYears,
      label: statsCopy.span,
    },
    {
      id: 'focus',
      icon: <WorkspacePremiumRoundedIcon sx={{ color: '#2563eb' }} />,
      value: focusAreas.length,
      label: statsCopy.focus,
    },
    {
      id: 'community',
      icon: <Diversity3RoundedIcon sx={{ color: '#312e81' }} />,
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
        px: { xs: 3, md: 6, lg: 8 },
        py: { xs: 6, md: 8 },
        mt: { xs: 6, md: 8 },
        scrollMarginTop: { xs: 96, md: 128 },
        scrollSnapAlign: { xs: 'none', md: 'start' },
        scrollSnapStop: { xs: 'normal', md: 'always' },
        background: 'linear-gradient(180deg, rgba(240, 249, 255, 0.86) 0%, rgba(219, 234, 254, 0.64) 52%, rgba(255, 255, 255, 0.92) 100%)',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at top right, rgba(37, 99, 235, 0.12), transparent 55%)',
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
            <Stack spacing={{ xs: 2.6, md: 3 }} alignItems={{ xs: 'flex-start', md: 'flex-start' }}>
              <Stack spacing={1}>
                {copy.eyebrow ? (
                  <Typography variant="overline" sx={{ letterSpacing: 3, color: 'rgba(30, 64, 175, 0.76)' }}>
                    {copy.eyebrow}
                  </Typography>
                ) : null}
                {copy.title ? (
                  <Typography variant="h2" fontWeight={700}>
                    {copy.title}
                  </Typography>
                ) : null}
                {copy.description ? (
                  <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 640 }}>
                    {copy.description}
                  </Typography>
                ) : null}
              </Stack>

              {statTiles.length > 0 && (
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={{ xs: 1.25, md: 1.5 }}
                  sx={{ flexWrap: 'wrap', rowGap: 1.5, columnGap: 1.5 }}
                >
                  {statTiles.map((tile) => (
                    <Paper
                      key={tile.id}
                      elevation={0}
                      sx={{
                        flex: { xs: '1 1 180px', md: '0 1 220px' },
                        p: { xs: 1.8, md: 2 },
                        borderRadius: 2.5,
                        border: '1px solid rgba(30, 64, 175, 0.16)',
                        backgroundColor: 'rgba(219, 234, 254, 0.78)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.05,
                      }}
                    >
                      {tile.icon}
                      <Stack spacing={0.25}>
                        <Typography variant="h6" fontWeight={700}>
                          {tile.value}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {tile.label}
                        </Typography>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              )}
            </Stack>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, md: 3 },
                borderRadius: 3,
                border: '1px solid rgba(30, 64, 175, 0.18)',
                background: 'linear-gradient(135deg, rgba(219, 234, 254, 0.96) 0%, rgba(191, 219, 254, 0.88) 100%)',
                boxShadow: '0 18px 38px rgba(30, 64, 175, 0.18)',
              }}
            >
              <Stack spacing={{ xs: 2.1, md: 2.4 }}>
                {programs.map((program, index) => (
                  <Paper
                    key={`${program.institution}-${index}`}
                    elevation={0}
                    sx={{
                      p: { xs: 2, md: 2.3 },
                      borderRadius: 2.5,
                      border: '1px solid rgba(30, 64, 175, 0.16)',
                      backgroundColor: 'rgba(255, 255, 255, 0.92)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1.1,
                    }}
                  >
                    <Stack spacing={0.35}>
                      <Typography variant="subtitle1" fontWeight={700}>
                        {program.institution}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {program.timeframe}
                        {program.location ? ` • ${program.location}` : ''}
                      </Typography>
                    </Stack>

                    <Typography variant="body2" color="text.secondary">
                      {program.degree}
                    </Typography>

                    {program.details && (
                      <Typography variant="body2" color="text.secondary">
                        {program.details}
                      </Typography>
                    )}

                    {Array.isArray(program.focusAreas) && program.focusAreas.length > 0 && (
                      <Stack direction="row" flexWrap="wrap" gap={0.6}>
                        {program.focusAreas.map((area) => (
                          <Chip key={area} label={area} size="small" />
                        ))}
                      </Stack>
                    )}

                    {Array.isArray(program.highlights) && program.highlights.length > 0 && (
                      <List dense sx={{ pl: 2.25, color: 'text.secondary', mb: 0 }}>
                        {program.highlights.map((highlight, highlightIdx) => (
                          <ListItem
                            key={highlightIdx}
                            disablePadding
                            sx={{ display: 'list-item', listStyleType: 'disc', py: 0.25 }}
                          >
                            <ListItemText primaryTypographyProps={{ variant: 'body2' }} primary={highlight} />
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </Paper>
                ))}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default EducationSection;
