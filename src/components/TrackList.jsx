import React from 'react';
import {
  Music,
  User,
  LogOut,
  Sparkles,
  TrendingUp,
  Activity,
  Heart,
  Zap,
  Clock,
  Disc3,
  ExternalLink,
  CheckCircle2,
  Terminal,
  Info,
} from 'lucide-react';
import RoastCard from './RoastCard';

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
    <div className="min-h-screen bg-spotify-black text-white pb-24">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-spotify-black/80 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-spotify-green flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-black" />
            </div>
            <span className="font-extrabold tracking-tight text-white font-['Space_Grotesk'] text-lg">
              SONIC <span className="text-spotify-green">MIRROR</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-2.5">
                {user.images?.[0]?.url ? (
                  <img
                    src={user.images[0].url}
                    alt={user.display_name}
                    className="w-8 h-8 rounded-full border border-spotify-green object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-spotify-card flex items-center justify-center text-xs">
                    <User className="w-4 h-4 text-spotify-subtext" />
                  </div>
                )}
                <span className="text-sm font-semibold hidden sm:inline">{user.display_name}</span>
              </div>
            )}
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs font-medium text-spotify-subtext hover:text-white transition-all border border-white/10"
              title="Log out of Spotify"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-8">
        {/* Step 1-3 Checkpoint Success Banner */}
        <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-zinc-900 border border-spotify-green/40 shadow-lg shadow-spotify-green/5">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-spotify-green/20 text-spotify-green flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Steps 1–3 Connected & Verified!</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-spotify-green/20 text-spotify-green border border-spotify-green/30 uppercase tracking-wider font-bold">
                    Phase 1 Complete
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-spotify-subtext mt-1 leading-relaxed">
                  Successfully authenticated with Spotify OAuth and fetched {tracks.length} top tracks + {artists.length} top artists.
                  Computed aggregate audio and genre metrics below.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-zinc-300 shrink-0">
              <Terminal className="w-4 h-4 text-spotify-green" />
              <span>Logged to Console (F12)</span>
            </div>
          </div>
        </div>

        {/* Audio Fallback Notice if triggered */}
        {stats?.isAudioFallback && (
          <div className="mb-6 p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/30 flex items-center gap-3 text-xs text-blue-200">
            <Info className="w-4 h-4 text-blue-400 shrink-0" />
            <span>
              Spotify Nov 2024 Developer Policy: /audio-features endpoint restricted for new apps. Graceful fallback heuristics were automatically applied from artist genres and track popularity.
            </span>
          </div>
        )}

        {/* AI Roast Section (Phase 2) */}
        <section className="mb-10">
          <RoastCard
            roastData={roastData}
            isGenerating={isRoastGenerating}
            error={roastError}
            currentTone={currentTone}
            onRegenerate={onRegenerateRoast}
            onProceedToPoster={onProceedToPoster}
          />
        </section>

        {/* Aggregate Stats Section */}
        {stats && (
          <section className="mb-10">
            <h3 className="text-xs uppercase tracking-widest font-bold text-spotify-subtext mb-4">
              Computed Audio & Taste Metrics
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {/* Dominant Genre */}
              <div className="p-4 rounded-xl bg-spotify-dark border border-white/5 flex flex-col justify-between">
                <span className="text-xs text-spotify-subtext">Dominant Genre</span>
                <p className="text-lg font-bold text-white mt-1 capitalize truncate" title={stats.dominantGenre}>
                  {stats.dominantGenre}
                </p>
                <div className="mt-2 text-[11px] text-spotify-green font-medium">Top category</div>
              </div>

              {/* Energy */}
              <div className="p-4 rounded-xl bg-spotify-dark border border-white/5 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-spotify-subtext">
                  <span>Energy</span>
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <p className="text-2xl font-black text-white mt-1">{stats.avgEnergy}%</p>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: `${stats.avgEnergy}%` }} />
                </div>
              </div>

              {/* Valence (Happiness) */}
              <div className="p-4 rounded-xl bg-spotify-dark border border-white/5 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-spotify-subtext">
                  <span>Valence (Mood)</span>
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                </div>
                <p className="text-2xl font-black text-white mt-1">{stats.avgValence}%</p>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-rose-400 h-full rounded-full" style={{ width: `${stats.avgValence}%` }} />
                </div>
              </div>

              {/* Danceability */}
              <div className="p-4 rounded-xl bg-spotify-dark border border-white/5 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-spotify-subtext">
                  <span>Danceability</span>
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <p className="text-2xl font-black text-white mt-1">{stats.avgDanceability}%</p>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${stats.avgDanceability}%` }} />
                </div>
              </div>

              {/* Average Tempo */}
              <div className="p-4 rounded-xl bg-spotify-dark border border-white/5 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-spotify-subtext">
                  <span>Avg Tempo</span>
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <p className="text-2xl font-black text-white mt-1">{stats.avgTempo} <span className="text-xs font-normal text-spotify-subtext">BPM</span></p>
                <div className="mt-2 text-[11px] text-purple-400 font-medium">Pacing</div>
              </div>

              {/* Mainstream Rating */}
              <div className="p-4 rounded-xl bg-spotify-dark border border-white/5 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-spotify-subtext">
                  <span>Mainstream Score</span>
                  <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
                </div>
                <p className="text-2xl font-black text-white mt-1">{stats.avgPopularity}/100</p>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-sky-400 h-full rounded-full" style={{ width: `${stats.avgPopularity}%` }} />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Top Artists Pills */}
        {artists.length > 0 && (
          <section className="mb-10">
            <h3 className="text-xs uppercase tracking-widest font-bold text-spotify-subtext mb-3">
              Top Artists on Rotation
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {artists.slice(0, 10).map((artist, idx) => (
                <div
                  key={artist.id || idx}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-spotify-dark border border-white/10 hover:border-spotify-green/50 transition-colors"
                >
                  {artist.images?.[0]?.url && (
                    <img
                      src={artist.images[0].url}
                      alt={artist.name}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  )}
                  <span className="text-xs font-semibold text-white">{artist.name}</span>
                  {artist.genres?.[0] && (
                    <span className="text-[10px] text-spotify-subtext bg-white/5 px-2 py-0.5 rounded-full">
                      {artist.genres[0]}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Top Tracks List */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs uppercase tracking-widest font-bold text-spotify-subtext">
              Top Tracks (Medium Term) • {tracks.length} Songs Fetched
            </h3>
            <span className="text-xs text-spotify-subtext">Album art ready for poster collage</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tracks.map((track, idx) => {
              const albumCover = track.album?.images?.[1]?.url || track.album?.images?.[0]?.url;
              return (
                <div
                  key={track.id || idx}
                  className="group flex items-center justify-between p-3 rounded-xl bg-spotify-dark/70 hover:bg-spotify-card border border-white/5 hover:border-white/20 transition-all"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="text-xs font-bold text-spotify-subtext w-5 text-right shrink-0">
                      {idx + 1}
                    </span>
                    {albumCover ? (
                      <img
                        src={albumCover}
                        alt={track.name}
                        className="w-12 h-12 rounded-lg object-cover shadow-md shrink-0 group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0">
                        <Disc3 className="w-6 h-6 text-zinc-600" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate group-hover:text-spotify-green transition-colors">
                        {track.name}
                      </p>
                      <p className="text-xs text-spotify-subtext truncate">
                        {track.artists?.map((a) => a.name).join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 pl-3">
                    <div className="text-right hidden sm:block">
                      <span className="text-[10px] text-spotify-subtext block">{track.album?.name?.substring(0, 20)}</span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {Math.floor((track.duration_ms || 0) / 60000)}:
                        {String(Math.floor(((track.duration_ms || 0) % 60000) / 1000)).padStart(2, '0')}
                      </span>
                    </div>

                    {track.external_urls?.spotify && (
                      <a
                        href={track.external_urls.spotify}
                        target="_blank"
                        rel="noreferrer"
                        className="text-zinc-500 hover:text-white transition-colors p-1"
                        title="Open on Spotify"
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
