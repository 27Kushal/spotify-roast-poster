import React from 'react';
import { ArrowRight, AlertCircle, Sparkles, Activity, ShieldAlert, Disc3, Zap, Flame } from 'lucide-react';
import ThreeVisualizer from './ThreeVisualizer';

export default function LandingPage({ loginUrl, authConfig, onTryDemo }) {
  const isConfigured = authConfig?.isConfigured;

  return (
    <div className="min-h-screen bg-[#0047FF] text-white font-body selection:bg-[#FF007F] selection:text-white flex flex-col justify-between relative overflow-x-hidden">
      
      {/* 1. TOP HEADER / APP BAR (Midnight Dark with Neon Lime Border) */}
      <header className="w-full bg-[#0F172A] border-b-4 border-[#CCFF00] px-4 sm:px-8 py-3 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo badge with layered poster colors */}
          <div className="flex items-center gap-3">
            <div className="border-2 border-black p-0.5 bg-[#FF007F] shadow-[3px_3px_0px_#000]">
              <div className="border border-black px-3 py-1 bg-[#CCFF00] text-[#0F172A] font-headline text-lg sm:text-xl tracking-wider leading-none">
                SONIC MIRROR 🪞
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 border-2 border-black px-2.5 py-1 text-[11px] font-mono bg-[#5A189A] text-white shadow-[3px_3px_0px_#000] -rotate-1">
              <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-ping"></span>
              <span>LAB-04 // AUDIO DNA AUTOPSY</span>
            </div>
          </div>

          {/* Center System Status Ticker */}
          <div className="hidden lg:flex items-center gap-3 text-xs font-mono font-bold text-white">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#CCFF00] border border-black animate-pulse"></span>
            <span className="bg-[#0047FF] text-white px-2 py-0.5 border border-black shadow-[2px_2px_0px_#000]">SYSTEM: ONLINE</span>
            <span className="text-zinc-500">|</span>
            <span className="bg-[#FF6D00] text-white px-2 py-0.5 border border-black shadow-[2px_2px_0px_#000]">CASE: #SM-8492</span>
            <span className="text-zinc-500">|</span>
            <span className="bg-[#5A189A] text-white px-2 py-0.5 border border-black shadow-[2px_2px_0px_#000]">DEPT OF PATHOLOGY</span>
          </div>

          {/* Right Action */}
          <div className="flex items-center gap-3">
            {onTryDemo && (
              <button
                type="button"
                onClick={onTryDemo}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 border-2 border-black bg-[#FFE600] text-black font-headline text-xs uppercase tracking-wider shadow-[3px_3px_0px_#000] hover:bg-[#CCFF00] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>TRY DEMO</span>
              </button>
            )}
            <a
              href={isConfigured ? loginUrl : '#'}
              onClick={(e) => {
                if (!isConfigured) {
                  e.preventDefault();
                  alert('Please configure your SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in the .env file!');
                }
              }}
              className={`inline-flex items-center gap-2 px-5 py-2 border-3 border-black font-headline text-sm uppercase tracking-wider transition-all shadow-[4px_4px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none ${
                isConfigured
                  ? 'bg-[#CCFF00] text-black hover:bg-[#FF007F] hover:text-white'
                  : 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
              }`}
            >
              <span>CONNECT SPOTIFY</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION (Electric Blue #0047FF Canvas) */}
      <section className="relative w-full bg-[#0047FF] border-b-6 border-black py-12 lg:py-20">
        
        {/* Floating Playful Y2K Stickers */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative">
          <div className="absolute top-0 right-1/3 hidden md:flex items-center gap-1.5 bg-[#CCFF00] text-black border-3 border-black font-headline text-sm px-3 py-1 rotate-6 shadow-[4px_4px_0px_#000] z-20 select-none">
            <Zap className="w-4 h-4 text-black" />
            <span>★ 100% UNFILTERED AUTOPSY ★</span>
          </div>
          <div className="absolute -top-6 left-12 hidden lg:flex items-center gap-1 bg-[#5A189A] text-white border-3 border-black font-mono text-xs font-bold px-2.5 py-1 -rotate-3 shadow-[4px_4px_0px_#000] z-20 select-none">
            <span>NO SKIP DETECTED</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Big Copy & Intake Form Action */}
            <div className="lg:col-span-7 flex flex-col">
              
              {/* Tag Badge */}
              <div className="flex items-center gap-2 mb-6">
                <div className="inline-flex items-center gap-2 border-3 border-black px-3 py-1 bg-[#CCFF00] text-black font-mono text-xs font-bold uppercase tracking-wider shadow-[4px_4px_0px_#000]">
                  <Activity className="w-3.5 h-3.5 text-black" />
                  <span>INTAKE SPECIMEN FORM // V.2.06</span>
                </div>
                <div className="border-3 border-black px-2.5 py-1 bg-[#FF6D00] text-white font-headline text-xs uppercase tracking-wider shadow-[4px_4px_0px_#000] rotate-2">
                  WRAPPED 24/7 EDITION
                </div>
              </div>

              {/* Massive Highlighter Headline */}
              <h1 className="font-headline text-5xl sm:text-6xl md:text-7xl lg:text-[80px] leading-[0.9] tracking-tight uppercase text-white mb-6 drop-shadow-md">
                WE ANALYZE YOUR SPOTIFY DATA. OUR{' '}
                <span className="bg-[#FF007F] text-white px-3.5 py-1 inline-block border-4 border-black shadow-[6px_6px_0px_#000] -rotate-1">
                  AI PSYCHIATRIST
                </span>{' '}
                <span className="bg-[#CCFF00] text-black px-3.5 py-1 inline-block border-4 border-black shadow-[6px_6px_0px_#000] rotate-1">
                  ROASTS YOUR TASTE.
                </span>
              </h1>

              {/* Subtext */}
              <p className="text-lg sm:text-xl text-white font-body font-medium leading-relaxed max-w-xl mb-8 drop-shadow-sm">
                Connect your Spotify account for a merciless psychoacoustic evaluation of your listening neuroses.
                We calculate valence-to-validity, catalog escalated 3AM spiraling, isolate acoustic hypocrisies, and spit out an official Risograph autopsy poster formatted for Instagram Stories.
              </p>

              {/* Missing Credentials Alert if applicable */}
              {!isConfigured && (
                <div className="mb-8 p-4 bg-amber-300 border-3 border-black text-black flex items-start gap-3 shadow-[4px_4px_0px_#000]">
                  <AlertCircle className="w-6 h-6 text-black shrink-0 mt-0.5" />
                  <div className="text-sm font-mono font-bold">
                    <p className="uppercase">Spotify Credentials Missing</p>
                    <p className="text-xs mt-1 font-normal">
                      Set <code className="bg-black text-white px-1 py-0.5">VITE_SPOTIFY_CLIENT_ID</code> and{' '}
                      <code className="bg-black text-white px-1 py-0.5">VITE_SPOTIFY_CLIENT_SECRET</code> in your <code>.env</code> file.
                    </p>
                  </div>
                </div>
              )}

              {/* Main Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 mb-10">
                <a
                  href={isConfigured ? loginUrl : '#'}
                  onClick={(e) => {
                    if (!isConfigured) {
                      e.preventDefault();
                      alert('Please configure your Spotify API keys in .env!');
                    }
                  }}
                  className={`inline-flex items-center gap-3 px-8 py-4.5 border-4 border-black font-headline text-xl sm:text-2xl uppercase tracking-wider transition-all shadow-[6px_6px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none ${
                    isConfigured
                      ? 'bg-[#CCFF00] text-black hover:bg-[#FF007F] hover:text-white'
                      : 'bg-zinc-500 text-zinc-300 cursor-not-allowed'
                  }`}
                >
                  <span>CONNECT SPOTIFY TO COMMENCE EVALUATION</span>
                  <ArrowRight className="w-6 h-6" />
                </a>

                <a
                  href="#methodology"
                  className="inline-flex items-center gap-2 px-5 py-4.5 border-3 border-black bg-[#FF007F] font-headline text-sm font-bold uppercase tracking-wider text-white hover:bg-[#CCFF00] hover:text-black transition-all shadow-[4px_4px_0px_#000]"
                >
                  <span>HOW IT WORKS ↓</span>
                </a>

                {onTryDemo && (
                  <button
                    type="button"
                    onClick={onTryDemo}
                    className="inline-flex items-center gap-2 px-6 py-4.5 border-3 border-black bg-[#FFE600] font-headline text-sm font-bold uppercase tracking-wider text-black hover:bg-[#CCFF00] transition-all shadow-[4px_4px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5"
                  >
                    <Sparkles className="w-4 h-4 text-black" />
                    <span>TRY DEMO (NO LOGIN) ★</span>
                  </button>
                )}
              </div>

              {/* 3 Bold Multi-Color Metric Preview Boxes (Directly from Poster Palette) */}
              <div className="grid grid-cols-3 gap-3.5 max-w-lg border-t-3 border-dashed border-white/50 pt-6">
                
                {/* Box 1: Solar Orange */}
                <div className="border-3 border-black bg-[#FF6D00] text-white p-3.5 shadow-[4px_4px_0px_#000] hover:-translate-y-1 transition-transform">
                  <div className="font-headline text-3xl sm:text-4xl leading-none">94.8%</div>
                  <div className="font-mono text-[10px] uppercase font-bold text-white/95 mt-1">EMOTIONAL AVOIDANCE</div>
                </div>

                {/* Box 2: Acid Lime */}
                <div className="border-3 border-black bg-[#CCFF00] text-black p-3.5 shadow-[4px_4px_0px_#000] hover:-translate-y-1 transition-transform">
                  <div className="font-headline text-3xl sm:text-4xl leading-none">0.82</div>
                  <div className="font-mono text-[10px] uppercase font-bold text-black/95 mt-1">VALIDITY INDEX</div>
                </div>

                {/* Box 3: Hot Magenta */}
                <div className="border-3 border-black bg-[#FF007F] text-white p-3.5 shadow-[4px_4px_0px_#000] hover:-translate-y-1 transition-transform">
                  <div className="font-headline text-3xl sm:text-4xl leading-none">12.1%</div>
                  <div className="font-mono text-[10px] uppercase font-bold text-white/95 mt-1">TASTE PURITY</div>
                </div>

              </div>

            </div>

            {/* Right Column: 3D Holographic Visualizer + Clinical Specimen Card */}
            <div className="lg:col-span-5 relative">
              
              {/* Specimen Case Document Card */}
              <div className="border-4 border-black bg-white text-black shadow-[8px_8px_0px_#000] p-5 relative z-10">
                
                {/* Card Header */}
                <div className="flex justify-between items-center border-b-3 border-black pb-3 mb-4">
                  <div>
                    <div className="font-headline text-xl uppercase tracking-wider text-black flex items-center gap-2">
                      <span>SONIC MIRROR</span>
                      <span className="bg-[#CCFF00] border border-black text-black text-[10px] px-1.5 py-0.5 font-mono font-bold">LAB-04</span>
                    </div>
                    <div className="font-mono text-[11px] text-zinc-600 font-bold">
                      INTAKE NO. 9214-B // SPECIMEN AUTOPSY
                    </div>
                  </div>
                  <div className="font-mono text-xs tracking-widest bg-[#5A189A] text-white px-2.5 py-1 border-2 border-black font-bold shadow-[2px_2px_0px_#000]">
                    SPECIMEN
                  </div>
                </div>

                {/* Center 3D Interactive Cassette Visualizer */}
                <div className="w-full h-64 bg-zinc-950 border-3 border-black relative overflow-hidden mb-4 shadow-inner">
                  {/* Embedded Three.js 3D Model */}
                  <ThreeVisualizer mode="hero" className="w-full h-full" />
                  
                  {/* 3D Hologram Colorful Overlay HUD */}
                  <div className="absolute top-2 left-3 font-mono text-[10px] font-bold text-black bg-[#CCFF00] px-2 py-0.5 border border-black shadow-[2px_2px_0px_#000] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping"></span>
                    <span>3D HOLO-CORE // GYRO REELS</span>
                  </div>
                  <div className="absolute bottom-2 right-3 font-mono text-[10px] font-bold text-white bg-[#FF007F] px-2 py-0.5 border border-black shadow-[2px_2px_0px_#000]">
                    120 BPM TAPE ROTATION
                  </div>
                </div>

                {/* Diagnosis Tag Box in Hot Magenta */}
                <div className="border-3 border-black bg-[#FF007F] text-white p-3.5 mb-4 shadow-[4px_4px_0px_#000] relative">
                  <div className="font-mono text-[10px] uppercase font-bold tracking-widest text-white/90 mb-1 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-[#CCFF00]" />
                    <span>PRELIMINARY DIAGNOSIS:</span>
                  </div>
                  <div className="font-headline text-2xl uppercase tracking-wide leading-tight">
                    BILINGUAL EXISTENTIAL CRISIS WITH MID-WEST EMO CO-MORBIDITY
                  </div>

                  {/* Rotated Red Rubber Stamp */}
                  <div className="absolute -right-4 -bottom-6 border-4 border-red-600 bg-white text-red-600 font-headline text-2xl px-3.5 py-1 rotate-12 shadow-[4px_4px_0px_#000] select-none pointer-events-none uppercase tracking-widest">
                    CERTIFIED UNHINGED
                  </div>
                </div>

                {/* Mini Audio Monitor / Barcode strip */}
                <div className="pt-2 flex justify-between items-end border-t-2 border-dashed border-zinc-300">
                  <div className="font-mono text-[11px] text-zinc-700">
                    <div className="font-bold">PATIENT: KUSHAL B.</div>
                    <div className="text-[10px] text-zinc-500 font-bold">STATUS: PROGNOSIS TERMINAL</div>
                  </div>
                  <div className="font-mono text-2xl tracking-[5px] leading-none text-black font-bold">
                    ||| | ||| || |||
                  </div>
                </div>

              </div>

              {/* Decorative Offset Background Paper in Radiant Lime */}
              <div className="absolute inset-0 bg-[#CCFF00] border-4 border-black translate-x-3 translate-y-3 -z-10 shadow-[4px_4px_0px_#000]"></div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. MULTI-COLOR FULL-BLEED MARQUEE TICKER TAPE (Acid Lime Background #CCFF00) */}
      <div className="w-full bg-[#CCFF00] border-b-6 border-black py-3 overflow-hidden shadow-sm">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 font-headline text-xl sm:text-2xl uppercase tracking-widest text-black shrink-0 pr-8">
              <span className="bg-[#FF007F] text-white px-2.5 py-0.5 border-2 border-black shadow-[3px_3px_0px_#000]">/// DIAGNOSTIC INTAKE ACTIVE</span>
              <span className="text-black">★</span>
              <span className="bg-[#5A189A] text-white px-2.5 py-0.5 border-2 border-black shadow-[3px_3px_0px_#000]">HIGH FREQUENCY CRINGE DETECTED</span>
              <span className="text-black">★</span>
              <span className="bg-[#FF6D00] text-white px-2.5 py-0.5 border-2 border-black shadow-[3px_3px_0px_#000]">100% RAW PSYCHOACOUSTIC AUTOPSY</span>
              <span className="text-black">★</span>
              <span className="bg-[#0047FF] text-white px-2.5 py-0.5 border-2 border-black shadow-[3px_3px_0px_#000]">NO TASTE IS SAFE</span>
              <span className="text-black">★</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. "HOW WE EXPOSE YOUR ACOUSTIC MALADIES" (Full-Bleed Deep Royal Purple #5A189A) */}
      <section id="methodology" className="w-full bg-[#5A189A] text-white border-b-6 border-black py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-4 border-black pb-4 mb-12">
            <div>
              <div className="border-3 border-black bg-[#CCFF00] text-black px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider inline-block mb-3 shadow-[4px_4px_0px_#000]">
                METHODOLOGY // CLINICAL PROTOCOLS
              </div>
              <h2 className="font-headline text-4xl sm:text-6xl uppercase tracking-tight text-white drop-shadow">
                HOW WE EXPOSE YOUR ACOUSTIC MALADIES
              </h2>
            </div>
            <span className="font-mono text-xs font-bold bg-[#FF007F] border-2 border-black px-3 py-1.5 text-white uppercase shadow-[4px_4px_0px_#000]">
              3-STAGE PIPELINE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Electric Blue Accent */}
            <div className="border-4 border-black bg-white text-black p-6 shadow-[8px_8px_0px_#0047FF] flex flex-col justify-between hover:-translate-y-2 transition-all">
              <div>
                <div className="w-12 h-12 border-3 border-black bg-[#0047FF] text-white font-headline text-2xl flex items-center justify-center mb-5 shadow-[3px_3px_0px_#000]">
                  01
                </div>
                <h3 className="font-headline text-2xl uppercase tracking-wider text-black mb-3">
                  PATHOLOGICAL PATTERN RECOGNITION
                </h3>
                <p className="text-sm font-body text-zinc-800 leading-relaxed font-medium">
                  Our algorithms scan track repeats exceeding 40 plays in 72 hours, dissect BPM divergency between 2PM and 3AM, and isolate acoustic hypocrisies across 50 top tracks.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t-2 border-dashed border-zinc-300 font-mono text-[11px] font-bold text-[#0047FF] uppercase flex items-center gap-1.5">
                <span>SCANNING:</span>
                <span className="bg-blue-100 text-blue-900 px-1.5 py-0.5 border border-blue-300">VALENCE</span>
                <span className="bg-blue-100 text-blue-900 px-1.5 py-0.5 border border-blue-300">ENERGY</span>
              </div>
            </div>

            {/* Card 2: Solar Orange Accent */}
            <div className="border-4 border-black bg-white text-black p-6 shadow-[8px_8px_0px_#FF6D00] flex flex-col justify-between hover:-translate-y-2 transition-all">
              <div>
                <div className="w-12 h-12 border-3 border-black bg-[#FF6D00] text-white font-headline text-2xl flex items-center justify-center mb-5 shadow-[3px_3px_0px_#000]">
                  02
                </div>
                <h3 className="font-headline text-2xl uppercase tracking-wider text-black mb-3">
                  4 SELECTABLE PSYCHO-TONES
                </h3>
                <p className="text-sm font-body text-zinc-800 leading-relaxed font-medium">
                  Pick the psychologist persona assigned to dissect your auditory sins: Clinical Brutal, 3AM Bestie, Unlicensed Therapist, or Pitchfork Elitist.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t-2 border-dashed border-zinc-300 font-mono text-[11px] font-bold text-[#FF6D00] uppercase flex items-center gap-1.5">
                <span>POWERED BY:</span>
                <span className="bg-orange-100 text-orange-900 px-1.5 py-0.5 border border-orange-300">GEMINI AI 2.0</span>
              </div>
            </div>

            {/* Card 3: Acid Lime Accent */}
            <div className="border-4 border-black bg-white text-black p-6 shadow-[8px_8px_0px_#CCFF00] flex flex-col justify-between hover:-translate-y-2 transition-all">
              <div>
                <div className="w-12 h-12 border-3 border-black bg-[#CCFF00] text-black font-headline text-2xl flex items-center justify-center mb-5 shadow-[3px_3px_0px_#000]">
                  03
                </div>
                <h3 className="font-headline text-2xl uppercase tracking-wider text-black mb-3">
                  9:16 RISOGRAPH EXPORT
                </h3>
                <p className="text-sm font-body text-zinc-800 leading-relaxed font-medium">
                  Generates a 1080x1920 poster complete with risograph acid-ink plates, paper grain, mock barcodes, and laminated diagnostic seals formatted for Instagram.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t-2 border-dashed border-zinc-300 font-mono text-[11px] font-bold text-emerald-800 uppercase flex items-center gap-1.5">
                <span>OUTPUT:</span>
                <span className="bg-lime-100 text-lime-900 px-1.5 py-0.5 border border-lime-300">1080x1920 PNG</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. TERMINAL LOG READOUT (Midnight Dark #0F172A) */}
      <section className="w-full bg-[#0F172A] border-b-6 border-black py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="border-4 border-black bg-black p-6 sm:p-8 shadow-[8px_8px_0px_#CCFF00] font-mono text-xs sm:text-sm leading-relaxed relative">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 text-zinc-400 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 border border-black"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500 border border-black"></span>
                <span className="w-3 h-3 rounded-full bg-[#CCFF00] border border-black"></span>
                <span className="ml-2 font-bold text-white">PSYCHOACOUSTIC_KERNEL_V2.log</span>
              </div>
              <span className="uppercase text-[10px] bg-[#0047FF] text-white px-2 py-0.5 border border-white/20 font-bold">TELEMETRY RUNNING</span>
            </div>

            <div className="flex flex-col gap-2 font-mono">
              <div className="text-zinc-400">[0.001] <span className="text-[#CCFF00] font-bold">DETECTED:</span> 72-month archive with 99.1% repeat co-factor...</div>
              <div className="text-zinc-400">[0.014] <span className="text-cyan-300 font-bold">EXTRACTING:</span> 20-day listening window (sample size: 1,421 tracks)...</div>
              <div className="text-zinc-400">[0.027] <span className="text-[#FF007F] font-bold">ISOLATING DIVERGENCY:</span> 140 BPM speed-running to 65 BPM weeping...</div>
              <div className="text-zinc-400">[0.038] <span className="text-[#FF6D00] font-bold">INFERRING HYPOCRISY:</span> Listening to indie sadness while wealth hoarding...</div>
              <div className="text-zinc-400">[0.049] <span className="text-purple-300 font-bold">SYNTHESIZING:</span> Risograph diagnostic specimen matrices...</div>
              <div className="text-[#CCFF00] font-bold text-sm mt-1">[0.062] SYSTEM READY FOR COMPLETE PSYCHIC AUTOPSY. <span className="animate-pulse">_</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BOTTOM CALL TO ACTION BANNER (Full-Bleed Hot Magenta Pink #FF007F) */}
      <section className="w-full bg-[#FF007F] border-b-6 border-black py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="border-4 border-black bg-[#CCFF00] p-8 sm:p-12 shadow-[8px_8px_0px_#000] flex flex-col lg:flex-row items-center justify-between gap-8 text-black">
            
            <div className="max-w-2xl">
              <div className="inline-block bg-[#FF007F] text-white font-mono text-xs font-bold px-2.5 py-1 border-2 border-black mb-3 shadow-[2px_2px_0px_#000]">
                ACTION REQUIRED // IMMEDIATE
              </div>
              <h3 className="font-headline text-4xl sm:text-5xl uppercase tracking-tight text-black mb-3">
                READY TO CONFRONT YOUR AUDITORY CRIMES?
              </h3>
              <p className="font-body text-base text-zinc-900 leading-relaxed font-medium">
                Sign in with Spotify. Batch psychoanalyzing your full library to the deepest sonic cavities, cataloging 3AM repeats of Olivia Rodrigo, and generating your custom Risograph autopsy poster.
              </p>
            </div>

            <a
              href={isConfigured ? loginUrl : '#'}
              onClick={(e) => {
                if (!isConfigured) {
                  e.preventDefault();
                  alert('Please configure your Spotify API keys in .env!');
                }
              }}
              className="px-8 py-5 border-4 border-black bg-black text-white font-headline text-2xl uppercase tracking-wider hover:bg-[#FF007F] hover:text-white transition-all shadow-[6px_6px_0px_#000] shrink-0"
            >
              CONNECT SPOTIFY NOW →
            </a>
          </div>
        </div>
      </section>

      {/* 7. FOOTER (Midnight Dark #0F172A) */}
      <footer className="w-full bg-[#0F172A] border-t-4 border-[#CCFF00] px-4 sm:px-8 py-6 text-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-zinc-400">
          <div className="flex items-center gap-3">
            <span className="font-bold text-black bg-[#CCFF00] px-2 py-0.5 border border-black">SONIC MIRROR // 2026</span>
            <span>•</span>
            <span className="text-white font-bold">DEPT. OF PSYCHOACOUSTIC PATHOLOGY</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="tracking-[4px] font-bold text-[#CCFF00]">||| || | |||| |</span>
            <span className="font-bold text-white">ALL RIGHTS RESERVED</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
