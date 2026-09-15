import React, { useState, useEffect } from 'react';
import { useSpotifyAuth } from './hooks/useSpotifyAuth';
import { useSpotifyData } from './hooks/useSpotifyData';
import { useRoast } from './hooks/useRoast';
import LandingPage from './components/LandingPage';
import Callback from './components/Callback';
import TrackList from './components/TrackList';
import LoadingState from './components/LoadingState';
import { AlertTriangle, RefreshCw, Sparkles, LogOut } from 'lucide-react';
import { getDemoSession } from './utils/demoData';

export default function App() {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoData] = useState(() => getDemoSession());
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

          <div className="flex flex-col sm:flex-row justify-center gap-3 mb-3">
            <button
              onClick={refetch}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-zine-black bg-zine-lime text-black font-headline text-sm uppercase tracking-wider shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>RETRY</span>
            </button>
            <button
              onClick={logout}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-zine-black bg-white hover:bg-zinc-100 text-black font-headline text-sm uppercase tracking-wider shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              <span>LOGOUT & RECONNECT</span>
            </button>
          </div>

          <div className="pt-3 border-t-2 border-dashed border-zinc-300">
            <button
              onClick={() => setIsDemoMode(true)}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 border-3 border-black bg-[#FFE600] text-black font-headline text-sm uppercase tracking-wider shadow-[4px_4px_0px_#000] hover:bg-[#CCFF00] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>🎭 PREVIEW APP WITH DEMO DATA</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Demo Mode (Zero-login preview with sample telemetry)
  if (isDemoMode) {
    return (
      <div>
        {/* Top Demo Banner */}
        <div className="bg-[#FFE600] text-black border-b-4 border-black px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50 font-mono text-xs font-bold shadow-md">
          <div className="flex items-center gap-2">
            <span className="bg-black text-[#FFE600] px-2 py-0.5 uppercase tracking-wider text-[11px]">
              DEMO PREVIEW
            </span>
            <span>You are viewing sample Sonic Mirror audio telemetry without Spotify login.</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={loginUrl}
              className="px-3 py-1 bg-black text-white hover:bg-[#0047FF] transition-colors border border-black uppercase tracking-wider"
            >
              Connect Real Spotify
            </a>
            <button
              onClick={() => setIsDemoMode(false)}
              className="px-3 py-1 bg-white text-black hover:bg-zinc-200 border border-black uppercase tracking-wider flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit Demo</span>
            </button>
          </div>
        </div>

        <TrackList
          user={demoData.user}
          tracks={demoData.tracks}
          artists={demoData.artists}
          stats={demoData.stats}
          roastData={demoData.roastData}
          isRoastGenerating={false}
          roastError={null}
          currentTone="brutal"
          onRegenerateRoast={() => {}}
          onProceedToPoster={() => {
            const el = document.getElementById('poster-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onLogout={() => setIsDemoMode(false)}
        />
      </div>
    );
  }

  // 5. Authenticated Dashboard (Steps 1–5 Complete)
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

  // 6. Landing Page (Default)
  return (
    <LandingPage
      loginUrl={loginUrl}
      authConfig={authConfig}
      onTryDemo={() => setIsDemoMode(true)}
    />
  );
}
