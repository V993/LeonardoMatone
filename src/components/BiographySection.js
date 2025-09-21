// src/components/BiographySection.js
import React from 'react';
import { Box, Grid, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StyledCard from './styled/StyledCard';
import { biography as biographyData } from '../data';

function BiographySection() {
  if (!biographyData) {
    return null;
  }

  const { headline, summary = [], highlights = [] } = biographyData;

  return (
    <Box
      id="biography"
      sx={{
        minHeight: '100vh',
        padding: { xs: 3, md: 6 },
        scrollSnapAlign: 'start',
        backgroundColor: 'transparent',
      }}
    >
      <Typography variant="h4" gutterBottom align="center">
        Biography
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={7}>
          <StyledCard>
            <Typography variant="h5" gutterBottom>
              {headline}
            </Typography>
            {summary.map((paragraph, idx) => (
              <Typography key={idx} variant="body1" color="text.secondary" paragraph>
                {paragraph}
              </Typography>
            ))}
          </StyledCard>
        </Grid>
        <Grid item xs={12} md={5}>
          <StyledCard>
            <Typography variant="h6" gutterBottom>
              Highlights
            </Typography>
            <List dense sx={{ mt: 1 }}>
              {highlights.map((item, idx) => (
                <ListItem key={idx} sx={{ alignItems: 'flex-start', px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 40, color: '#047857' }}>
                    <CheckCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                    primary={item}
                  />
                </ListItem>
              ))}
            </List>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
}

export default BiographySection;
