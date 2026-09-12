import React from 'react';
import { LogOut, ExternalLink } from 'lucide-react';
import RoastCard from './RoastCard';
import PosterCanvas from './PosterCanvas';

export default function TrackList({
  user,
  tracks,
  artists,
  stats,
  roastData,
  isRoastGenerating,
  roastError,
  currentTone,
  onRegenerateRoast,
  onProceedToPoster,
  onLogout,
}) {
  return (
    <div className="min-h-screen bg-void text-sleeve-white font-body pb-32 selection:bg-studio-glow selection:text-white relative overflow-hidden">
      {/* Background Aurora and Noise */}
      <div className="aurora-bg fixed" style={{ '--aurora-1': 'rgba(255, 51, 102, 0.15)', '--aurora-2': 'rgba(0, 229, 255, 0.1)', '--aurora-3': 'rgba(255, 184, 0, 0.1)' }}></div>
      <div className="fixed inset-0 bg-noise z-0 pointer-events-none"></div>

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-void/90 backdrop-blur-md border-b border-static-grey px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl uppercase tracking-wider leading-none m-0">SONIC MIRROR</h1>
            <span className="text-[10px] uppercase tracking-widest text-static-grey">STUDIO LIVE</span>
          </div>

          <div className="flex items-center gap-6">
            {user && (
              <span className="text-xs uppercase tracking-widest text-sleeve-white/80 hidden sm:inline">
                USR // {user.display_name}
              </span>
            )}
            <button
              onClick={onLogout}
              className="text-xs uppercase tracking-widest text-static-grey hover:text-studio-glow transition-colors border-b border-transparent hover:border-studio-glow"
            >
              DISCONNECT
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-12 relative z-10">
        
        {/* Section 1: AI Roast Readout */}
        <section>
          <RoastCard
            roastData={roastData}
            isGenerating={isRoastGenerating}
            error={roastError}
            currentTone={currentTone}
            onRegenerate={onRegenerateRoast}
            onProceedToPoster={onProceedToPoster}
          />
        </section>

        {/* Section 2: Story Poster Generator Studio */}
        {roastData && (
          <section id="poster-studio" className="border-b border-static-grey py-12">
            <h3 className="font-display text-4xl md:text-5xl uppercase tracking-wider mb-8">STUDIO EXPORT</h3>
            <PosterCanvas
              user={user}
              tracks={tracks}
              stats={stats}
              roastData={roastData}
              currentTone={currentTone}
              onRegenerateRoast={onRegenerateRoast}
              isRegenerating={isRoastGenerating}
            />
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pt-12">
          
          {/* Section 3: Computed Audio Taste DNA Metrics */}
          {stats && (
            <section className="md:col-span-4 border-r md:border-static-grey md:pr-12">
              <h3 className="font-display text-4xl uppercase tracking-wider mb-8 border-b border-static-grey pb-4">
                VIBE METRICS
              </h3>

              <div className="flex flex-col gap-8">
                <div>
                  <p className="font-display text-6xl text-studio-glow leading-none">{stats.avgTempo} <span className="text-3xl text-sleeve-white">BPM</span></p>
                  <p className="text-xs uppercase tracking-widest text-static-grey mt-2">AVERAGE TEMPO</p>
                </div>
                <div className="h-px w-full bg-static-grey/50"></div>
                <div>
                  <p className="font-display text-6xl leading-none">{stats.avgEnergy}%</p>
                  <p className="text-xs uppercase tracking-widest text-static-grey mt-2">ENERGY LEVEL</p>
                </div>
                <div className="h-px w-full bg-static-grey/50"></div>
                <div>
                  <p className="font-display text-6xl leading-none">{stats.avgValence}%</p>
                  <p className="text-xs uppercase tracking-widest text-static-grey mt-2">HAPPINESS (VALENCE)</p>
                </div>
                <div className="h-px w-full bg-static-grey/50"></div>
                <div>
                  <p className="font-display text-6xl leading-none">{stats.avgPopularity}%</p>
                  <p className="text-xs uppercase tracking-widest text-static-grey mt-2">MAINSTREAM SCORE</p>
                </div>
                <div className="h-px w-full bg-static-grey/50"></div>
                <div>
                  <p className="font-body text-xl font-bold uppercase truncate">{stats.dominantGenre}</p>
                  <p className="text-xs uppercase tracking-widest text-static-grey mt-2">DOMINANT GENRE</p>
                </div>
              </div>
            </section>
          )}

          {/* Section 4: Top Tracks */}
          <section className="md:col-span-8">
            <div className="flex items-end justify-between border-b border-static-grey pb-4 mb-4">
              <h3 className="font-display text-4xl uppercase tracking-wider m-0">HEAVY ROTATION</h3>
              <span className="text-xs uppercase tracking-widest text-static-grey">{tracks.length} TRACKS ANALYZED</span>
            </div>

            <div className="flex flex-col">
              {tracks.map((track, idx) => {
                const albumCover = track.album?.images?.[2]?.url || track.album?.images?.[1]?.url;
                return (
                  <div
                    key={track.id || idx}
                    className="group flex items-center gap-4 py-3 border-b border-static-grey/30 hover:border-studio-glow transition-all"
                  >
                    <span className="font-display text-2xl text-static-grey w-6 shrink-0 group-hover:text-studio-glow transition-colors">
                      {(idx + 1).toString().padStart(2, '0')}
                    </span>
                    
                    {albumCover && (
                      <img
                        src={albumCover}
                        alt={track.name}
                        className="w-10 h-10 object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all shrink-0"
                      />
                    )}
                    
                    <div className="flex-1 min-w-0 group-hover:translate-x-2 transition-transform duration-300">
                      <p className="text-base font-bold truncate">
                        {track.name}
                      </p>
                      <p className="text-xs text-sleeve-white/60 truncate uppercase tracking-wider">
                        {track.artists?.map((a) => a.name).join(', ')}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-xs uppercase tracking-widest text-static-grey hidden sm:inline">
                        {Math.floor((track.duration_ms || 0) / 60000)}:
                        {String(Math.floor(((track.duration_ms || 0) % 60000) / 1000)).padStart(2, '0')}
                      </span>
                      {track.external_urls?.spotify && (
                        <a
                          href={track.external_urls.spotify}
                          target="_blank"
                          rel="noreferrer"
                          className="text-static-grey hover:text-studio-glow transition-colors"
                          title="Listen on Spotify"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
          
        </div>
      </main>
    </div>
  );
}
