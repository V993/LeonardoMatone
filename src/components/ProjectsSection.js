// src/components/ProjectsSection.js
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Stack,
  Avatar,
  Chip,
  Link as MuiLink,
  Dialog,
  IconButton,
  CircularProgress,
} from '@mui/material';
import Grow from '@mui/material/Grow';
import GitHubIcon from '@mui/icons-material/GitHub';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import CallSplitRoundedIcon from '@mui/icons-material/CallSplitRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CloseIcon from '@mui/icons-material/Close';
import SectionCard from './SectionCard';
import {
  contact as contactData,
  theme as themeData,
  projectShowcase as projectShowcaseData,
  projectsCopy,
} from '../data';
import { marked } from 'marked';
import { sharedChipSx, sharedChipProps } from '../styles/chipStyles';

marked.setOptions({ gfm: true, breaks: true });

const StatPill = ({ icon, label, value }) => {
  const displayValue = typeof value === 'number' ? new Intl.NumberFormat('en-US').format(value) : value;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        padding: '10px 12px',
        borderRadius: '14px',
        background: 'rgba(var(--dark-cyan-rgb), 0.08)',
        border: '1px solid rgba(var(--dark-cyan-rgb), 0.14)',
        minHeight: 44,
      }}
    >
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 28,
          height: 28,
          borderRadius: '50%',
          backgroundColor: 'rgba(var(--dark-cyan-rgb), 0.12)',
          color: 'rgb(var(--dark-cyan-rgb))',
        }}
      >
        {icon}
      </Box>
      <Stack spacing={0.1}>
        <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 1, color: 'text.secondary' }}>
          {label}
        </Typography>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1 }}>
          {displayValue}
        </Typography>
      </Stack>
    </Box>
  );
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Grow ref={ref} timeout={520} {...props} />;
});

const FALLBACK_SHOWCASE = [
  { repo: 'Representative-Polarity-US-House', tag: 'python' },
  { repo: 'LegislativeDataAnalytics', tag: 'python' },
  { repo: 'ASCII-Image-Conversion', tag: 'python' },
];

const GITHUB_JSON_HEADERS = {
  headers: {
    Accept: 'application/vnd.github+json',
  },
};

