// src/components/EducationSection.js
// Redesigned education section: interactive "chapter" selector with a rich detail panel.
// To revert to the prior horizontal-timeline design, see EducationSection.legacy.js
// (in src/App.js, swap the import to './components/EducationSection.legacy').
import React, { useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Chip,
  Collapse,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import { education as educationData } from '../data';
import tulaneBadge from '../assets/tulane.png';
import hunterBadge from '../assets/hunter.png';
import { sharedChipProps, sharedChipSx } from '../styles/chipStyles';

const badgeMap = {
  'Tulane University': tulaneBadge,
  'Hunter College': hunterBadge,
};

// Maps the `color` field from content.json to an RGB triple usable inside
// rgba(). Unknown names fall back to the section's default education-rgb so
// nothing renders without an accent.
const COLOR_NAME_TO_RGB = {
  green: '34, 139, 34',
  lightgreen: 'var(--light-green-rgb)',
  purple: '128, 90, 213',
  mauve: 'var(--mauve-rgb)',
  blue: '59, 130, 246',
  cyan: 'var(--dark-cyan-rgb)',
  yellow: 'var(--sunglow-rgb)',
  orange: '249, 115, 22',
  red: '239, 68, 68',
  brown: 'var(--raw-umber-rgb)',
};

const resolveAccentRgb = (color) => {
  if (typeof color !== 'string' || !color) return 'var(--education-rgb)';
  const key = color.trim().toLowerCase();
  return COLOR_NAME_TO_RGB[key] ?? 'var(--education-rgb)';
};

const formatEntries = (item) => {
  if (Array.isArray(item.degrees) && item.degrees.length > 0) {
    return item.degrees.map((d) => ({
      title: d.title ?? '',
      focusAreas: Array.isArray(d.focusAreas) ? d.focusAreas : [],
      highlights: Array.isArray(d.highlights) ? d.highlights : [],
    }));
  }
  return [
    {
      title: item.degree ?? '',
      focusAreas: Array.isArray(item.focusAreas) ? item.focusAreas : [],
      highlights: Array.isArray(item.highlights)
        ? item.highlights
        : Array.isArray(item.achievements)
          ? item.achievements
          : [],
    },
  ];
};

const isCurrent = (timeframe) =>
  typeof timeframe === 'string' && /present/i.test(timeframe);

const ChapterTab = ({ item, index, total, active, current, onSelect }) => {
  const badgeSrc = badgeMap[item.institution];
  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      sx={{
        position: 'relative',
        cursor: 'pointer',
        outline: 'none',
        pl: { xs: 2.5, md: 3.5 },
        pr: { xs: 1.5, md: 2 },
        py: { xs: 1.5, md: 1.8 },
        borderRadius: 2,
        transition: 'background-color 220ms ease, transform 220ms ease',
        backgroundColor: active ? 'var(--surface-base)' : 'var(--surface-subtle)',
        border: active
          ? '1px solid rgba(var(--education-rgb), 0.45)'
          : '1px solid var(--border-default)',
        backdropFilter: 'blur(8px)',
        boxShadow: active
          ? '0 12px 28px rgba(var(--shadow-rgb), 0.22)'
          : '0 4px 14px rgba(var(--shadow-rgb), 0.14)',
        '&:hover': {
          backgroundColor: active ? 'var(--surface-base)' : 'var(--surface-overlay)',
        },
        '&:focus-visible': {
          boxShadow: '0 0 0 2px rgba(var(--education-rgb), 0.6)',
        },
      }}
    >
      {/* Rail dot */}
      <Box
        sx={{
          position: 'absolute',
          left: { xs: 8, md: 12 },
          top: '50%',
          transform: 'translateY(-50%)',
          width: 12,
          height: 12,
          borderRadius: '50%',
          backgroundColor: active ? 'rgba(var(--education-rgb), 1)' : 'var(--surface-overlay)',
          border: active ? '2px solid var(--surface-solid)' : '2px solid rgba(var(--education-rgb), 0.45)',
          boxShadow: active
            ? '0 0 0 4px rgba(var(--education-rgb), 0.25), 0 0 14px rgba(var(--surface-rgb),0.45)'
            : '0 0 8px rgba(var(--surface-rgb),0.25)',
          transition: 'all 220ms ease',
          zIndex: 2,
        }}
      />
      {/* Connector segments */}
      {index > 0 && (
        <Box
          sx={{
            position: 'absolute',
            left: { xs: 13, md: 17 },
            top: 0,
            height: '50%',
            width: 2,
            backgroundColor: 'var(--border-default)',
            zIndex: 1,
          }}
        />
      )}
      {index < total - 1 && (
        <Box
          sx={{
            position: 'absolute',
            left: { xs: 13, md: 17 },
            top: '50%',
            height: '50%',
            width: 2,
            backgroundColor: 'var(--border-default)',
            zIndex: 1,
          }}
        />
      )}

      <Stack direction="row" spacing={1.4} alignItems="center" sx={{ minWidth: 0 }}>
        <Avatar
          alt={item.institution}
          src={badgeSrc}
          sx={{
            width: 38,
            height: 38,
            bgcolor: 'rgba(var(--education-rgb), 0.22)',
            color: 'var(--text-primary)',
            fontWeight: 700,
            fontSize: '1rem',
          }}
        >
          {!badgeSrc && item.institution ? item.institution[0] : null}
        </Avatar>
        <Stack spacing={0.1} sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              lineHeight: 1.2,
              color: 'var(--text-primary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {item.institution}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: active ? 'var(--text-secondary)' : 'var(--text-muted)',
              letterSpacing: 0.4,
              fontWeight: 500,
            }}
          >
            {item.timeframe}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

