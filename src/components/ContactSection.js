// src/components/ContactSection.js
import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import StyledCard from './styled/StyledCard';
import StyledButton from './styled/StyledButton';
import { contact as contactData } from '../data';

function ContactSection() {
  if (!contactData) {
    return null;
  }

  const { intro, channels = [] } = contactData;

  return (
    <Box
      id="contact"
      sx={{
        minHeight: '60vh',
        padding: { xs: 3, md: 6 },
        scrollSnapAlign: 'start',
        backgroundColor: 'transparent',
      }}
    >
      <Typography variant="h4" gutterBottom align="center">
        Contact
      </Typography>
      <Typography variant="subtitle1" align="center" sx={{ maxWidth: 720, mx: 'auto', mb: 4 }}>
        {intro}
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {channels.map((channel) => (
          <Grid key={channel.label} item xs={12} sm={6} md={4}>
            <StyledCard>
              <Typography variant="h6" gutterBottom>
                {channel.label}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {channel.value}
              </Typography>
              <StyledButton
                href={channel.href}
                target={channel.href?.startsWith('http') ? '_blank' : undefined}
                rel={channel.href?.startsWith('http') ? 'noreferrer' : undefined}
              >
                Connect
              </StyledButton>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ContactSection;
