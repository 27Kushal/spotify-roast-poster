import { useState, useEffect, useCallback } from 'react';
import {
  fetchUserProfile,
  fetchTopTracks,
  fetchTopArtists,
  fetchAudioFeatures,
  computeAggregateStats,
} from '../utils/spotify';

export function useSpotifyData(token, { refreshAuthToken, logout } = {}) {
  const [user, setUser] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [audioFeatures, setAudioFeatures] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    let activeToken = token;

    try {
      // 1. Fetch User Profile (non-blocking if it fails)
      const userProfile = await fetchUserProfile(activeToken).catch((err) => {
        console.warn('Could not fetch user profile:', err);
        return null;
      });
      setUser(userProfile);

      // 2. Fetch Top Tracks with automatic 401 retry & time range fallbacks
      let tracksData = null;
      try {
        tracksData = await fetchTopTracks(activeToken, 'medium_term', 20);
        if (!tracksData?.items || tracksData.items.length === 0) {
          // Fallback to short_term if medium_term is empty
          tracksData = await fetchTopTracks(activeToken, 'short_term', 20);
        }
        if (!tracksData?.items || tracksData.items.length === 0) {
          // Fallback to long_term
          tracksData = await fetchTopTracks(activeToken, 'long_term', 20);
        }
      } catch (err) {
        if (err.status === 401 && refreshAuthToken) {
          console.log('[Sonic Mirror] Token expired on tracks fetch. Attempting automatic refresh...');
          const refreshedToken = await refreshAuthToken();
          if (refreshedToken) {
            activeToken = refreshedToken;
            tracksData = await fetchTopTracks(activeToken, 'medium_term', 20);
          } else {
            throw err;
          }
        } else {
          throw err;
        }
      }

      const topTracks = tracksData?.items || [];
      if (topTracks.length === 0) {
        throw new Error('No listening history found on this Spotify account. Play a few songs on Spotify and try again!');
      }
      setTracks(topTracks);

      // 3. Fetch Top Artists with Graceful Fallback
      // Never crash the dashboard if Spotify top artists endpoint fails!
      let topArtists = [];
      try {
        const artistsData = await fetchTopArtists(activeToken, 'medium_term', 20);
        topArtists = artistsData?.items || [];
      } catch (artistErr) {
        console.warn('[Sonic Mirror] fetchTopArtists failed. Extracting artists from top tracks as fallback:', artistErr);
      }

      // If top artists endpoint returned empty or failed, extract unique artists from topTracks
      if (topArtists.length === 0) {
        const artistMap = new Map();
        for (const t of topTracks) {
          for (const a of (t.artists || [])) {
            if (a && a.id && !artistMap.has(a.id)) {
              artistMap.set(a.id, {
                id: a.id,
                name: a.name,
                genres: [],
                images: t.album?.images || [],
                popularity: t.popularity || 50,
              });
            }
          }
        }
        topArtists = Array.from(artistMap.values());
      }
      setArtists(topArtists);

      // 4. Fetch Audio Features for tracks
      const trackIds = topTracks.map((t) => t.id).filter(Boolean);
      const audioResult = await fetchAudioFeatures(activeToken, trackIds);
      setAudioFeatures(audioResult.features);

      // 5. Compute aggregate statistics
      const computedStats = computeAggregateStats(topTracks, topArtists, audioResult);
      setStats(computedStats);

      console.log('📊 [Sonic Mirror] Computed Aggregate Stats:', computedStats);
    } catch (err) {
      console.error('[Sonic Mirror] Failed to fetch Spotify data:', err);
      setError(err.message || 'Failed to fetch Spotify data');
    } finally {
      setIsLoading(false);
    }
  }, [token, refreshAuthToken]);

  useEffect(() => {
    if (token) {
      loadData();
    } else {
      setUser(null);
      setTracks([]);
      setArtists([]);
      setAudioFeatures([]);
      setStats(null);
    }
  }, [token, loadData]);

  return {
    user,
    tracks,
    artists,
    audioFeatures,
    stats,
    isLoading,
    error,
    refetch: loadData,
  };
}