const DetailPanel = ({ item, degrees }) => {
  const badgeSrc = badgeMap[item.institution];
  const accentRgb = resolveAccentRgb(item.color);
  return (
    <Box
      key={item.institution}
      sx={{
        position: 'relative',
        borderRadius: 4,
        backgroundColor: 'var(--surface-solid)',
        border: '1px solid rgba(var(--education-rgb), 0.22)',
        boxShadow: '0 24px 60px rgba(var(--shadow-rgb), 0.22)',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        animation: 'eduFadeIn 360ms cubic-bezier(0.22,1,0.36,1)',
        '@keyframes eduFadeIn': {
          from: { opacity: 0, transform: 'translateY(8px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      {/* Top accent band */}
      <Box
        sx={{
          height: 6,
          width: '100%',
          background:
            `linear-gradient(90deg, rgba(${accentRgb}, 0.95) 0%, rgba(${accentRgb}, 0.4) 100%)`,
          flexShrink: 0,
        }}
      />

      <Stack
        spacing={{ xs: 2.4, md: 3 }}
        sx={{
          p: { xs: 2.8, md: 3.6 },
          flexGrow: 1,
          minHeight: 0,
        }}
      >
        <Stack direction="row" spacing={2.4} alignItems="center">
          <Avatar
            alt={item.institution}
            src={badgeSrc}
            sx={{
              width: 64,
              height: 64,
              bgcolor: 'rgba(var(--education-rgb), 0.22)',
              color: 'var(--text-primary)',
              fontWeight: 700,
              fontSize: '1.4rem',
              border: '2px solid rgba(var(--education-rgb), 0.4)',
            }}
          >
            {!badgeSrc && item.institution ? item.institution[0] : null}
          </Avatar>
          <Stack spacing={0.8} sx={{ minWidth: 0 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.15, fontSize: { xs: '1.55rem', md: '1.7rem' } }}>
              {item.institution}
            </Typography>
            <Stack direction="row" spacing={1.2} alignItems="center" flexWrap="wrap">
              {item.timeframe && (
                <Typography
                  variant="caption"
                  sx={{
                    color: 'var(--text-primary)',
                    fontWeight: 700,
                    letterSpacing: 0.6,
                    px: 1.2,
                    py: 0.4,
                    borderRadius: 1,
                    backgroundColor: 'rgba(var(--education-rgb), 0.18)',
                    fontSize: '0.82rem',
                  }}
                >
                  {item.timeframe}
                </Typography>
              )}
              {item.location && (
                <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  · {item.location}
                </Typography>
              )}
            </Stack>
          </Stack>
        </Stack>

        {item.details && (
          <Typography
            variant="body2"
            sx={{
              color: 'var(--text-primary)',
              lineHeight: 1.65,
              fontStyle: 'italic',
              borderLeft: '3px solid rgba(var(--education-rgb), 0.55)',
              pl: 2,
              py: 0.4,
              fontSize: '0.95rem',
            }}
          >
            {item.details}
          </Typography>
        )}

        <Stack spacing={2} sx={{ flexGrow: 1, minHeight: 0 }}>
          {degrees.map((d, i) => (
            <Box
              key={`${d.title}-${i}`}
              sx={{
                borderRadius: 2.5,
                p: { xs: 2.4, md: 2.8 },
                backgroundColor: 'rgba(var(--education-rgb), 0.06)',
                border: '1px solid rgba(var(--education-rgb), 0.16)',
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 1.6,
              }}
            >
              <Stack direction="row" spacing={1.4} alignItems="center">
                <SchoolIcon sx={{ fontSize: 20, color: 'var(--text-secondary)' }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                  {d.title || 'Program'}
                </Typography>
              </Stack>

              {d.focusAreas.length > 0 && (
                <Stack direction="row" spacing={0.8} flexWrap="wrap" rowGap={0.8}>
                  {d.focusAreas.map((f) => (
                    <Chip
                      key={f}
                      label={f}
                      {...sharedChipProps}
                      sx={{ ...sharedChipSx, fontSize: '0.7rem' }}
                    />
                  ))}
                </Stack>
              )}

              {d.highlights.length > 0 && (
                <Box
                  component="ul"
                  sx={{
                    listStyle: 'disc',
                    listStylePosition: 'outside',
                    pl: 2.5,
                    m: 0,
                    '& li': {
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem',
                      lineHeight: 1.65,
                      mb: 1,
                      pl: 0.6,
                      '&::marker': { color: 'rgba(var(--education-rgb), 0.95)' },
                    },
                    '& li:last-child': { mb: 0 },
                  }}
                >
                  {d.highlights.map((h, idx) => (
                    <li key={idx}>{h}</li>
                  ))}
                </Box>
              )}
            </Box>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
};

const MobileAccordionCard = ({ item, degrees, expanded, onToggle, current }) => {
  const badgeSrc = badgeMap[item.institution];
  const accentRgb = resolveAccentRgb(item.color);
  return (
    <Box
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid rgba(var(--education-rgb), 0.22)',
        backgroundColor: 'var(--surface-base)',
        boxShadow: expanded ? '0 16px 40px rgba(var(--shadow-rgb), 0.22)' : '0 6px 18px rgba(var(--shadow-rgb), 0.12)',
        transition: 'box-shadow 220ms ease',
      }}
    >
      <Box
        sx={{
          height: 4,
          width: '100%',
          background: `linear-gradient(90deg, rgba(${accentRgb}, 0.95) 0%, rgba(${accentRgb}, 0.4) 100%)`,
        }}
      />
      <Box
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
        sx={{ p: 1.8, cursor: 'pointer', outline: 'none' }}
      >
        <Stack direction="row" spacing={1.4} alignItems="center">
          <Avatar
            alt={item.institution}
            src={badgeSrc}
            sx={{
              width: 44,
              height: 44,
              bgcolor: 'rgba(var(--education-rgb), 0.22)',
              color: 'var(--text-primary)',
              fontWeight: 700,
            }}
          >
            {!badgeSrc && item.institution ? item.institution[0] : null}
          </Avatar>
          <Stack spacing={0.1} sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              {item.institution}
            </Typography>
            <Typography variant="caption" sx={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
              {item.timeframe}
              {item.location ? ` · ${item.location}` : ''}
            </Typography>
          </Stack>
          <Box
            sx={{
              fontSize: 22,
              color: 'var(--text-subtle)',
              transform: expanded ? 'rotate(45deg)' : 'rotate(0deg)',
              transition: 'transform 220ms ease',
              lineHeight: 1,
            }}
          >
            +
          </Box>
        </Stack>
      </Box>

      <Collapse in={expanded} timeout={300} unmountOnExit>
        <Box sx={{ px: 1.8, pb: 1.8 }}>
          {item.details && (
            <Typography
              variant="body2"
              sx={{
                color: 'var(--text-primary)',
                lineHeight: 1.6,
                fontStyle: 'italic',
                mb: 1.4,
                borderLeft: '3px solid rgba(var(--education-rgb), 0.55)',
                pl: 1.2,
              }}
            >
              {item.details}
            </Typography>
          )}
          <Stack spacing={1.2}>
            {degrees.map((d, i) => (
              <Box
                key={`${d.title}-${i}`}
                sx={{
                  borderRadius: 2,
                  p: 1.4,
                  backgroundColor: 'rgba(var(--education-rgb), 0.06)',
                  border: '1px solid rgba(var(--education-rgb), 0.16)',
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'var(--text-primary)', mb: 0.8 }}>
                  {d.title || 'Program'}
                </Typography>
                {d.focusAreas.length > 0 && (
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" rowGap={0.5} sx={{ mb: d.highlights.length ? 1 : 0 }}>
                    {d.focusAreas.map((f) => (
                      <Chip key={f} label={f} {...sharedChipProps} sx={{ ...sharedChipSx, fontSize: '0.68rem' }} />
                    ))}
                  </Stack>
                )}
                {d.highlights.length > 0 && (
                  <Stack spacing={0.5}>
                    {d.highlights.map((h, idx) => (
                      <Typography
                        key={idx}
                        variant="body2"
                        sx={{ color: 'var(--text-primary)', lineHeight: 1.5, '&::before': { content: '"• "', color: 'rgba(var(--education-rgb), 1)', fontWeight: 700 } }}
                      >
                        {h}
                      </Typography>
                    ))}
                  </Stack>
                )}
              </Box>
            ))}
          </Stack>
        </Box>
      </Collapse>
    </Box>
  );
};

function EducationSection({ navOffset = false }) {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const timeline = useMemo(
    () => (Array.isArray(educationData) ? educationData : []),
    []
  );

  // Default to the "current" institution if any, else the first.
  const initialIdx = useMemo(() => {
    const idx = timeline.findIndex((t) => isCurrent(t.timeframe));
    return idx >= 0 ? idx : 0;
  }, [timeline]);

  const [activeIdx, setActiveIdx] = useState(initialIdx);
  const [expandedMobile, setExpandedMobile] = useState(initialIdx);

  const active = timeline[activeIdx];
  const activeDegrees = active ? formatEntries(active) : [];

  return (
    <Box
      id="education"
      sx={{
        position: 'relative',
        width: '100%',
        pt: { xs: 6, md: 9 },
        pb: { xs: 9, md: 13 },
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
      <Box sx={{ position: 'relative', maxWidth: 1040, mx: 'auto', width: '100%' }}>
        {isMdUp ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'minmax(260px, 320px) minmax(0, 1fr)',
              columnGap: { md: 3.5, lg: 4 },
              alignItems: 'stretch',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                gap: 2,
              }}
            >
              <Stack spacing={0.4} sx={{ mb: { xs: 3, md: 5 } }}>
                <Typography
                  variant="overline"
                  sx={{ letterSpacing: 3, color: 'text.secondary' }}
                >
                  Academic Path
                </Typography>
                <Typography
                  variant="h2"
                  fontWeight={700}
                  sx={{ color: 'var(--text-primary)', lineHeight: 1.05 }}
                >
                  Education
                </Typography>
              </Stack>
              <Stack spacing={1.4}>
                {timeline.map((item, idx) => (
                  <ChapterTab
                    key={`${item.institution}-${idx}`}
                    item={item}
                    index={idx}
                    total={timeline.length}
                    active={idx === activeIdx}
                    current={isCurrent(item.timeframe)}
                    onSelect={() => setActiveIdx(idx)}
                  />
                ))}
              </Stack>
            </Box>

            <Box sx={{ minWidth: 0, display: 'flex', height: '100%' }}>
              {active && <DetailPanel item={active} degrees={activeDegrees} />}
            </Box>
          </Box>
        ) : (
          <Stack spacing={1.6}>
            {timeline.map((item, idx) => (
              <MobileAccordionCard
                key={`${item.institution}-${idx}`}
                item={item}
                degrees={formatEntries(item)}
                expanded={expandedMobile === idx}
                onToggle={() => setExpandedMobile(expandedMobile === idx ? -1 : idx)}
                current={isCurrent(item.timeframe)}
              />
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
}

export default EducationSection;
