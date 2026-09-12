import React from 'react';
import {
  Sparkles,
  Zap,
  Heart,
  Activity,
  Clock,
  TrendingUp,
  Disc3,
  ExternalLink,
  LogOut,
  User,
  Radio,
  Flame,
  Music,
} from 'lucide-react';
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
    <div className="min-h-screen bg-[#070709] text-white pb-32 selection:bg-spotify-green selection:text-black">
      {/* Dynamic Background Glows */}
      <div className="fixed -top-40 left-1/4 w-[600px] h-[600px] bg-spotify-green/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed top-1/2 -right-40 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[180px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#070709]/80 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-spotify-green to-emerald-400 flex items-center justify-center shadow-md shadow-spotify-green/20">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div>
              <span className="font-syne font-black tracking-tight text-white text-lg block leading-none">
                SONIC <span className="text-spotify-green">MIRROR</span>
              </span>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                Studio Mode
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                {user.images?.[0]?.url ? (
                  <img
                    src={user.images[0].url}
                    alt={user.display_name}
                    className="w-7 h-7 rounded-full border border-spotify-green/60 object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-xs">
                    <User className="w-3.5 h-3.5 text-zinc-400" />
                  </div>
                )}
                <span className="text-xs font-bold font-grotesk hidden sm:inline text-zinc-200">
                  {user.display_name}
                </span>
              </div>
            )}
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs font-semibold text-zinc-400 hover:text-white transition-all border border-white/10"
              title="Log out of Spotify session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-10 space-y-16">
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
          <section id="poster-studio" className="border-t border-white/10 pt-12">
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

        {/* Section 3: Computed Audio Taste DNA Metrics */}
        {stats && (
          <section className="border-t border-white/10 pt-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-spotify-green uppercase tracking-widest mb-1">
                  <Radio className="w-3.5 h-3.5" />
                  <span>Algorithmic Telemetry</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white font-syne">
                  Computed Audio DNA
                </h3>
              </div>
              <span className="text-xs font-mono text-zinc-500 hidden sm:inline">
                Analyzed from top 20 tracks
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
              {/* Dominant Genre */}
              <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col justify-between hover:border-spotify-green/40 transition-all">
                <span className="text-xs font-mono text-zinc-500 uppercase">Top Category</span>
                <p className="text-lg font-black text-white mt-1 capitalize font-syne truncate" title={stats.dominantGenre}>
                  {stats.dominantGenre}
                </p>
                <div className="mt-3 text-[11px] font-mono text-spotify-green font-bold">#1 DOMINANT</div>
              </div>

              {/* Energy */}
              <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col justify-between hover:border-amber-400/40 transition-all">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-500 uppercase">
                  <span>Energy</span>
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <p className="text-3xl font-black text-white mt-1 font-syne">{stats.avgEnergy}%</p>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: `${stats.avgEnergy}%` }} />
                </div>
              </div>

              {/* Happiness / Valence */}
              <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col justify-between hover:border-rose-400/40 transition-all">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-500 uppercase">
                  <span>Mood (Valence)</span>
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                </div>
                <p className="text-3xl font-black text-white mt-1 font-syne">{stats.avgValence}%</p>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-rose-400 h-full rounded-full" style={{ width: `${stats.avgValence}%` }} />
                </div>
              </div>

              {/* Danceability */}
              <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col justify-between hover:border-emerald-400/40 transition-all">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-500 uppercase">
                  <span>Dance</span>
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <p className="text-3xl font-black text-white mt-1 font-syne">{stats.avgDanceability}%</p>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${stats.avgDanceability}%` }} />
                </div>
              </div>

              {/* Tempo */}
              <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col justify-between hover:border-purple-400/40 transition-all">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-500 uppercase">
                  <span>Pacing</span>
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <p className="text-3xl font-black text-white mt-1 font-syne">
                  {stats.avgTempo} <span className="text-xs font-mono text-zinc-500 font-normal">BPM</span>
                </p>
                <div className="mt-3 text-[11px] font-mono text-purple-400 font-bold">RHYTHM SPEED</div>
              </div>

              {/* Mainstream Rating */}
              <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col justify-between hover:border-sky-400/40 transition-all">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-500 uppercase">
                  <span>Basic Score</span>
                  <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
                </div>
                <p className="text-3xl font-black text-white mt-1 font-syne">{stats.avgPopularity}/100</p>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-sky-400 h-full rounded-full" style={{ width: `${stats.avgPopularity}%` }} />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Section 4: Top Tracks on Heavy Rotation */}
        <section className="border-t border-white/10 pt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-widest mb-1">
                <Flame className="w-3.5 h-3.5" />
                <span>Repeat Offenders</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white font-syne">
                Heavy Rotation Tracks ({tracks.length})
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {tracks.map((track, idx) => {
              const albumCover = track.album?.images?.[1]?.url || track.album?.images?.[0]?.url;
              return (
                <div
                  key={track.id || idx}
                  className="group flex items-center justify-between p-3.5 rounded-2xl glass-panel hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="text-xs font-mono font-bold text-zinc-500 w-5 text-right shrink-0">
                      {idx + 1}
                    </span>
                    {albumCover ? (
                      <img
                        src={albumCover}
                        alt={track.name}
                        className="w-12 h-12 rounded-xl object-cover shadow-md shrink-0 group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0">
                        <Disc3 className="w-6 h-6 text-zinc-600" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate group-hover:text-spotify-green transition-colors font-grotesk">
                        {track.name}
                      </p>
                      <p className="text-xs text-zinc-400 truncate font-sans">
                        {track.artists?.map((a) => a.name).join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 pl-3">
                    <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
                      {Math.floor((track.duration_ms || 0) / 60000)}:
                      {String(Math.floor(((track.duration_ms || 0) % 60000) / 1000)).padStart(2, '0')}
                    </span>

                    {track.external_urls?.spotify && (
                      <a
                        href={track.external_urls.spotify}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg bg-white/5 hover:bg-spotify-green hover:text-black text-zinc-400 transition-colors"
                        title="Listen on Spotify"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
