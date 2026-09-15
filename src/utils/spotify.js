// Spotify API utility helpers

const SPOTIFY_AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

export const SPOTIFY_SCOPES = ['user-top-read', 'user-read-private', 'user-read-email'];

/**
 * Builds the Spotify Authorization URL for the OAuth Authorization Code flow
 */
export function buildAuthUrl(clientId, redirectUri) {
  if (!clientId) return '#';
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: SPOTIFY_SCOPES.join(' '),
    show_dialog: 'true',
  });
  return `${SPOTIFY_AUTH_ENDPOINT}?${params.toString()}`;
}

/**
 * Exchanges authorization code for tokens via backend /api/spotify-token
 */
export async function exchangeCodeForToken(code, redirectUri) {
  const response = await fetch('/api/spotify-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, redirect_uri: redirectUri }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to exchange authorization code for token');
  }
  return data;
}

/**
 * Refreshes an expired access token via backend /api/spotify-token
 */
export async function refreshAccessToken(refreshToken) {
  if (!refreshToken) throw new Error('No refresh token provided');
  const response = await fetch('/api/spotify-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to refresh Spotify access token');
  }
  return data;
}

/**
 * Helper to process Spotify responses and construct informative error messages
 */
async function handleSpotifyResponse(res, contextMessage) {
  if (res.ok) {
    return res.json();
  }

  let errorDetail = '';
  try {
    const errorData = await res.json();
    errorDetail = errorData?.error?.message || errorData?.error_description || errorData?.error || '';
  } catch {
    // If not JSON, ignore
  }

  const status = res.status;
  if (status === 401) {
    const err = new Error('Spotify session expired (401). Please re-authenticate.');
    err.status = 401;
    throw err;
  }

  if (status === 403) {
    const err = new Error(
      `Spotify Developer Mode restriction (403): ${
        errorDetail ||
        'User not registered in the Developer Dashboard. In Spotify Developer Mode, the account email must be added under "Users and Access".'
      }`
    );
    err.status = 403;
    throw err;
  }

  if (status === 429) {
    const retryAfter = res.headers.get('Retry-After');
    const err = new Error(`Spotify rate limit reached (429). Please wait ${retryAfter ? `${retryAfter}s` : 'a few seconds'}.`);
    err.status = 429;
    throw err;
  }

  const err = new Error(`${contextMessage} (${status}${errorDetail ? `: ${errorDetail}` : ''})`);
  err.status = status;
  throw err;
}

/**
 * Fetches user profile from Spotify
 */
export async function fetchUserProfile(token) {
  const res = await fetch(`${SPOTIFY_API_BASE}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleSpotifyResponse(res, 'Spotify /me failed');
}

/**
 * Fetches user's top tracks (medium_term, limit 20)
 */
export async function fetchTopTracks(token, timeRange = 'medium_term', limit = 20) {
  const res = await fetch(
    `${SPOTIFY_API_BASE}/me/top/tracks?time_range=${timeRange}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return handleSpotifyResponse(res, 'Failed to fetch top tracks');
}

/**
 * Fetches user's top artists (medium_term, limit 20)
 */
export async function fetchTopArtists(token, timeRange = 'medium_term', limit = 20) {
  const res = await fetch(
    `${SPOTIFY_API_BASE}/me/top/artists?time_range=${timeRange}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return handleSpotifyResponse(res, 'Failed to fetch top artists');
}

/**
 * Fetches audio features for track IDs.
 * Note: Includes graceful fallback for Spotify's Nov 2024 Developer Policy restrictions
 */
export async function fetchAudioFeatures(token, trackIds) {
  if (!trackIds || trackIds.length === 0) return { features: [], isFallback: false };

  try {
    const ids = trackIds.join(',');
    const res = await fetch(`${SPOTIFY_API_BASE}/audio-features?ids=${ids}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 403) {
      console.warn(
        '[Sonic Mirror] Spotify returned 403 on /audio-features (November 2024 API restriction). Falling back to track metadata heuristics.'
      );
      return { features: [], isFallback: true };
    }

    if (!res.ok) {
      console.warn(`[Sonic Mirror] Audio features request returned status ${res.status}.`);
      return { features: [], isFallback: true };
    }

    const data = await res.json();
    const validFeatures = (data.audio_features || []).filter(Boolean);
    return { features: validFeatures, isFallback: validFeatures.length === 0 };
  } catch (err) {
    console.warn('[Sonic Mirror] Audio features fetch failed, using fallback heuristics:', err);
    return { features: [], isFallback: true };
  }
}

