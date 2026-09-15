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
    refreshAuthToken,
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
  } = useSpotifyData(token, { refreshAuthToken, logout });

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
      <div className="min-h-screen flex items-center justify-center bg-zine-cream text-zine-black font-body">
        <LoadingState customMessage="Fetching top tracks and executing clinical evaluation..." />
      </div>
    );
  }

  // 3. Error State
  if (dataError) {
    const is403 = dataError.includes('403') || dataError.includes('Developer Mode') || dataError.includes('whitelisted');
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-zine-cream text-zine-black font-body">
        <div className="max-w-lg w-full p-8 border-4 border-zine-black bg-white shadow-brutal text-center">
          <div className="w-14 h-14 border-2 border-zine-black bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4 shadow-brutal-sm">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="font-headline text-2xl uppercase tracking-wider mb-2">TELEMETRY ERROR</h2>
          <p className="font-mono text-xs text-zinc-700 mb-4 bg-zinc-100 p-3 border-2 border-black break-words">{dataError}</p>

          {is403 && (
            <div className="mb-6 p-3.5 bg-amber-50 border-2 border-amber-500 text-left text-xs font-mono text-amber-900 leading-relaxed">
              <strong>⚠️ Spotify Developer Mode:</strong> In Spotify Developer Mode, only accounts explicitly added to the <em>"Users and Access"</em> whitelist in your Spotify Developer Portal can authenticate. Add this Spotify account's email to test on this device.
            </div>
          )}

          <div className="flex justify-center gap-3">
            <button
              onClick={refetch}
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-zine-black bg-zine-lime text-black font-headline text-sm uppercase tracking-wider shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>RETRY</span>
            </button>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-zine-black bg-white hover:bg-zinc-100 text-black font-headline text-sm uppercase tracking-wider shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              <span>LOGOUT & RECONNECT</span>
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
