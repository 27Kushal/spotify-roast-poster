import React, { useState, useEffect } from 'react';
import { useSpotifyAuth } from './hooks/useSpotifyAuth';
import { useSpotifyData } from './hooks/useSpotifyData';
import { useRoast } from './hooks/useRoast';
import LandingPage from './components/LandingPage';
import Callback from './components/Callback';
import TrackList from './components/TrackList';
import LoadingState from './components/LoadingState';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function App() {
  const {
    token,
    isAuthenticated,
    isLoading: isAuthLoading,
    error: authError,
    loginUrl,
    authConfig,
    handleCallback,
    logout,
  } = useSpotifyAuth();

  const {
    user,
    tracks,
    artists,
    stats,
    isLoading: isDataLoading,
    error: dataError,
    refetch,
  } = useSpotifyData(token);

  const {
    roastData,
    isGenerating: isRoastGenerating,
    error: roastError,
    currentTone,
    generateRoast,
    regenerate: regenerateRoast,
  } = useRoast(stats, tracks, artists);

  // Automatically trigger roast generation when Spotify data is ready
  useEffect(() => {
    if (stats && tracks.length > 0 && !roastData && !isRoastGenerating && !roastError) {
      generateRoast('brutal');
    }
  }, [stats, tracks, roastData, isRoastGenerating, roastError, generateRoast]);

  // Check if current view is the OAuth callback
  const [isCallbackRoute, setIsCallbackRoute] = useState(() => {
    return (
      typeof window !== 'undefined' &&
      (window.location.pathname === '/callback' || window.location.search.includes('code='))
    );
  });

  const handleAuthSuccess = () => {
    setIsCallbackRoute(false);
  };

  // 1. OAuth Callback Route
  if (isCallbackRoute) {
    return (
      <Callback
        onAuthSuccess={handleAuthSuccess}
        handleCallback={handleCallback}
      />
    );
  }

  // 2. Loading Spotify Data
  if (isAuthenticated && isDataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-spotify-black">
        <LoadingState customMessage="Fetching your top tracks and computing taste metrics..." />
      </div>
    );
  }

  // 3. Error State
  if (dataError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-spotify-black text-white">
        <div className="max-w-md w-full p-8 rounded-2xl bg-spotify-dark border border-red-500/30 text-center">
          <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold mb-2">Error Loading Spotify Data</h2>
          <p className="text-sm text-spotify-subtext mb-6">{dataError}</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={refetch}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-spotify-green text-black font-semibold text-sm hover:bg-[#1ed760] transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry</span>
            </button>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-colors"
            >
              <span>Log out</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Authenticated Dashboard (Steps 1–5 Complete)
  if (isAuthenticated && tracks.length > 0) {
    return (
      <TrackList
        user={user}
        tracks={tracks}
        artists={artists}
        stats={stats}
        roastData={roastData}
        isRoastGenerating={isRoastGenerating}
        roastError={roastError}
        currentTone={currentTone}
        onRegenerateRoast={regenerateRoast}
        onProceedToPoster={() => {
          // Will link to Phase 3 poster view
          const el = document.getElementById('poster-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onLogout={logout}
      />
    );
  }

  // 5. Landing Page (Default)
  return (
    <LandingPage
      loginUrl={loginUrl}
      authConfig={authConfig}
    />
  );
}