/**
 * Compute aggregate statistics from top tracks, artists, and audio features
 */
export function computeAggregateStats(tracks = [], artists = [], audioData = { features: [], isFallback: false }) {
  const { features, isFallback } = audioData;

  // 1. Dominant Genres from top artists
  const genreCounts = {};
  artists.forEach((artist) => {
    (artist.genres || []).forEach((genre) => {
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    });
  });

  const sortedGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([genre, count]) => ({ genre, count }));

  const dominantGenre = sortedGenres[0]?.genre || 'Eclectic';

  // 2. Track popularity average
  const avgPopularity = tracks.length
    ? Math.round(tracks.reduce((acc, t) => acc + (t.popularity || 0), 0) / tracks.length)
    : 50;

  // 3. Explicit content percentage
  const explicitCount = tracks.filter((t) => t.explicit).length;
  const explicitPercentage = tracks.length ? Math.round((explicitCount / tracks.length) * 100) : 0;

  // 4. Release era distribution
  const releaseYears = tracks
    .map((t) => {
      const date = t.album?.release_date;
      return date ? parseInt(date.substring(0, 4), 10) : null;
    })
    .filter(Boolean);

  const avgReleaseYear = releaseYears.length
    ? Math.round(releaseYears.reduce((a, b) => a + b, 0) / releaseYears.length)
    : 2023;

  // 5. Audio Features stats (or fallback heuristic)
  let avgValence = 0;
  let avgEnergy = 0;
  let avgDanceability = 0;
  let avgTempo = 0;
  let avgAcousticness = 0;

  if (features && features.length > 0) {
    avgValence = Math.round((features.reduce((a, f) => a + (f.valence || 0), 0) / features.length) * 100);
    avgEnergy = Math.round((features.reduce((a, f) => a + (f.energy || 0), 0) / features.length) * 100);
    avgDanceability = Math.round((features.reduce((a, f) => a + (f.danceability || 0), 0) / features.length) * 100);
    avgTempo = Math.round(features.reduce((a, f) => a + (f.tempo || 0), 0) / features.length);
    avgAcousticness = Math.round((features.reduce((a, f) => a + (f.acousticness || 0), 0) / features.length) * 100);
  } else {
    // Graceful fallback heuristics based on genres and track popularity
    const isUpbeatGenre = sortedGenres.some((g) =>
      ['pop', 'dance', 'hip hop', 'edm', 'house', 'rap', 'electro'].some((kw) => g.genre.includes(kw))
    );
    const isMellowGenre = sortedGenres.some((g) =>
      ['indie', 'folk', 'ambient', 'sad', 'slow', 'acoustic', 'lo-fi'].some((kw) => g.genre.includes(kw))
    );

    avgEnergy = isUpbeatGenre ? 68 : isMellowGenre ? 42 : 55;
    avgValence = isMellowGenre ? 38 : isUpbeatGenre ? 64 : 50;
    avgDanceability = isUpbeatGenre ? 72 : 52;
    avgTempo = isUpbeatGenre ? 124 : 108;
    avgAcousticness = isMellowGenre ? 60 : 25;
  }

  return {
    dominantGenre,
    topGenres: sortedGenres.slice(0, 5),
    avgPopularity,
    explicitPercentage,
    avgReleaseYear,
    avgValence,
    avgEnergy,
    avgDanceability,
    avgTempo,
    avgAcousticness,
    isAudioFallback: isFallback,
  };
}
