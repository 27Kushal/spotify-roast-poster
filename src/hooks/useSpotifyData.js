import { useState, useEffect, useCallback } from 'react';
import {
  fetchUserProfile,
  fetchTopTracks,
  fetchTopArtists,
  fetchAudioFeatures,
  computeAggregateStats,
} from '../utils/spotify';

export function useSpotifyData(token) {
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

    try {
      // 1. Fetch User Profile
      const userProfile = await fetchUserProfile(token).catch((err) => {
        console.warn('Could not fetch user profile:', err);
        return null;
      });
      setUser(userProfile);

      // 2. Fetch Top Tracks & Top Artists concurrently
      const [tracksData, artistsData] = await Promise.all([
        fetchTopTracks(token, 'medium_term', 20),
        fetchTopArtists(token, 'medium_term', 20),
      ]);

      const topTracks = tracksData.items || [];
      const topArtists = artistsData.items || [];
      setTracks(topTracks);
      setArtists(topArtists);

      // Explicit spec requirement: Log top tracks to console
      console.log('🎵 [Sonic Mirror] Successfully fetched User Top Tracks (medium_term):', topTracks);
      console.log(
        '🎶 [Sonic Mirror] Top Tracks Summary:',
        topTracks.map((t, idx) => `${idx + 1}. ${t.name} — ${t.artists.map((a) => a.name).join(', ')}`)
      );

      // 3. Fetch Audio Features for these tracks (with graceful Nov 2024 policy fallback)
      const trackIds = topTracks.map((t) => t.id).filter(Boolean);
      const audioResult = await fetchAudioFeatures(token, trackIds);
      setAudioFeatures(audioResult.features);

      // 4. Compute aggregate statistics
      const computedStats = computeAggregateStats(topTracks, topArtists, audioResult);
      setStats(computedStats);

      console.log('📊 [Sonic Mirror] Computed Aggregate Stats:', computedStats);
    } catch (err) {
      console.error('[Sonic Mirror] Failed to fetch Spotify data:', err);
      setError(err.message || 'Failed to fetch Spotify data');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

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
