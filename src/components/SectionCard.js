// src/components/SectionCard.js
import { Typography, CardContent, List, ListItem, ListItemText, Stack, Box } from '@mui/material';
import React from 'react';
import StyledCard from './styled/StyledCard';

const SectionCard = ({
  title,
  subtitle,
  timeframe,
  eyebrow,
  bullets,
  children,
  variant,
  leadingIcon,
  cornerIcon,
  sx,
  onClick,
}) => {
  const handleKeyDown = (event) => {
    if (!onClick) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick(event);
    }
  };

  const isProject = variant === 'project';

  return (
    <StyledCard
      data-variant={variant ?? undefined}
      data-interactive={onClick ? 'true' : undefined}
      sx={sx}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? title : undefined}
    >
      {cornerIcon && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 2,
          }}
        >
          {cornerIcon}
        </Box>
      )}
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1.4,
          height: '100%',
          position: 'relative',
          zIndex: 1,
          p: isProject ? 1 : undefined,
          alignItems: 'flex-start',
        }}
      >
        {eyebrow && (
          <Typography
            variant="overline"
            sx={{
              letterSpacing: 2,
            fontWeight: 600,
            color: 'text.secondary',
            textTransform: 'uppercase',
          }}
        >
          {eyebrow}
        </Typography>
      )}
      <Stack direction="row" spacing={1} alignItems="center">
        {leadingIcon && (
          <Box sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 28,
            height: 28,
            borderRadius: 1,
            backgroundColor: 'rgba(var(--education-rgb), 0.12)',
            color: 'text.primary'
          }}>
            {leadingIcon}
          </Box>
        )}
        <Typography variant="h5" sx={{ fontWeight: 700, overflowWrap: 'anywhere', wordBreak: 'break-word', m: 0 }}>
          {title}
        </Typography>
      </Stack>
      {subtitle && (
        <Typography variant="subtitle1" color="text.secondary">
          {subtitle}
        </Typography>
      )}
      {timeframe && (
        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 500 }}>
          {timeframe}
        </Typography>
      )}
      {bullets && (
        <List dense>
          {bullets.map((bullet, idx) => (
            <ListItem key={idx}>
              <ListItemText primary={`• ${bullet}`} />
            </ListItem>
          ))}
        </List>
      )}
      {children}
      </CardContent>
    </StyledCard>
  );
};

export default SectionCard;
