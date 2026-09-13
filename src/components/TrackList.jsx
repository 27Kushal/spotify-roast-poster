import React from 'react';
import { LogOut, ExternalLink, Activity, Radio, BarChart3, Disc, Music, Sparkles } from 'lucide-react';
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
  const pathologyTags = [
    { text: 'ACUTE NOSTALGIA', color: 'bg-[#FF6D00] text-white border-black' },
    { text: '3AM SPIRALING', color: 'bg-[#FF007F] text-white border-black' },
    { text: 'HEAVY COPING', color: 'bg-[#00F0FF] text-black border-black' },
    { text: 'DISSOCIATION', color: 'bg-[#5A189A] text-white border-black' },
    { text: 'MAIN CHARACTER', color: 'bg-[#CCFF00] text-black border-black' },
    { text: 'INDIE HYPOCRISY', color: 'bg-amber-300 text-black border-black' },
  ];

  return (
    <div className="min-h-screen bg-[#0047FF] text-white font-body selection:bg-[#FF007F] selection:text-white pb-32 relative">
      
      {/* 1. TOP NAVBAR (Midnight Dark with Lime Border) */}
      <header className="sticky top-0 z-40 bg-[#0F172A] border-b-4 border-[#CCFF00] px-4 sm:px-8 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="border-2 border-black p-0.5 bg-[#FF007F] shadow-[3px_3px_0px_#000]">
              <div className="border border-black px-3 py-1 bg-[#CCFF00] text-[#0F172A] font-headline text-lg sm:text-xl tracking-wider leading-none">
                SONIC MIRROR 🪞
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 border-2 border-black px-2.5 py-1 font-mono text-[11px] bg-[#5A189A] text-white font-bold shadow-[3px_3px_0px_#000]">
              <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-ping"></span>
              <span>ACTIVE BIOPSY RUN</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden md:flex items-center gap-2 border-2 border-black px-3 py-1 font-mono text-xs bg-[#0F172A] text-white shadow-[2px_2px_0px_#000]">
                <span className="text-zinc-400 font-bold">PATIENT:</span>
                <span className="font-headline text-sm uppercase text-[#CCFF00]">{user.display_name}</span>
              </div>
            )}
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 border-2 border-black bg-white hover:bg-[#FF007F] hover:text-white text-black font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[3px_3px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5"
            >
              <LogOut className="w-3.5 h-3.5 text-red-500" />
              <span>DISCONNECT</span>
            </button>
          </div>

        </div>
      </header>

      {/* 2. MAIN EVALUATION SPREAD */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: 3D SCOPE & COLORFUL TELEMETRY GAUGES & TRACK BIOPSY */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            
            {/* Scope 01: Three.js Real-Time Psychoacoustic Resonator */}
            <div className="border-4 border-black bg-white text-black p-5 shadow-[8px_8px_0px_#000]">
              
              <div className="flex items-center justify-between border-b-3 border-black pb-3 mb-3">
                <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider">
                  <Activity className="w-4 h-4 text-[#FF007F]" />
                  <span>SCOPE 01: REAL-TIME 3D AUDIO RESONATOR</span>
                </div>
                <div className="flex items-center gap-1 bg-red-600 border border-black text-white font-mono text-[10px] font-bold px-2 py-0.5 uppercase shadow-[2px_2px_0px_#000]">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                  <span>LIVE</span>
                </div>
              </div>

              {/* 3D Multi-Chromatic Waveform Container */}
              <div className="w-full h-64 bg-zinc-950 border-3 border-black relative overflow-hidden shadow-inner">
                {/* Embedded Three.js Resonator Wave Terrain */}
                <ThreeVisualizer mode="resonator" stats={stats} className="w-full h-full" />

                {/* Scope Telemetry Overlay with Fun Color Tags */}
                <div className="absolute top-2 left-3 font-mono text-[10px] font-bold text-black bg-[#CCFF00] px-2 py-0.5 border border-black shadow-[2px_2px_0px_#000]">
                  FREQ: {((stats?.avgTempo || 120) * 18.2).toFixed(1)}Hz // 3D TERRAIN
                </div>
                <div className="absolute top-2 right-3 font-mono text-[10px] font-bold text-white bg-[#FF007F] px-2 py-0.5 border border-black shadow-[2px_2px_0px_#000]">
                  ENERGY: {stats?.avgEnergy}%
                </div>
                <div className="absolute bottom-2 left-3 font-mono text-[10px] font-bold text-black bg-[#00F0FF] px-2 py-0.5 border border-black shadow-[2px_2px_0px_#000]">
                  CH: STEREO PHASE MATRIX
                </div>
                <div className="absolute bottom-2 right-3 font-mono text-[10px] font-bold text-black bg-[#CCFF00] px-2 py-0.5 border border-black shadow-[2px_2px_0px_#000]">
                  VALENCE: {stats?.avgValence}%
                </div>
              </div>

              <div className="mt-3 font-mono text-[11px] text-zinc-800 font-bold flex justify-between">
                <span className="flex items-center gap-1 text-[#5A189A]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>INTERACTIVE THREE.JS 3D TERRAIN</span>
                </span>
                <span className="text-zinc-600">LIVE AUDIO FEATURE SYNTHESIS</span>
              </div>
            </div>

            {/* Vital Signs & Psychoacoustic Telemetry (Deep Royal Purple Section - Exactly like the Poster!) */}
            {stats && (
              <div className="border-4 border-black bg-[#5A189A] text-white p-5 sm:p-6 shadow-[8px_8px_0px_#000]">
                <div className="flex items-center justify-between border-b-3 border-black pb-2 mb-4 font-mono text-xs font-bold uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-[#CCFF00]" />
                    <span>VITAL SIGNS & ACOUSTIC TELEMETRY</span>
                  </div>
                  <span className="bg-[#CCFF00] border-2 border-black text-black text-[10px] font-bold px-2 py-0.5 shadow-[2px_2px_0px_#000]">
                    LAB DNA
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  
                  {/* Gauge 1: Valence (Cyber Cyan) */}
                  <div className="border-3 border-black p-3.5 bg-[#00F0FF] text-black shadow-[3px_3px_0px_#000] hover:-translate-y-0.5 transition-transform">
                    <div className="flex justify-between items-end mb-1">
                      <span className="font-mono text-[11px] font-bold uppercase">VALENCE</span>
                      <span className="font-headline text-3xl leading-none">{stats.avgValence}%</span>
                    </div>
                    <div className="w-full h-3.5 bg-white border-2 border-black overflow-hidden flex">
                      <div
                        className="h-full bg-black transition-all duration-700"
                        style={{ width: `${stats.avgValence}%` }}
                      ></div>
                    </div>
                    <div className="font-mono text-[10px] font-bold uppercase mt-1.5 text-zinc-900">
                      {stats.avgValence < 40 ? 'CRITICAL MELANCHOLIA' : 'ELEVATED EUPHORIA'}
                    </div>
                  </div>

                  {/* Gauge 2: Energy (Acid Lime) */}
                  <div className="border-3 border-black p-3.5 bg-[#CCFF00] text-black shadow-[3px_3px_0px_#000] hover:-translate-y-0.5 transition-transform">
                    <div className="flex justify-between items-end mb-1">
                      <span className="font-mono text-[11px] font-bold uppercase">ENERGY LEVEL</span>
                      <span className="font-headline text-3xl leading-none">{stats.avgEnergy}%</span>
                    </div>
                    <div className="w-full h-3.5 bg-white border-2 border-black overflow-hidden flex">
                      <div
                        className="h-full bg-black transition-all duration-700"
                        style={{ width: `${stats.avgEnergy}%` }}
                      ></div>
                    </div>
                    <div className="font-mono text-[10px] font-bold uppercase mt-1.5 text-zinc-900">
                      {stats.avgEnergy > 70 ? 'MANIC OVERDRIVE' : 'LOW AROUSAL FATIGUE'}
                    </div>
                  </div>

                  {/* Gauge 3: Tempo (Solar Orange) */}
                  <div className="border-3 border-black p-3.5 bg-[#FF6D00] text-white shadow-[3px_3px_0px_#000] hover:-translate-y-0.5 transition-transform">
                    <div className="flex justify-between items-end mb-1">
                      <span className="font-mono text-[11px] font-bold uppercase">TEMPO (BPM)</span>
                      <span className="font-headline text-3xl leading-none">{stats.avgTempo}</span>
                    </div>
                    <div className="w-full h-3.5 bg-white border-2 border-black overflow-hidden flex">
                      <div
                        className="h-full bg-black transition-all duration-700"
                        style={{ width: `${Math.min(100, (stats.avgTempo / 180) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="font-mono text-[10px] font-bold uppercase mt-1.5 text-white/95">
                      HEART RATE EQUIVALENT
                    </div>
                  </div>

                  {/* Gauge 4: Dissonance (Hot Magenta Pink) */}
                  <div className="border-3 border-black p-3.5 bg-[#FF007F] text-white shadow-[3px_3px_0px_#000] hover:-translate-y-0.5 transition-transform">
                    <div className="flex justify-between items-end mb-1">
                      <span className="font-mono text-[11px] font-bold uppercase">DISSONANCE</span>
                      <span className="font-headline text-3xl leading-none">
                        {Math.max(10, 100 - stats.avgValence)}%
                      </span>
                    </div>
                    <div className="w-full h-3.5 bg-white border-2 border-black overflow-hidden flex">
                      <div
                        className="h-full bg-[#CCFF00] transition-all duration-700"
                        style={{ width: `${Math.max(10, 100 - stats.avgValence)}%` }}
                      ></div>
                    </div>
                    <div className="font-mono text-[10px] font-bold uppercase mt-1.5 text-white/95">
                      CONFLICT INDEX
                    </div>
                  </div>

                </div>

                {/* Genre & Mainstream Ribbon in Lime & Orange */}
                <div className="mt-4 pt-3 border-t-2 border-dashed border-white/30 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="font-bold text-white/80 uppercase">DOMINANT GENRE:</span>
                    <span className="bg-[#CCFF00] border-2 border-black text-black px-2.5 py-0.5 font-headline text-sm uppercase shadow-[2px_2px_0px_#000]">
                      {stats.dominantGenre || 'Indie / Alt'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="font-bold text-white/80 uppercase">MAINSTREAM SCORE:</span>
                    <span className="bg-[#FF6D00] text-white border-2 border-black px-2.5 py-0.5 font-headline text-sm uppercase shadow-[2px_2px_0px_#000]">
                      {stats.avgPopularity}%
                    </span>
                  </div>
                </div>

              </div>
            )}

            {/* Stream Input: Detected (Top Tracks Specimen List on White Card) */}
            <div className="border-4 border-black bg-white text-black p-5 shadow-[8px_8px_0px_#000]">
              <div className="flex items-center justify-between border-b-3 border-black pb-3 mb-3">
                <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider">
                  <Radio className="w-4 h-4 text-black" />
                  <span>STREAM INPUT: DETECTED ROTATION</span>
                </div>
                <span className="font-mono text-xs bg-[#CCFF00] border border-black px-2 py-0.5 font-bold uppercase">
                  {tracks.length} SPECIMENS
                </span>
              </div>

              <div className="flex flex-col divide-y-2 divide-zinc-200 max-h-[440px] overflow-y-auto pr-1">
                {tracks.map((track, idx) => {
                  const albumCover = track.album?.images?.[2]?.url || track.album?.images?.[1]?.url;
                  const tag = pathologyTags[idx % pathologyTags.length];

                  return (
                    <div
                      key={track.id || idx}
                      className="group flex items-center justify-between py-2.5 hover:bg-[#CCFF00]/20 px-2 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-mono text-xs font-bold text-zinc-400 w-6 shrink-0 group-hover:text-black">
                          {(idx + 1).toString().padStart(2, '0')}
                        </span>

                        {albumCover && (
                          <img
                            src={albumCover}
                            alt={track.name}
                            className="w-10 h-10 object-cover border-2 border-black shrink-0 shadow-[2px_2px_0px_#000]"
                          />
                        )}

                        <div className="min-w-0 pr-2">
                          <p className="font-headline text-sm text-black truncate leading-tight tracking-wide">
                            {track.name}
                          </p>
                          <p className="font-mono text-[10px] text-zinc-600 truncate uppercase font-medium">
                            {track.artists?.map((a) => a.name).join(', ')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`font-mono text-[10px] font-bold border-2 px-2 py-0.5 shadow-[2px_2px_0px_#000] hidden sm:inline ${tag.color}`}>
                          {tag.text}
                        </span>
                        {track.external_urls?.spotify && (
                          <a
                            href={track.external_urls.spotify}
                            target="_blank"
                            rel="noreferrer"
                            className="border-2 border-black p-1 bg-white hover:bg-[#CCFF00] text-black transition-colors shadow-[2px_2px_0px_#000]"
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

        {/* SECTION 3: RISOGRAPH POSTER STUDIO (Full-Bleed Deep Royal Purple Section) */}
        {roastData && (
          <section id="poster-section" className="mt-16 pt-12 border-t-6 border-black">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="border-3 border-black bg-[#FF007F] text-white px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider inline-block mb-2 shadow-[4px_4px_0px_#000]">
                  FINAL OUTPUT // STAGE 3
                </div>
                <h2 className="font-headline text-4xl sm:text-5xl uppercase tracking-tight text-white drop-shadow">
                  DIAGNOSTIC POSTER CUSTOMIZATION & EXPORT
                </h2>
              </div>
              <span className="font-mono text-xs bg-[#CCFF00] border-2 border-black px-3 py-1 text-black font-bold uppercase shadow-[4px_4px_0px_#000]">
                1080x1920 (9:16 STORY)
              </span>
            </div>

            <div className="border-4 border-black bg-white p-6 sm:p-8 shadow-[8px_8px_0px_#000] text-black">
              <PosterCanvas
                user={user}
                tracks={tracks}
                stats={stats}
                roastData={roastData}
                currentTone={currentTone}
                onRegenerateRoast={onRegenerateRoast}
                isRegenerating={isRoastGenerating}
              />
            </div>
          </section>
        )}

      </main>

    </div>
  );
}
