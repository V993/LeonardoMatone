// src/components/BlogPage.js
import React, { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Chip,
  Divider,
  Fade,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import PushPinRoundedIcon from '@mui/icons-material/PushPinRounded';
import { blogPosts as blogPostsData, theme as themeData } from '../data';

const NOTE_THEME_MAP = {
  welcome: {
    rotation: '-3deg',
    background: 'linear-gradient(180deg, rgba(var(--light-green-rgb), 0.35) 0%, rgba(var(--light-green-rgb), 0.82) 100%)',
    tapeColor: 'rgba(210, 255, 200, 0.8)',
    pinColor: '#15803d',
    shadow: '0 18px 36px rgba(21, 128, 61, 0.26)',
  },
  about: {
    rotation: '2deg',
    background: 'linear-gradient(180deg, rgba(var(--raw-umber-rgb), 0.32) 0%, rgba(var(--raw-umber-rgb), 0.78) 100%)',
    tapeColor: 'rgba(224, 194, 165, 0.78)',
    pinColor: '#92400e',
    shadow: '0 18px 36px rgba(146, 64, 14, 0.24)',
  },
  education: {
    rotation: '-1.5deg',
    background: 'linear-gradient(180deg, rgba(var(--dark-cyan-rgb), 0.3) 0%, rgba(var(--dark-cyan-rgb), 0.78) 100%)',
    tapeColor: 'rgba(198, 229, 232, 0.8)',
    pinColor: '#0f766e',
    shadow: '0 18px 34px rgba(15, 118, 110, 0.24)',
  },
  experience: {
    rotation: '3deg',
    background: 'linear-gradient(180deg, rgba(var(--sunglow-rgb), 0.36) 0%, rgba(var(--sunglow-rgb), 0.84) 100%)',
    tapeColor: 'rgba(255, 232, 181, 0.82)',
    pinColor: '#b45309',
    shadow: '0 18px 34px rgba(180, 83, 9, 0.22)',
  },
  projects: {
    rotation: '-2deg',
    background: 'linear-gradient(180deg, rgba(var(--mauve-rgb), 0.34) 0%, rgba(var(--mauve-rgb), 0.8) 100%)',
    tapeColor: 'rgba(234, 215, 252, 0.82)',
    pinColor: '#6b21a8',
    shadow: '0 18px 34px rgba(107, 33, 168, 0.22)',
  },
};

const NOTE_THEME_KEYS = Object.keys(NOTE_THEME_MAP);

const resolveNoteStyle = (post, index) => {
  const themeKey = typeof post.noteTheme === 'string' ? post.noteTheme.toLowerCase() : '';
  const baseTheme = NOTE_THEME_MAP[themeKey] ?? NOTE_THEME_MAP[NOTE_THEME_KEYS[index % NOTE_THEME_KEYS.length]];
  const overrides = post.noteStyle ?? {};
  return {
    ...baseTheme,
    ...overrides,
    rotation: overrides.rotation ?? baseTheme.rotation,
    background: overrides.background ?? baseTheme.background,
    tapeColor: overrides.tapeColor ?? baseTheme.tapeColor,
    pinColor: overrides.pinColor ?? baseTheme.pinColor,
    shadow: overrides.shadow ?? baseTheme.shadow,
  };
};

const ModalTransition = React.forwardRef(function ModalTransition(props, ref) {
  return <Fade ref={ref} timeout={260} {...props} />;
});

function BlogPage() {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));
  const accentColor = themeData?.primaryColor ?? 'rgb(var(--dark-cyan-rgb))';
  const blogPosts = useMemo(
    () => (Array.isArray(blogPostsData) ? blogPostsData.filter((post) => post?.title) : []),
    []
  );
  const noteStyles = useMemo(
    () => blogPosts.map((post, index) => resolveNoteStyle(post, index)),
    [blogPosts]
  );
  const [activePost, setActivePost] = useState(null);

  const handleOpen = (post) => {
    setActivePost(post);
  };

  const handleClose = () => {
    setActivePost(null);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        py: { xs: 10, md: 12 },
        px: { xs: 2.5, md: 5 },
        pl: { md: 'calc(280px + 48px)', lg: 'calc(320px + 64px)' },
        background:
          'radial-gradient(circle at 20% 20%, rgba(255, 231, 184, 0.35) 0%, rgba(255, 231, 184, 0) 36%), radial-gradient(circle at 80% 10%, rgba(188, 236, 255, 0.4) 0%, rgba(188, 236, 255, 0) 32%), linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 244, 240, 0.92) 100%)',
        overflowX: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          maxWidth: 1080,
          mx: 'auto',
          mb: { xs: 5, md: 7 },
          p: { xs: 3.5, md: 4.5 },
          borderRadius: 4,
          background:
            'linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.72) 100%)',
          border: '1px solid rgba(15, 23, 42, 0.08)',
          boxShadow: '0 32px 64px rgba(15, 23, 42, 0.16)',
          textAlign: 'center',
        }}
      >
        <Typography
          variant="overline"
          sx={{
            letterSpacing: 4,
            fontWeight: 700,
            color: 'rgba(71, 85, 105, 0.8)',
          }}
        >
          Dispatches & Field Notes
        </Typography>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            mt: 1,
            color: '#111827',
          }}
        >
          Blog
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mt: 2,
            maxWidth: 720,
            mx: 'auto',
            color: 'rgba(71, 85, 105, 0.88)',
          }}
        >
          Ideas, experiments, and quick takeaways captured as sticky notes. Pop one open to
          read the full story behind the scribbles.
        </Typography>
      </Box>

      <Box
        sx={{
          position: 'relative',
          maxWidth: 1200,
          mx: 'auto',
          width: '100%',
        }}
      >
        <Grid container spacing={{ xs: 4, sm: 5, lg: 6 }} justifyContent="center">
          {blogPosts.map((post, index) => {
            const fallbackStyle = NOTE_THEME_MAP[NOTE_THEME_KEYS[index % NOTE_THEME_KEYS.length]];
            const style = noteStyles[index] ?? fallbackStyle;
            const noteId = post.id ?? post.title;
            const preview = post.snippet ?? post.summary ?? '';
            const tags = Array.isArray(post.tags) ? post.tags : [];

            return (
              <Grid item xs={12} sm={6} md={4} key={noteId}>
                <Box
                  role="button"
                  tabIndex={0}
                  onClick={() => handleOpen(post)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      handleOpen(post);
                    }
                  }}
                  sx={{
                    position: 'relative',
                    px: { xs: 3, sm: 3.5 },
                    py: { xs: 3.2, sm: 3.6 },
                    borderRadius: 3,
                    minHeight: 240,
                    background: style.background,
                    boxShadow: style.shadow,
                    transform: `rotate(${style.rotation})`,
                    transition: 'transform 220ms ease, box-shadow 240ms ease',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2.2,
                    outline: 'none',
                    '&:focus-visible': {
                      boxShadow: `${style.shadow}, 0 0 0 4px rgba(15, 23, 42, 0.24)`,
                    },
                    '&:hover': {
                      transform: `translateY(-8px) rotate(${style.rotation}) scale(1.02)`,
                      boxShadow: `${style.shadow}, 0 24px 44px rgba(15, 23, 42, 0.22)`,
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 18,
                      left: '50%',
                      transform: 'translate(-50%, -50%) rotate(-2deg)',
                      width: 78,
                      height: 22,
                      borderRadius: '4px',
                      background: style.tapeColor,
                      boxShadow: '0 6px 18px rgba(15, 23, 42, 0.18)',
                      opacity: 0.9,
                    },
                  }}
                >
                  <PushPinRoundedIcon
                    sx={{
                      position: 'absolute',
                      top: 28,
                      right: 28,
                      color: style.pinColor,
                      opacity: 0.78,
                      transform: 'rotate(12deg)',
                    }}
                  />

                  <Stack spacing={1}>
                    <Typography
                      variant="overline"
                      sx={{
                        letterSpacing: 2.8,
                        fontWeight: 700,
                        color: 'rgba(17, 24, 39, 0.65)',
                      }}
                    >
                      {post.date ?? post.category ?? 'Field Note'}
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 800,
                        lineHeight: 1.1,
                        color: '#111827',
                        maxWidth: '100%',
                      }}
                    >
                      {post.title}
                    </Typography>
                  </Stack>

                  <Typography
                    variant="body1"
                    sx={{
                      flexGrow: 1,
                      color: 'rgba(17, 24, 39, 0.74)',
                    }}
                  >
                    {preview}
                  </Typography>

                  {tags.length > 0 && (
                    <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={0.6}>
                      {tags.slice(0, 3).map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(17, 24, 39, 0.12)',
                            color: '#111827',
                            fontWeight: 600,
                            letterSpacing: 0.4,
                          }}
                        />
                      ))}
                    </Stack>
                  )}
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      <Dialog
        open={Boolean(activePost)}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        TransitionComponent={ModalTransition}
        keepMounted
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: 'hidden',
            background:
              'linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(255, 255, 255, 0.9) 100%)',
            boxShadow: '0 42px 88px rgba(15, 23, 42, 0.36)',
          },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(15, 23, 42, 0.32)',
            backdropFilter: 'blur(6px)',
          },
        }}
      >
        {activePost ? (
          <>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 2,
                px: { xs: 3, md: 4 },
                pt: { xs: 3, md: 4 },
              }}
            >
              <Stack spacing={1.2}>
                <Typography
                  variant="overline"
                  sx={{
                    letterSpacing: 3,
                    fontWeight: 700,
                    color: 'rgba(71, 85, 105, 0.8)',
                  }}
                >
                  {activePost.date ?? activePost.category ?? 'Field Note'}
                </Typography>
                <Typography variant={isSmall ? 'h5' : 'h4'} sx={{ fontWeight: 800, color: '#0f172a' }}>
                  {activePost.title}
                </Typography>
                {activePost.subtitle ? (
                  <Typography variant="subtitle1" sx={{ color: 'rgba(71, 85, 105, 0.9)' }}>
                    {activePost.subtitle}
                  </Typography>
                ) : null}
                {Array.isArray(activePost.tags) && activePost.tags.length > 0 ? (
                  <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={0.7}>
                    {activePost.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(15, 23, 42, 0.1)',
                          color: '#0f172a',
                          fontWeight: 600,
                          letterSpacing: 0.4,
                        }}
                      />
                    ))}
                  </Stack>
                ) : null}
              </Stack>

              <IconButton
                onClick={handleClose}
                sx={{
                  backgroundColor: 'rgba(15, 23, 42, 0.06)',
                  color: '#0f172a',
                  '&:hover': {
                    backgroundColor: 'rgba(15, 23, 42, 0.12)',
                  },
                }}
                aria-label="Close post"
              >
                <CloseRoundedIcon />
              </IconButton>
            </Box>

            <Divider sx={{ my: { xs: 2, md: 3 }, borderColor: 'rgba(15, 23, 42, 0.1)' }} />

            <DialogContent sx={{ pb: { xs: 4, md: 5 } }}>
              <Stack spacing={2.6}>
                {(Array.isArray(activePost.content) ? activePost.content : [activePost.content])
                  .filter(Boolean)
                  .map((paragraph, index) => (
                    <Typography key={index} variant="body1" sx={{ color: 'rgba(15, 23, 42, 0.84)', lineHeight: 1.8 }}>
                      {paragraph}
                    </Typography>
                  ))}

                {activePost.callToAction ? (
                  <Box
                    sx={{
                      mt: 1,
                      p: { xs: 2.5, md: 3 },
                      borderRadius: 3,
                      border: '1px dashed rgba(15, 23, 42, 0.18)',
                      backgroundColor: 'rgba(15, 23, 42, 0.04)',
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>
                      Next Up
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(15, 23, 42, 0.72)' }}>
                      {activePost.callToAction}
                    </Typography>
                  </Box>
                ) : null}

                {activePost.links && activePost.links.length > 0 ? (
                  <Stack spacing={1.2}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                      Further Reading
                    </Typography>
                    <Stack spacing={0.8}>
                      {activePost.links.map((link) => (
                        <Typography key={link.href ?? link.label} variant="body2">
                          <Box
                            component="a"
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              color: accentColor,
                              fontWeight: 600,
                              textDecoration: 'none',
                            }}
                          >
                            {link.label ?? link.href}
                          </Box>
                        </Typography>
                      ))}
                    </Stack>
                  </Stack>
                ) : null}
              </Stack>
            </DialogContent>
          </>
        ) : null}
      </Dialog>
    </Box>
  );
}

export default BlogPage;
