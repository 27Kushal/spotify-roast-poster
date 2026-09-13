import React from 'react';
import { ArrowRight, AlertCircle, Sparkles, Activity, ShieldAlert, Disc3 } from 'lucide-react';
import ThreeVisualizer from './ThreeVisualizer';

export default function LandingPage({ loginUrl, authConfig }) {
  const isConfigured = authConfig?.isConfigured;

  return (
    <div className="min-h-screen bg-zine-cream text-zine-black font-body selection:bg-zine-pink selection:text-white flex flex-col justify-between relative overflow-x-hidden">
      
      {/* 1. TOP HEADER / APP BAR */}
      <header className="w-full bg-white border-b-2 border-zine-black px-4 sm:px-8 py-3 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo badge with double border */}
          <div className="flex items-center gap-3">
            <div className="border-2 border-zine-black p-0.5 bg-white shadow-brutal-sm">
              <div className="border border-zine-black px-2.5 py-1 bg-zine-lime text-zine-black font-headline text-lg sm:text-xl tracking-wider leading-none">
                SONIC MIRROR
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 border border-zine-black px-2 py-0.5 text-[11px] font-mono bg-zine-cream">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span>LAB-04 // SPECIMEN INTAKE</span>
            </div>
          </div>

          {/* Center System Status Ticker */}
          <div className="hidden lg:flex items-center gap-3 text-xs font-mono text-zine-black/80">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
            <span>SYSTEM: ONLINE</span>
            <span className="text-zinc-400">|</span>
            <span>CASE: #SM-8492</span>
            <span className="text-zinc-400">|</span>
            <span>DEPT OF PSYCHOACOUSTIC PATHOLOGY</span>
          </div>

          {/* Right Action */}
          <div className="flex items-center gap-3">
            <a
              href={isConfigured ? loginUrl : '#'}
              onClick={(e) => {
                if (!isConfigured) {
                  e.preventDefault();
                  alert('Please configure your SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in the .env file!');
                }
              }}
              className={`inline-flex items-center gap-2 px-4 py-1.5 border-2 border-zine-black font-headline text-sm uppercase tracking-wider transition-all shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none ${
                isConfigured
                  ? 'bg-zine-lime text-zine-black hover:bg-black hover:text-zine-lime'
                  : 'bg-zinc-300 text-zinc-500 cursor-not-allowed'
              }`}
            >
              <span>CONNECT SPOTIFY</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10 lg:py-16 w-full flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Big Copy & Intake Form Action */}
          <div className="lg:col-span-7 flex flex-col">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 border-2 border-zine-black px-3 py-1 bg-white font-mono text-xs font-bold uppercase tracking-wider w-fit mb-5 shadow-brutal-sm">
              <Activity className="w-3.5 h-3.5 text-zine-pink" />
              <span>CASE INTAKE FORM // V.2.06</span>
            </div>

            {/* Massive Highlighter Headline */}
            <h1 className="font-headline text-5xl sm:text-6xl md:text-7xl lg:text-[76px] leading-[0.92] tracking-tight uppercase text-zine-black mb-6">
              WE ANALYZE YOUR SPOTIFY DATA. OUR{' '}
              <span className="bg-zine-pink text-white px-3 py-1 inline-block border-2 border-zine-black shadow-[4px_4px_0px_#111] -rotate-1">
                AI PSYCHIATRIST
              </span>{' '}
              <span className="bg-zine-lime text-zine-black px-3 py-1 inline-block border-2 border-zine-black shadow-[4px_4px_0px_#111] rotate-1">
                ROASTS YOUR TASTE.
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-zinc-700 font-body leading-relaxed max-w-xl mb-8">
              Connect your Spotify account for a merciless psychoacoustic evaluation of your listening neuroses.
              We calculate valence-to-validity, catalog escalated 3AM spiraling, isolate acoustic hypocrisies, and spit out an official Risograph autopsy poster formatted for Instagram Stories.
            </p>

            {/* Missing Credentials Alert if applicable */}
            {!isConfigured && (
              <div className="mb-8 p-4 bg-amber-100 border-2 border-amber-500 text-amber-900 flex items-start gap-3 shadow-brutal-sm">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-sm font-mono">
                  <p className="font-bold uppercase">Spotify Credentials Missing</p>
                  <p className="text-xs mt-1">
                    Set <code className="bg-amber-200 px-1 py-0.5">VITE_SPOTIFY_CLIENT_ID</code> and{' '}
                    <code className="bg-amber-200 px-1 py-0.5">VITE_SPOTIFY_CLIENT_SECRET</code> in your <code>.env</code> file.
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
                className={`inline-flex items-center gap-3 px-8 py-4 border-2 border-zine-black font-headline text-xl sm:text-2xl uppercase tracking-wider transition-all shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none ${
                  isConfigured
                    ? 'bg-zine-lime text-zine-black hover:bg-zine-pink hover:text-white'
                    : 'bg-zinc-300 text-zinc-500 cursor-not-allowed'
                }`}
              >
                <span>CONNECT SPOTIFY TO COMMENCE EVALUATION</span>
                <ArrowRight className="w-6 h-6" />
              </a>

              <a
                href="#methodology"
                className="inline-flex items-center gap-2 px-5 py-4 border-2 border-zine-black bg-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-zinc-100 transition-all shadow-brutal-sm"
              >
                <span>INSPECT SAMPLE SPECIMEN ↓</span>
              </a>
            </div>

            {/* 3 Metric Preview Boxes */}
            <div className="grid grid-cols-3 gap-3 max-w-lg border-t-2 border-dashed border-zinc-400 pt-6">
              <div className="border-2 border-zine-black bg-white p-3 shadow-brutal-sm">
                <div className="font-headline text-3xl sm:text-4xl text-zine-black leading-none">94.8%</div>
                <div className="font-mono text-[10px] uppercase font-bold text-zinc-500 mt-1">EMOTIONAL AVOIDANCE</div>
              </div>

              <div className="border-2 border-zine-black bg-white p-3 shadow-brutal-sm">
                <div className="font-headline text-3xl sm:text-4xl text-zinc-900 leading-none">0.82</div>
                <div className="font-mono text-[10px] uppercase font-bold text-zinc-500 mt-1">VALIDITY INDEX</div>
              </div>

              <div className="border-2 border-zine-black bg-white p-3 shadow-brutal-sm">
                <div className="font-headline text-3xl sm:text-4xl text-zine-pink leading-none">12.1%</div>
                <div className="font-mono text-[10px] uppercase font-bold text-zinc-500 mt-1">TASTE PURITY</div>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Holographic Visualizer + Clinical Specimen Card */}
          <div className="lg:col-span-5 relative">
            
            {/* Specimen Case Document Card */}
            <div className="border-4 border-zine-black bg-white shadow-brutal-lg p-5 relative z-10">
              
              {/* Card Header */}
              <div className="flex justify-between items-center border-b-2 border-zine-black pb-3 mb-4">
                <div>
                  <div className="font-headline text-xl uppercase tracking-wider text-black">
                    SONIC MIRROR // LAB-04
                  </div>
                  <div className="font-mono text-[11px] text-zinc-500">
                    INTAKE NO. 9214-B // PSYCHOACOUSTIC AUTOPSY
                  </div>
                </div>
                <div className="font-mono text-xs tracking-widest bg-zine-black text-white px-2 py-0.5">
                  SPECIMEN
                </div>
              </div>

              {/* Center 3D Interactive Cassette Visualizer */}
              <div className="w-full h-64 bg-zine-black border-2 border-zine-black rounded-none relative overflow-hidden mb-4 shadow-inner">
                {/* Embedded Three.js 3D Model */}
                <ThreeVisualizer mode="hero" className="w-full h-full" />
                
                {/* 3D Hologram Overlay HUD */}
                <div className="absolute top-2 left-3 font-mono text-[10px] text-zine-lime bg-black/60 px-2 py-0.5 border border-zine-lime/40">
                  3D HOLO-CORE // INTERACTIVE TILT
                </div>
                <div className="absolute bottom-2 right-3 font-mono text-[10px] text-zine-cyan bg-black/60 px-2 py-0.5 border border-zine-cyan/40">
                  REELS: ROTATING 120BPM
                </div>
              </div>

              {/* Diagnosis Tag Box */}
              <div className="border-2 border-zine-black bg-zine-pink text-white p-3 mb-4 shadow-brutal-sm relative">
                <div className="font-mono text-[10px] uppercase tracking-widest text-white/80 mb-0.5">
                  PRELIMINARY DIAGNOSIS
                </div>
                <div className="font-headline text-2xl uppercase tracking-wide leading-tight">
                  BILINGUAL EXISTENTIAL CRISIS WITH MID-WEST EMO CO-MORBIDITY
                </div>

                {/* Rotated Red Rubber Stamp */}
                <div className="absolute -right-4 -bottom-6 border-4 border-red-600 bg-white/95 text-red-600 font-headline text-2xl px-3 py-1 rotate-12 shadow-brutal-sm select-none pointer-events-none uppercase tracking-widest">
                  CERTIFIED UNHINGED
                </div>
              </div>

              {/* Mini Audio Monitor / Barcode strip */}
              <div className="pt-2 flex justify-between items-end border-t border-zinc-200">
                <div className="font-mono text-[11px] text-zinc-600">
                  <div>PATIENT: KUSHAL B.</div>
                  <div className="text-[10px] text-zinc-400">STATUS: PROGNOSIS TERMINAL</div>
                </div>
                <div className="font-mono text-2xl tracking-[4px] leading-none text-zinc-800">
                  ||| | ||| || |||
                </div>
              </div>

            </div>

            {/* Decorative Offset Background Paper */}
            <div className="absolute inset-0 bg-zine-lime border-4 border-zine-black translate-x-3 translate-y-3 -z-10"></div>
          </div>

        </div>
      </main>

      {/* 3. MARQUEE TICKER TAPE */}
      <div className="w-full bg-zine-pink border-y-4 border-zine-black py-2.5 overflow-hidden shadow-sm">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 font-headline text-xl sm:text-2xl uppercase tracking-widest text-white shrink-0 pr-8">
              <span>/// DIAGNOSTIC INTAKE ACTIVE</span>
              <span className="text-zine-lime">★</span>
              <span>WARNING: HIGH FREQUENCY CRINGE DETECTED</span>
              <span className="text-zine-lime">★</span>
              <span>100% RAW PSYCHOACOUSTIC AUTOPSY</span>
              <span className="text-zine-lime">★</span>
              <span>NO TASTE IS SAFE</span>
              <span className="text-zine-lime">★</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. "HOW WE EXPOSE YOUR ACOUSTIC MALADIES" (3-Card Feature Grid) */}
      <section id="methodology" className="max-w-7xl mx-auto px-4 sm:px-8 py-16 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-zine-black pb-4 mb-10">
          <div>
            <div className="border border-zine-black bg-white px-2.5 py-0.5 font-mono text-xs font-bold uppercase tracking-wider inline-block mb-2 shadow-brutal-sm">
              METHODOLOGY // CLINICAL PROTOCOLS
            </div>
            <h2 className="font-headline text-4xl sm:text-5xl uppercase tracking-tight text-zine-black">
              HOW WE EXPOSE YOUR ACOUSTIC MALADIES
            </h2>
          </div>
          <span className="font-mono text-xs text-zinc-500 uppercase">3-STAGE PIPELINE EVALUATION</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="border-3 border-zine-black bg-white p-6 shadow-brutal flex flex-col justify-between hover:-translate-y-1 transition-transform">
            <div>
              <div className="w-8 h-8 rounded-none border-2 border-zine-black bg-zine-lime font-headline text-lg flex items-center justify-center mb-4">
                01
              </div>
              <h3 className="font-headline text-2xl uppercase tracking-wider text-black mb-3">
                PATHOLOGICAL PATTERN RECOGNITION
              </h3>
              <p className="text-sm font-body text-zinc-700 leading-relaxed">
                Our algorithms scan track repeats exceeding 40 plays in 72 hours, dissect BPM divergency between 2PM and 3AM, and isolate acoustic hypocrisies across 50 top tracks.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-dashed border-zinc-300 font-mono text-[11px] text-zinc-500 uppercase">
              SCANNING: VALENCE // ENERGY // ACOUSTICNESS
            </div>
          </div>

          {/* Card 2 */}
          <div className="border-3 border-zine-black bg-white p-6 shadow-brutal flex flex-col justify-between hover:-translate-y-1 transition-transform">
            <div>
              <div className="w-8 h-8 rounded-none border-2 border-zine-black bg-zine-pink text-white font-headline text-lg flex items-center justify-center mb-4">
                02
              </div>
              <h3 className="font-headline text-2xl uppercase tracking-wider text-black mb-3">
                4 SELECTABLE PSYCHO-TONES
              </h3>
              <p className="text-sm font-body text-zinc-700 leading-relaxed">
                Pick the psychologist persona assigned to dissect your auditory sins: Clinical Brutal, 3AM Bestie, Unlicensed Therapist, or Pitchfork Elitist.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-dashed border-zinc-300 font-mono text-[11px] text-zinc-500 uppercase">
              POWERED BY: GEMINI AI REASONING
            </div>
          </div>

          {/* Card 3 */}
          <div className="border-3 border-zine-black bg-white p-6 shadow-brutal flex flex-col justify-between hover:-translate-y-1 transition-transform">
            <div>
              <div className="w-8 h-8 rounded-none border-2 border-zine-black bg-zine-cyan font-headline text-lg flex items-center justify-center mb-4">
                03
              </div>
              <h3 className="font-headline text-2xl uppercase tracking-wider text-black mb-3">
                9:16 RISOGRAPH EXPORT
              </h3>
              <p className="text-sm font-body text-zinc-700 leading-relaxed">
                Generates a 1080x1920 poster complete with risograph acid-ink plates, paper grain, mock barcodes, and laminated diagnostic seals formatted for Instagram.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-dashed border-zinc-300 font-mono text-[11px] text-zinc-500 uppercase">
              OUTPUT: INSTAGRAM STORY READY PNG
            </div>
          </div>

        </div>
      </section>

      {/* 5. TERMINAL LOG READOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-16 w-full">
        <div className="border-4 border-zine-black bg-black p-5 sm:p-6 shadow-brutal font-mono text-xs sm:text-sm text-zine-lime leading-relaxed relative">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 text-zinc-500 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
              <span className="ml-2 font-bold text-white">PSYCHOACOUSTIC_KERNEL_V2.log</span>
            </div>
            <span className="uppercase text-[10px]">REAL-TIME PIPELINE TELEMETRY</span>
          </div>

          <div className="flex flex-col gap-1.5 opacity-90">
            <div>[0.001] DETECTED 72-MONTH ARCHIVE WITH 99.1% REPEAT CO-FACTOR...</div>
            <div>[0.014] EXTRACTED 20-DAY LISTENING WINDOW (SAMPLE SIZE: 1,421 TRACKS)...</div>
            <div className="text-zine-pink">[0.027] ISOLATING BPM DIVERGENCY: 140 BPM SPEED-RUNNING TO 65 BPM WEEPING...</div>
            <div>[0.038] INFERRING HYPOCRISY: LISTENING TO INDIE SADNESS WHILE WEALTH HOARDING...</div>
            <div className="text-zine-cyan">[0.049] SYNTHESIZING RISOGRAPH DIAGNOSTIC SPECIMEN MATRICES...</div>
            <div className="font-bold text-white">[0.062] SYSTEM READY FOR COMPLETE PSYCHIC AUTOPSY. <span className="animate-pulse">_</span></div>
          </div>
        </div>
      </section>

      {/* 6. BOTTOM CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-16 w-full">
        <div className="border-4 border-zine-black bg-zine-lime p-8 sm:p-12 shadow-brutal-lg flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <h3 className="font-headline text-4xl sm:text-5xl uppercase tracking-tight text-zine-black mb-3">
              READY TO CONFRONT YOUR AUDITORY CRIMES?
            </h3>
            <p className="font-body text-base text-zinc-800 leading-relaxed">
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
            className="px-8 py-5 border-3 border-zine-black bg-black text-white font-headline text-2xl uppercase tracking-wider hover:bg-zine-pink hover:text-white transition-all shadow-brutal shrink-0"
          >
            CONNECT SPOTIFY NOW →
          </a>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="w-full bg-white border-t-2 border-zine-black px-4 sm:px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-zinc-600">
          <div className="flex items-center gap-3">
            <span className="font-bold text-black">SONIC MIRROR // 2026</span>
            <span>•</span>
            <span>DEPT. OF PSYCHOACOUSTIC PATHOLOGY</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="tracking-[3px] font-bold text-black">||| || | |||| |</span>
            <span>ALL RIGHTS RESERVED</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
