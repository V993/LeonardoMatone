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
import { about as aboutCopy, biography } from '../data';

function AboutSection({ navOffset = false }) {
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
        width: '100%',
        minHeight: 'auto',
        pr: { xs: 2.4, md: 6, lg: 8 },
        pt: { xs: 6, md: 8 },
        pb: { xs: 3, md: 4 },
        scrollMarginTop: { xs: 96, md: 128 },
        background: 'none',
        color: 'var(--text-strong)',
        overflow: 'hidden',
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
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 4, md: 5 },
          p: { xs: 2.5, md: 3 },
          borderRadius: 3,
          background: 'linear-gradient(135deg, var(--surface-base) 0%, var(--surface-soft) 100%)',
          border: '1px solid var(--border-default)',
          boxShadow: '0 16px 32px rgba(var(--shadow-rgb), 0.04)',
          overflow: 'hidden',
          backdropFilter: 'blur(10px)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -140,
            right: -120,
            width: 320,
            height: 320,
            background: 'radial-gradient(circle at center, rgba(56, 189, 248, 0.12) 0%, rgba(59, 130, 246, 0.08) 35%, rgba(255,255,255,0) 70%)',
            zIndex: 0,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -160,
            left: -120,
            width: 320,
            height: 320,
            background: 'radial-gradient(circle at center, rgba(248, 113, 113, 0.08) 0%, rgba(244, 114, 182, 0.06) 38%, rgba(255,255,255,0) 70%)',
            zIndex: 0,
          },
          '& > *': {
            position: 'relative',
            zIndex: 1,
          },
        }}
      >
        <Grid container spacing={{ xs: 3, md: 4 }} alignItems="stretch">
          <Grid item xs={12} md={7}>
            <Stack spacing={{ xs: 2.6, md: 3 }} alignItems={{ xs: 'flex-start', md: 'flex-start' }}>
              <Stack spacing={1}>
                {about.eyebrow ? (
                  <Typography variant="overline" sx={{ letterSpacing: 3, color: 'var(--text-secondary)' }}>
                    {about.eyebrow}
                  </Typography>
                ) : null}
                {about.title ? (
                  <Typography variant="h2" fontWeight={700} sx={{ color: 'var(--text-strong)' }}>
                    {about.title}
                  </Typography>
                ) : null}
                {about.description ? (
                  <Typography variant="body1" sx={{ maxWidth: 640, color: 'var(--text-primary)' }}>
                    {about.description}
                  </Typography>
                ) : null}
              </Stack>

              {about.biographyLabel ? (
                <Typography variant="subtitle2" sx={{ letterSpacing: 1, color: 'var(--text-secondary)' }}>
                  {about.biographyLabel}
                </Typography>
              ) : null}

              {summaryParagraphs.length > 0 && (
                <Stack spacing={1.5}>
                  {summaryParagraphs.map((paragraph, index) => (
                    <Typography key={index} variant="body1" sx={{ maxWidth: 640, color: 'var(--text-primary)' }}>
                      {paragraph}
                    </Typography>
                  ))}
                </Stack>
              )}

              {/* Highlights moved to the right panel to declutter left content */}
            </Stack>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.4, md: 2.8 },
                borderRadius: 3,
                border: '1px solid var(--border-default)',
                background: 'linear-gradient(135deg, var(--surface-overlay) 0%, var(--surface-tint) 100%)',
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
                      border: '1px solid var(--border-soft)',
                      borderRadius: 2,
                      px: { xs: 1.5, md: 1.75 },
                      py: { xs: 1.2, md: 1.4 },
                      backgroundColor: 'var(--surface-subtle)',
                    }}
                  >
                    {(() => {
                      const IconComponent = STAT_ICON_MAP[tile.id] ?? WorkspacePremiumRoundedIcon;
                      return <IconComponent sx={{ color: 'var(--sunglow)' }} />;
                    })()}
                    <Stack spacing={0.35}>
                      <Typography variant="h6" fontWeight={700} sx={{ color: 'var(--text-strong)' }}>
                        {tile.value}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                        {tile.label}
                      </Typography>
                    </Stack>
                  </Stack>
                ))}

                {highlights.length > 0 && (
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 1.6, md: 1.8 },
                      borderRadius: 2,
                      border: '1px dashed var(--border-default)',
                      backgroundColor: 'var(--surface-subtle)',
                    }}
                  >
                    {about.highlightsLabel ? (
                      <Typography variant="subtitle2" sx={{ letterSpacing: 0.6, color: 'var(--text-strong)', mb: 1 }}>
                        {about.highlightsLabel}
                      </Typography>
                    ) : null}
                    <List dense sx={{ pl: 2, color: 'var(--text-strong)', mb: 0 }}>
                      {highlights.slice(0, 4).map((highlight, index) => (
                        <ListItem key={index} disablePadding sx={{ display: 'list-item', listStyleType: 'disc', py: 0.25 }}>
                          <ListItemText primaryTypographyProps={{ variant: 'body2' }} primary={highlight} />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                )}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default AboutSection;
