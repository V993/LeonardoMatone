// src/components/SectionCard.js
import { Typography, CardContent, List, ListItem, ListItemText } from '@mui/material';
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
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1.6,
          height: '100%',
          position: 'relative',
          zIndex: 1,
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
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
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
