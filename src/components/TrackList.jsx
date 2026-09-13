import React from 'react';
import { LogOut, ExternalLink, Activity, Radio, BarChart3, Disc, Music } from 'lucide-react';
import RoastCard from './RoastCard';
import PosterCanvas from './PosterCanvas';
import ThreeVisualizer from './ThreeVisualizer';

export default function TrackList({
  user,
  tracks = [],
  artists = [],
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
    <div className="min-h-screen bg-zine-cream text-zine-black font-body selection:bg-zine-pink selection:text-white pb-32 relative">
      
      {/* 1. TOP NAVBAR */}
      <header className="sticky top-0 z-40 bg-white border-b-2 border-zine-black px-4 sm:px-8 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="border-2 border-zine-black p-0.5 bg-white shadow-brutal-sm">
              <div className="border border-zine-black px-2.5 py-0.5 bg-zine-lime text-zine-black font-headline text-lg tracking-wider">
                SONIC MIRROR
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 border border-zine-black px-2 py-0.5 font-mono text-[11px] bg-zinc-100">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span>ACTIVE BIOPSY RUN</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden md:flex items-center gap-2 border border-zine-black px-3 py-1 font-mono text-xs bg-white">
                <span className="text-zinc-400">PATIENT:</span>
                <span className="font-bold text-black uppercase">{user.display_name}</span>
              </div>
            )}
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-zine-black bg-white hover:bg-zinc-100 font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5"
            >
              <LogOut className="w-3.5 h-3.5 text-red-500" />
              <span>DISCONNECT</span>
            </button>
          </div>

        </div>
      </header>

      {/* 2. MAIN EVALUATION SPREAD */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: 3D SCOPE & TELEMETRY GAUGES & TRACK BIOPSY */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            
            {/* Scope 01: Three.js Real-Time Psychoacoustic Resonator */}
            <div className="border-3 border-zine-black bg-white p-4 sm:p-5 shadow-brutal">
              
              <div className="flex items-center justify-between border-b-2 border-zine-black pb-3 mb-3">
                <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider">
                  <Activity className="w-4 h-4 text-zine-pink" />
                  <span>SCOPE 01: REAL-TIME PSYCHOACOUSTIC RESONATOR</span>
                </div>
                <span className="font-mono text-[10px] bg-red-600 text-white px-1.5 py-0.5 uppercase">
                  LIVE
                </span>
              </div>

              {/* 3D Waveform Container */}
              <div className="w-full h-64 bg-zinc-950 border-2 border-zine-black relative overflow-hidden shadow-inner">
                {/* Embedded Three.js Resonator Wave Terrain */}
                <ThreeVisualizer mode="resonator" stats={stats} className="w-full h-full" />

                {/* Scope Telemetry Overlay */}
                <div className="absolute top-2 left-3 font-mono text-[10px] text-zine-lime bg-black/70 px-2 py-0.5 border border-zine-lime/40">
                  FREQ: {((stats?.avgTempo || 120) * 18.2).toFixed(1)}Hz // 3D TERRAIN
                </div>
                <div className="absolute top-2 right-3 font-mono text-[10px] text-zine-pink bg-black/70 px-2 py-0.5 border border-zine-pink/40">
                  ENERGY: {stats?.avgEnergy}%
                </div>
                <div className="absolute bottom-2 left-3 font-mono text-[10px] text-zine-cyan bg-black/70 px-2 py-0.5 border border-zine-cyan/40">
                  CH: STEREO PHASE MATRIX
                </div>
                <div className="absolute bottom-2 right-3 font-mono text-[10px] text-white/70 bg-black/70 px-2 py-0.5 border border-white/30">
                  VALENCE: {stats?.avgValence}%
                </div>
              </div>

              <div className="mt-3 font-mono text-[11px] text-zinc-600 flex justify-between">
                <span>INTERACTIVE THREE.JS WAVEFORM</span>
                <span>DRIVEN BY YOUR AUDIO METRICS</span>
              </div>
            </div>

            {/* Vital Signs & Psychoacoustic Telemetry Gauges */}
            {stats && (
              <div className="border-3 border-zine-black bg-white p-5 shadow-brutal">
                <div className="flex items-center justify-between border-b-2 border-zine-black pb-2 mb-4 font-mono text-xs font-bold uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-zine-lime" />
                    <span>VITAL SIGNS & PSYCHOLOGICAL METRICS</span>
                  </div>
                  <span className="text-zinc-400">TELEMETRY</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  
                  {/* Gauge 1: Valence */}
                  <div className="border-2 border-zinc-300 p-3 bg-zinc-50">
                    <div className="flex justify-between items-end mb-1">
                      <span className="font-mono text-[11px] font-bold text-zinc-600 uppercase">VALENCE</span>
                      <span className="font-headline text-2xl text-black leading-none">{stats.avgValence}%</span>
                    </div>
                    <div className="w-full h-3 bg-zinc-200 border border-black overflow-hidden flex">
                      <div
                        className="h-full bg-zine-cyan border-r border-black transition-all duration-700"
                        style={{ width: `${stats.avgValence}%` }}
                      ></div>
                    </div>
                    <div className="font-mono text-[9px] text-zinc-500 uppercase mt-1">
                      {stats.avgValence < 40 ? 'CRITICAL MELANCHOLIA' : 'ELEVATED EUPHORIA'}
                    </div>
                  </div>

                  {/* Gauge 2: Energy */}
                  <div className="border-2 border-zinc-300 p-3 bg-zinc-50">
                    <div className="flex justify-between items-end mb-1">
                      <span className="font-mono text-[11px] font-bold text-zinc-600 uppercase">ENERGY</span>
                      <span className="font-headline text-2xl text-black leading-none">{stats.avgEnergy}%</span>
                    </div>
                    <div className="w-full h-3 bg-zinc-200 border border-black overflow-hidden flex">
                      <div
                        className="h-full bg-zine-lime border-r border-black transition-all duration-700"
                        style={{ width: `${stats.avgEnergy}%` }}
                      ></div>
                    </div>
                    <div className="font-mono text-[9px] text-zinc-500 uppercase mt-1">
                      {stats.avgEnergy > 70 ? 'MANIC OVERDRIVE' : 'LOW AROUSAL FATIGUE'}
                    </div>
                  </div>

                  {/* Gauge 3: Tempo */}
                  <div className="border-2 border-zinc-300 p-3 bg-zinc-50">
                    <div className="flex justify-between items-end mb-1">
                      <span className="font-mono text-[11px] font-bold text-zinc-600 uppercase">TEMPO (BPM)</span>
                      <span className="font-headline text-2xl text-black leading-none">{stats.avgTempo}</span>
                    </div>
                    <div className="w-full h-3 bg-zinc-200 border border-black overflow-hidden flex">
                      <div
                        className="h-full bg-amber-400 border-r border-black transition-all duration-700"
                        style={{ width: `${Math.min(100, (stats.avgTempo / 180) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="font-mono text-[9px] text-zinc-500 uppercase mt-1">
                      HEART RATE EQUIVALENT
                    </div>
                  </div>

                  {/* Gauge 4: Dissonance / Dissociation */}
                  <div className="border-2 border-zinc-300 p-3 bg-zinc-50">
                    <div className="flex justify-between items-end mb-1">
                      <span className="font-mono text-[11px] font-bold text-zinc-600 uppercase">DISSONANCE</span>
                      <span className="font-headline text-2xl text-zine-pink leading-none">
                        {Math.max(10, 100 - stats.avgValence)}%
                      </span>
                    </div>
                    <div className="w-full h-3 bg-zinc-200 border border-black overflow-hidden flex">
                      <div
                        className="h-full bg-zine-pink border-r border-black transition-all duration-700"
                        style={{ width: `${Math.max(10, 100 - stats.avgValence)}%` }}
                      ></div>
                    </div>
                    <div className="font-mono text-[9px] text-zinc-500 uppercase mt-1">
                      EMOTIONAL CONFLICT INDEX
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Stream Input: Detected (Top Tracks Specimen List) */}
            <div className="border-3 border-zine-black bg-white p-5 shadow-brutal">
              <div className="flex items-center justify-between border-b-2 border-zine-black pb-3 mb-3">
                <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider">
                  <Radio className="w-4 h-4 text-black" />
                  <span>STREAM INPUT: DETECTED ROTATION</span>
                </div>
                <span className="font-mono text-[11px] text-zinc-500 uppercase">
                  {tracks.length} SPECIMENS
                </span>
              </div>

              <div className="flex flex-col divide-y divide-zinc-200 max-h-[420px] overflow-y-auto pr-1">
                {tracks.map((track, idx) => {
                  const albumCover = track.album?.images?.[2]?.url || track.album?.images?.[1]?.url;
                  return (
                    <div
                      key={track.id || idx}
                      className="group flex items-center justify-between py-2.5 hover:bg-zinc-50 px-2 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-mono text-xs font-bold text-zinc-400 w-5 shrink-0">
                          {(idx + 1).toString().padStart(2, '0')}
                        </span>

                        {albumCover && (
                          <img
                            src={albumCover}
                            alt={track.name}
                            className="w-9 h-9 object-cover border border-black shrink-0"
                          />
                        )}

                        <div className="min-w-0 pr-2">
                          <p className="font-bold text-xs sm:text-sm text-black truncate leading-tight">
                            {track.name}
                          </p>
                          <p className="font-mono text-[10px] text-zinc-500 truncate uppercase">
                            {track.artists?.map((a) => a.name).join(', ')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-mono text-[10px] bg-zinc-100 border border-zinc-300 px-1.5 py-0.5 text-zinc-600 hidden sm:inline">
                          {(idx % 3 === 0 ? 'ACUTE NOSTALGIA' : idx % 2 === 0 ? 'SPIRALING' : 'HEAVY COPING')}
                        </span>
                        {track.external_urls?.spotify && (
                          <a
                            href={track.external_urls.spotify}
                            target="_blank"
                            rel="noreferrer"
                            className="text-zinc-400 hover:text-black transition-colors"
                            title="Open in Spotify"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: BIOPSY PIPELINE & CLINICAL ROAST */}
          <div className="lg:col-span-6">
            <RoastCard
              roastData={roastData}
              isGenerating={isRoastGenerating}
              error={roastError}
              currentTone={currentTone}
              onRegenerate={onRegenerateRoast}
              onProceedToPoster={onProceedToPoster}
            />
          </div>

        </div>

        {/* SECTION 3: RISOGRAPH POSTER STUDIO */}
        {roastData && (
          <section id="poster-section" className="mt-16 pt-12 border-t-4 border-zine-black">
            <div className="mb-8">
              <div className="border border-zine-black bg-white px-2.5 py-0.5 font-mono text-xs font-bold uppercase tracking-wider inline-block mb-2 shadow-brutal-sm">
                FINAL OUTPUT // STAGE 3
              </div>
              <h2 className="font-headline text-4xl sm:text-5xl uppercase tracking-tight text-zine-black">
                DIAGNOSTIC POSTER CUSTOMIZATION & EXPORT
              </h2>
            </div>

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

      </main>

    </div>
  );
}
