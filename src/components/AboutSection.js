// src/components/AboutSection.js
import React from 'react';
import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import VolunteerActivismRoundedIcon from '@mui/icons-material/VolunteerActivismRounded';
import EmojiObjectsRoundedIcon from '@mui/icons-material/EmojiObjectsRounded';
import { useTheme } from '@mui/material/styles';
import { about as aboutCopy, biography } from '../data';

function AboutSection() {
  const theme = useTheme();
  const about = aboutCopy ?? {};
  const biographyInfo = biography ?? {};
  const summaryParagraphs = Array.isArray(biographyInfo.summary) ? biographyInfo.summary : [];
  const highlights = Array.isArray(biographyInfo.highlights) ? biographyInfo.highlights : [];
  const statTiles = Array.isArray(about.stats) ? about.stats : [];

  const STAT_ICON_MAP = {
    roles: WorkspacePremiumRoundedIcon,
    publications: MenuBookRoundedIcon,
    community: VolunteerActivismRoundedIcon,
    interests: EmojiObjectsRoundedIcon,
  };

  return (
    <Box
      id="about"
      sx={{
        position: 'relative',
        minHeight: '80vh',
        px: { xs: 3, md: 6, lg: 8 },
        py: { xs: 6, md: 8 },
        scrollMarginTop: { xs: 96, md: 128 },
        scrollSnapAlign: { xs: 'none', md: 'start' },
        scrollSnapStop: { xs: 'normal', md: 'always' },
        background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.92) 100%)',
        color: '#f8fafc',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          maxWidth: 1200,
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 4, md: 5 },
        }}
      >
        <Grid container spacing={{ xs: 3, md: 4 }} alignItems="stretch">
          <Grid item xs={12} md={7}>
            <Stack spacing={{ xs: 2.6, md: 3 }} alignItems={{ xs: 'flex-start', md: 'flex-start' }}>
              <Stack spacing={1}>
                {about.eyebrow ? (
                  <Typography variant="overline" sx={{ letterSpacing: 3, color: 'rgba(148, 163, 184, 0.85)' }}>
                    {about.eyebrow}
                  </Typography>
                ) : null}
                {about.title ? (
                  <Typography variant="h2" fontWeight={700}>
                    {about.title}
                  </Typography>
                ) : null}
                {about.description ? (
                  <Typography variant="body1" sx={{ maxWidth: 640, color: 'rgba(226, 232, 240, 0.88)' }}>
                    {about.description}
                  </Typography>
                ) : null}
              </Stack>

              {about.biographyLabel ? (
                <Typography variant="subtitle2" sx={{ letterSpacing: 1, color: 'rgba(148, 163, 184, 0.85)' }}>
                  {about.biographyLabel}
                </Typography>
              ) : null}

              {summaryParagraphs.length > 0 && (
                <Stack spacing={1.5}>
                  {summaryParagraphs.map((paragraph, index) => (
                    <Typography key={index} variant="body1" sx={{ maxWidth: 640, color: 'rgba(226, 232, 240, 0.88)' }}>
                      {paragraph}
                    </Typography>
                  ))}
                </Stack>
              )}

              {highlights.length > 0 && about.highlightsLabel ? (
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2.2, md: 2.6 },
                    borderRadius: 3,
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    background: 'rgba(30, 41, 59, 0.65)',
                  }}
                >
                  <Stack spacing={1.4}>
                    <Typography variant="subtitle2" sx={{ letterSpacing: 0.8, color: 'rgba(226, 232, 240, 0.72)' }}>
                      {about.highlightsLabel}
                    </Typography>
                    <List dense sx={{ pl: 2.5, color: 'rgba(226, 232, 240, 0.82)', mb: 0 }}>
                      {highlights.map((highlight, index) => (
                        <ListItem
                          key={index}
                          disablePadding
                          sx={{ display: 'list-item', listStyleType: 'disc', py: 0.35 }}
                        >
                          <ListItemText primaryTypographyProps={{ variant: 'body2' }} primary={highlight} />
                        </ListItem>
                      ))}
                    </List>
                  </Stack>
                </Paper>
              ) : null}
            </Stack>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.4, md: 2.8 },
                borderRadius: 3,
                border: '1px solid rgba(148, 163, 184, 0.25)',
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
              }}
            >
              <Stack spacing={{ xs: 1.75, md: 2 }}>
                {statTiles.filter((tile) => tile?.label && tile?.value).map((tile) => (
                  <Stack
                    key={tile.label}
                    direction="row"
                    spacing={1.4}
                    alignItems="center"
                    sx={{
                      border: '1px solid rgba(148, 163, 184, 0.25)',
                      borderRadius: 2,
                      px: { xs: 1.5, md: 1.75 },
                      py: { xs: 1.2, md: 1.4 },
                      backgroundColor: 'rgba(30, 41, 59, 0.6)',
                    }}
                  >
                    {(() => {
                      const IconComponent = STAT_ICON_MAP[tile.id] ?? WorkspacePremiumRoundedIcon;
                      return <IconComponent sx={{ color: '#0ea5e9' }} />;
                    })()}
                    <Stack spacing={0.35}>
                      <Typography variant="h6" fontWeight={700} sx={{ color: '#e2e8f0' }}>
                        {tile.value}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(226, 232, 240, 0.75)' }}>
                        {tile.label}
                      </Typography>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default AboutSection;