function ProjectsSection({ navOffset = false }) {
  const themeColor = themeData?.primaryColor ?? 'rgb(var(--dark-cyan-rgb))';
  const accentColor = themeData?.navbarColor ?? 'rgb(var(--sunglow-rgb))';
  const copy = projectsCopy ?? {};
  const statsCopy = copy.stats ?? {};
  const emptyCopy = copy.emptyState ?? {};
  const summaryHeading = copy.summaryLabel ?? '';
  const profileLinkTemplate = copy.profileLinkLabel ?? 'github.com/%username%';
  const updatedLabel = copy.updatedLabel ?? '';
  const readmeCopy = copy.readme ?? {};
  const defaultRepoTag = copy.defaultTag ?? '';
  const formatUpdatedDate = (value) => {
    if (!value) {
      return '';
    }
    const formatted = new Date(value).toLocaleDateString();
    return updatedLabel ? `${updatedLabel} ${formatted}` : formatted;
  };

  const showcaseConfig = React.useMemo(() => {
    const source = Array.isArray(projectShowcaseData) && projectShowcaseData.length > 0
      ? projectShowcaseData
      : FALLBACK_SHOWCASE;

    return source
      .filter((item) => typeof item?.repo === 'string')
      .map((item) => ({ repo: item.repo, tag: item.tag ?? '' }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectShowcaseData]);

  const showcaseRepos = React.useMemo(
    () => showcaseConfig.map((item) => item.repo),
    [showcaseConfig]
  );

  const showcaseRepoKey = React.useMemo(() => showcaseRepos.join('|'), [showcaseRepos]);

  const repoTagMap = React.useMemo(() => {
    return showcaseConfig.reduce((acc, item) => {
      if (item.repo) {
        acc[item.repo.toLowerCase()] = item.tag ?? '';
      }
      return acc;
    }, {});
  }, [showcaseConfig]);

  const githubChannel = (contactData?.channels ?? []).find(
    (channel) => channel.label?.toLowerCase() === 'github'
  );

  const githubUsername = (() => {
    if (githubChannel?.username) {
      return githubChannel.username;
    }

    if (githubChannel?.value) {
      const parts = githubChannel.value.split('/');
      return parts[parts.length - 1] || 'v993';
    }

    if (githubChannel?.href) {
      const href = githubChannel.href.replace(/https?:\/\/github.com\//i, '');
      const firstSegment = href.split('/')[0];
      return firstSegment || 'v993';
    }

    return 'v993';
  })();

  const formattedProfileLabel = profileLinkTemplate.replace(/%username%/gi, githubUsername ?? '');
  const modalLinkText = copy.modalLinkLabel
    ? copy.modalLinkLabel.replace(/%username%/gi, githubUsername ?? '')
    : formattedProfileLabel;

  const getRepoTag = (repo) => {
    const nameKey = repo?.name?.toLowerCase();
    const fullKey = repo?.full_name?.toLowerCase();
    const manualTag = (nameKey && repoTagMap[nameKey]) || (fullKey && repoTagMap[fullKey]);
    return manualTag || repo?.language || defaultRepoTag;
  };

  const [githubSummary, setGithubSummary] = useState(null);
  const [showcaseRepoData, setShowcaseRepoData] = useState([]);
  const [isLoadingGithub, setIsLoadingGithub] = useState(false);
  const [githubError, setGithubError] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [readmeCache, setReadmeCache] = useState({});
  const [readmeLoading, setReadmeLoading] = useState(false);
  const [readmeError, setReadmeError] = useState(false);

  const repoCacheKey =
    selectedRepo && githubUsername
      ? selectedRepo.full_name ?? `${githubUsername}/${selectedRepo.name}`
      : null;
  const readmeContent = repoCacheKey ? readmeCache[repoCacheKey] : '';
  const isDialogOpen = Boolean(selectedRepo);
  const selectedRepoTitle = selectedRepo
    ? selectedRepo.name?.replace(/-/g, ' ') || selectedRepo.name
    : '';
  const selectedRepoUrl = selectedRepo
    ? selectedRepo.html_url ?? (repoCacheKey ? `https://github.com/${repoCacheKey}` : undefined)
    : undefined;
  const selectedRepoTopics = selectedRepo?.topics ?? [];

  const handleCardClick = (repo) => {
    setSelectedRepo(repo);
    setReadmeError(false);
    const key = repo.full_name ?? `${githubUsername}/${repo.name}`;
    const hasCachedReadme = Boolean(readmeCache[key]);
    setReadmeLoading(!hasCachedReadme);
  };

  const handleDialogClose = () => {
    setSelectedRepo(null);
    setReadmeLoading(false);
    setReadmeError(false);
  };

  useEffect(() => {
    let isActive = true;

    const fetchGithubData = async () => {
      if (typeof window === 'undefined' || !githubUsername) {
        return;
      }

      setIsLoadingGithub(true);
      setGithubError(false);

      try {
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${githubUsername}`, GITHUB_JSON_HEADERS),
          fetch(
            `https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated`,
            GITHUB_JSON_HEADERS
          ),
        ]);

        if (!userRes.ok) {
          throw new Error('Failed to load user');
        }

        const userData = await userRes.json();
        let repoData = [];

        if (reposRes.ok) {
          repoData = await reposRes.json();
        }

        if (!isActive) {
          return;
        }

        const totalStars = repoData.reduce(
          (acc, repo) => acc + (typeof repo.stargazers_count === 'number' ? repo.stargazers_count : 0),
          0
        );

        const languageUsage = repoData.reduce((acc, repo) => {
          if (repo.language) {
            const language = repo.language;
            acc[language] = (acc[language] ?? 0) + 1;
          }
          return acc;
        }, {});

        const topLanguages = Object.entries(languageUsage)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([language, count]) => ({ language, count }));

        const mostRecentRepo = repoData
          .slice()
          .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))[0];

        setGithubSummary({
          login: userData?.login,
          name: userData?.name,
          bio: userData?.bio,
          avatarUrl: userData?.avatar_url,
          followers: userData?.followers,
          publicRepos: userData?.public_repos,
          totalStars,
          topLanguages,
          profileUrl: userData?.html_url,
          mostRecentRepo: mostRecentRepo?.name,
          mostRecentRepoUrl: mostRecentRepo?.html_url,
          mostRecentRepoUpdatedAt: mostRecentRepo?.pushed_at,
        });

        const repoNames = showcaseRepoKey
          ? showcaseRepoKey.split('|').filter(Boolean)
          : [];

        const selectedRepos = repoNames
          .map((repoName) =>
            repoData.find((repo) => repo.name?.toLowerCase() === repoName.toLowerCase())
          )
          .filter(Boolean);

        setShowcaseRepoData(selectedRepos);
      } catch (error) {
        if (isActive) {
          setGithubError(true);
          setShowcaseRepoData([]);
        }
      } finally {
        if (isActive) {
          setIsLoadingGithub(false);
        }
      }
    };

    fetchGithubData();

    return () => {
      isActive = false;
    };
  }, [githubUsername, showcaseRepoKey]);

  useEffect(() => {
    if (!selectedRepo || !repoCacheKey || readmeContent) {
      return;
    }

    let isActive = true;

    const fetchReadme = async () => {
      setReadmeLoading(true);
      setReadmeError(false);

      try {
        const response = await fetch(
          `https://api.github.com/repos/${repoCacheKey}/readme`,
          {
            headers: {
              Accept: 'application/vnd.github.VERSION.html',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to load README');
        }

        const contentType = response.headers.get('content-type') ?? '';
        let bodyText = await response.text();

        if (contentType.includes('application/json')) {
          const data = JSON.parse(bodyText);

          if (data?.content) {
            const decoded = atob(data.content.replace(/\s/g, ''));
            bodyText = marked.parse(decoded);
          } else if (data?.download_url) {
            const markdownResponse = await fetch(data.download_url);
            const markdown = await markdownResponse.text();
            bodyText = marked.parse(markdown);
          } else {
            throw new Error('No README content available');
          }
        } else if (!contentType.includes('text/html')) {
          bodyText = marked.parse(bodyText);
        }

        if (!isActive) {
          return;
        }

        setReadmeCache((prev) => ({ ...prev, [repoCacheKey]: bodyText }));
        setReadmeLoading(false);
      } catch (error) {
        if (!isActive) {
          return;
        }

        setReadmeError(true);
        setReadmeLoading(false);
      }
    };

    fetchReadme();

    return () => {
      isActive = false;
    };
  }, [selectedRepo, repoCacheKey, readmeContent]);

  return (
    <Box
      id="projects"
      sx={{
        position: 'relative',
        minWidth: '100vw',
        minHeight: '90vh',
        overflow: 'hidden',
        py: { xs: 6, md: 8 },
        px: { xs: 3, md: 6, lg: 8 },
        scrollMarginTop: { xs: 96, md: 128 },
        // scroll snapping disabled site-wide
        background: 'none',
        pl: {
          xs: 0,
          md: navOffset ? 'calc(280px + 48px)' : 0,
          lg: navOffset ? 'calc(320px + 64px)' : 0,
        },
        transition: 'padding-left 620ms cubic-bezier(0.22, 1, 0.36, 1)',
        '& > *': {
          position: 'relative',
          zIndex: 1,
        },
        '&::before': {
          display: 'none',
        },
        '&::after': {
          display: 'none',
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
          '& > *': {
            position: 'relative',
            zIndex: 1,
          },
        }}
      >
        <Grid container spacing={{ xs: 3, md: 4 }} alignItems="stretch">
          <Grid item xs={12} md={githubUsername ? 7 : 12}>
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: githubUsername ? 'center' : 'flex-start',
                gap: 1.5,
              }}
            >
              <Stack
                spacing={1.5}
                alignItems={{ xs: 'flex-start', md: 'flex-start' }}
                textAlign={{ xs: 'left', md: 'left' }}
              >
                <Typography variant="overline" sx={{ letterSpacing: 3, color: 'text.secondary' }}>
                  {copy.eyebrow ?? ''}
                </Typography>
                <Typography variant="h2" fontWeight={700}>
                  {copy.title ?? ''}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 660 }}>
                  {copy.description ?? ''}
                </Typography>
              </Stack>
            </Box>
          </Grid>

          {githubUsername && (
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  p: { xs: 2.5, md: 3 },
                  borderRadius: 3,
                  border: '1px solid rgba(var(--dark-cyan-rgb), 0.18)',
                  background: 'linear-gradient(135deg, rgba(var(--projects-rgb), 0.12) 0%, rgba(255,255,255, 0.9) 100%)',
                  boxShadow: '0 16px 36px rgba(85, 134, 140, 0.18)',
                  height: '100%',
                }}
              >
                {isLoadingGithub && copy.syncingText && (
                  <Typography variant="body2" color="text.secondary">
                    {copy.syncingText}
                  </Typography>
                )}

                {!isLoadingGithub && githubError && copy.errorText && (
                  <Typography variant="body2" color="error">
                    {copy.errorText}
                  </Typography>
                )}

                {!isLoadingGithub && !githubError && githubSummary && (
                  <Stack spacing={2.25} sx={{ height: '100%', justifyContent: 'space-between' }}>
                    {summaryHeading ? (
                      <Typography variant="subtitle2" color="text.secondary" sx={{ letterSpacing: 0.8 }}>
                        {summaryHeading}
                      </Typography>
                    ) : null}
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2.25} alignItems="center">
                  <Avatar
                    alt={githubSummary.name || githubSummary.login || githubUsername}
                    src={githubSummary.avatarUrl ?? undefined}
                    sx={{ width: 68, height: 68, border: `2px solid ${themeColor}` }}
                  />
                      <Stack spacing={0.75} sx={{ textAlign: { xs: 'left', md: 'left' } }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {githubSummary.name ?? githubSummary.login ?? githubUsername}
                        </Typography>
                        {githubSummary.bio && (
                          <Typography variant="body2" color="text.secondary">
                            {githubSummary.bio}
                          </Typography>
                        )}
                        <MuiLink
                          href={githubSummary.profileUrl ?? githubChannel?.href ?? `https://github.com/${githubUsername}`}
                          target="_blank"
                          rel="noreferrer"
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.75,
                            fontWeight: 600,
                            color: themeColor,
                          }}
                        >
                          <GitHubIcon fontSize="small" />
                          {formattedProfileLabel}
                        </MuiLink>
                      </Stack>
                    </Stack>

                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={{ xs: 1.5, sm: 2 }}
                    sx={{ justifyContent: 'flex-start', textAlign: { xs: 'left', sm: 'left' } }}
                  >
                      <StatPill icon={<StarBorderRoundedIcon fontSize="small" />} label={statsCopy.stars ?? ''} value={githubSummary.totalStars ?? '—'} />
                      <StatPill icon={<CallSplitRoundedIcon fontSize="small" />} label={statsCopy.repos ?? ''} value={githubSummary.publicRepos ?? '—'} />
                      <StatPill icon={<VisibilityOutlinedIcon fontSize="small" />} label={statsCopy.followers ?? ''} value={githubSummary.followers ?? '—'} />
                    </Stack>
                  </Stack>
                )}
              </Box>
            </Grid>
          )}
        </Grid>

        <Grid container spacing={{ xs: 3, md: 4 }}>
          {showcaseRepoData.length > 0 ? (
            showcaseRepoData.map((repo) => (
              <Grid key={repo.id} item xs={12} sm={6} lg={4} xl={4}>
                <SectionCard
                  variant="project"
                  eyebrow={getRepoTag(repo)}
                  title={repo.name?.replace(/-/g, ' ') || repo.name}
                  timeframe={formatUpdatedDate(repo.pushed_at) || undefined}
                  bullets={null}
                  onClick={() => handleCardClick(repo)}
                >
                  <Stack spacing={2} sx={{ height: '100%' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {repo.description || copy.repoDescriptionFallback || ''}
                    </Typography>

                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                        gap: 1,
                        mt: 0.5,
                      }}
                    >
                      <StatPill icon={<StarBorderRoundedIcon fontSize="small" />} label={statsCopy.stars ?? ''} value={repo.stargazers_count ?? 0} />
                      <StatPill icon={<CallSplitRoundedIcon fontSize="small" />} label={statsCopy.forks ?? ''} value={repo.forks_count ?? 0} />
                      <StatPill icon={<VisibilityOutlinedIcon fontSize="small" />} label={statsCopy.watchers ?? ''} value={repo.watchers_count ?? 0} />
                    </Box>

                    {Array.isArray(repo.topics) && repo.topics.length > 0 && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, pt: 0.5 }}>
                        {repo.topics.slice(0, 6).map((topic) => (
                          <Chip
                            key={topic}
                            label={topic}
                            {...sharedChipProps}
                            sx={{ ...sharedChipSx }}
                          />
                        ))}
                      </Box>
                    )}
                  </Stack>
                </SectionCard>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 3,
                  border: '1px dashed rgba(var(--dark-cyan-rgb), 0.3)',
                  textAlign: 'center',
                  color: 'text.secondary',
                }}
              >
                <Typography variant="body2">
                  {isLoadingGithub
                    ? emptyCopy.loading ?? ''
                    : githubError
                    ? emptyCopy.error ?? ''
                    : emptyCopy.default ?? ''}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>

        <Dialog
          open={isDialogOpen}
          onClose={handleDialogClose}
          TransitionComponent={Transition}
          keepMounted
          fullWidth
          maxWidth="lg"
          BackdropProps={{
            sx: {
              backgroundColor: 'rgba(17, 24, 39, 0.55)',
              backdropFilter: 'blur(2px)',
            },
          }}
          PaperProps={{
            sx: {
              width: 'min(1200px, 96vw)',
              height: { xs: '92vh', md: '88vh' },
              borderRadius: 5,
              overflow: 'hidden',
              boxShadow: '0 32px 72px rgba(17, 24, 39, 0.45)',
              border: '1px solid rgba(17, 24, 39, 0.16)',
              background: 'linear-gradient(180deg, #ffffff 0%, #f9fbfc 100%)',
            },
          }}
        >
          {selectedRepo && (
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: { xs: 2.5, md: 4 },
                  py: { xs: 2, md: 3 },
                  gap: 2,
                  backgroundColor: 'rgba(17, 24, 39, 0.06)',
                  borderBottom: '1px solid rgba(17, 24, 39, 0.12)',
                }}
              >
                <Stack spacing={1.25} sx={{ pr: 2, maxWidth: 'calc(100% - 48px)' }}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={{ xs: 0.5, sm: 1.25 }}
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                  >
                    <Typography variant="overline" sx={{ letterSpacing: 2, color: accentColor }}>
                      {getRepoTag(selectedRepo)}
                    </Typography>
                    {formatUpdatedDate(selectedRepo.pushed_at) && (
                      <Typography variant="caption" color="text.secondary">
                        {formatUpdatedDate(selectedRepo.pushed_at)}
                      </Typography>
                    )}
                  </Stack>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    {selectedRepoTitle}
                  </Typography>
                  {selectedRepo.description && (
                    <Typography variant="body1" color="text.secondary">
                      {selectedRepo.description}
                    </Typography>
                  )}
                  <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={{ xs: 1.5, md: 2.5 }}
                    alignItems={{ xs: 'flex-start', md: 'center' }}
                  >
                    {selectedRepoUrl && (
                      <MuiLink
                        href={selectedRepoUrl}
                        target="_blank"
                        rel="noreferrer"
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 0.75,
                          fontWeight: 600,
                          color: themeColor,
                        }}
                      >
                        <GitHubIcon fontSize="small" />
                        {modalLinkText}
                      </MuiLink>
                    )}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      <StatPill
                        icon={<StarBorderRoundedIcon fontSize="small" />}
                        label={statsCopy.stars ?? ''}
                        value={selectedRepo.stargazers_count ?? 0}
                      />
                      <StatPill
                        icon={<CallSplitRoundedIcon fontSize="small" />}
                        label={statsCopy.forks ?? ''}
                        value={selectedRepo.forks_count ?? 0}
                      />
                      <StatPill
                        icon={<VisibilityOutlinedIcon fontSize="small" />}
                        label={statsCopy.watchers ?? ''}
                        value={selectedRepo.watchers_count ?? 0}
                      />
                    </Box>
                  </Stack>
                  {selectedRepoTopics.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                      {selectedRepoTopics.map((topic) => (
                        <Chip
                          key={topic}
                          label={topic}
                          {...sharedChipProps}
                          sx={{ ...sharedChipSx }}
                        />
                      ))}
                    </Box>
                  )}
                </Stack>
                <IconButton
                  onClick={handleDialogClose}
                  aria-label="Close project details"
                  sx={{ alignSelf: 'flex-start' }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>

              <Box
                sx={{
                  flex: 1,
                  overflowY: 'auto',
                  px: { xs: 2.5, md: 4 },
                  py: { xs: 3, md: 4 },
                }}
              >
                {readmeLoading && readmeCopy.loading && (
                  <Stack alignItems="center" justifyContent="center" spacing={2} sx={{ minHeight: '40vh' }}>
                    <CircularProgress color="success" />
                    <Typography variant="body2" color="text.secondary">
                      {readmeCopy.loading}
                    </Typography>
                  </Stack>
                )}

                {!readmeLoading && readmeError && readmeCopy.error && (
                  <Typography variant="body2" color="error">
                    {readmeCopy.error}
                  </Typography>
                )}

                {!readmeLoading && !readmeError && (
                  <Box
                    sx={{
                      fontSize: '0.98rem',
                      lineHeight: 1.7,
                      color: 'text.primary',
                      '& h1': { fontSize: '2rem', marginTop: 0, marginBottom: 2, fontWeight: 700 },
                      '& h2': { fontSize: '1.65rem', marginTop: 3, marginBottom: 1.5, fontWeight: 700 },
                      '& h3': { fontSize: '1.35rem', marginTop: 2.5, marginBottom: 1.25, fontWeight: 700 },
                      '& p': { marginBottom: 2 },
                      '& ul, & ol': { paddingLeft: 3, marginBottom: 2 },
                      '& li': { marginBottom: 1 },
                      '& pre': {
                        backgroundColor: 'rgba(85, 134, 140, 0.08)',
                        borderRadius: 2,
                        padding: 2,
                        overflowX: 'auto',
                        fontSize: '0.9rem',
                      },
                      '& code': {
                        backgroundColor: 'rgba(85, 134, 140, 0.1)',
                        borderRadius: 1,
                        padding: '2px 6px',
                        fontSize: '0.88rem',
                      },
                      '& a': { color: themeColor, fontWeight: 600 },
                      '& table': {
                        borderCollapse: 'collapse',
                        width: '100%',
                        marginBottom: 3,
                      },
                      '& th, & td': {
                        border: '1px solid rgba(85, 134, 140, 0.2)',
                        padding: '8px 12px',
                        textAlign: 'left',
                      },
                    }}
                    dangerouslySetInnerHTML={{
                      __html: readmeContent || (readmeCopy.empty ? `<p>${readmeCopy.empty}</p>` : ''),
                    }}
                  />
                )}
              </Box>
            </Box>
          )}
        </Dialog>
      </Box>
    </Box>
  );
}

export default ProjectsSection;
