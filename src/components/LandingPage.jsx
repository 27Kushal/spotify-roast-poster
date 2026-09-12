import React from 'react';
import { Sparkles, Flame, ShieldCheck, Disc, ArrowRight, Music, AlertCircle, Headphones } from 'lucide-react';

export default function LandingPage({ loginUrl, authConfig }) {
  const isConfigured = authConfig?.isConfigured;

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-void text-sleeve-white font-body selection:bg-studio-glow selection:text-white">
      {/* Background Aurora and Noise */}
      <div className="aurora-bg" style={{ '--aurora-1': 'rgba(255, 51, 102, 0.25)', '--aurora-2': 'rgba(0, 229, 255, 0.15)', '--aurora-3': 'rgba(255, 184, 0, 0.15)' }}></div>
      <div className="absolute inset-0 bg-noise z-0"></div>

      {/* Navigation Header */}
      <header className="relative z-10 w-full px-6 py-6 border-b border-static-grey flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-sm tracking-widest text-static-grey mb-1 uppercase">EST. 2024 / AI STUDIO</span>
          <h2 className="text-4xl md:text-5xl font-display uppercase tracking-wider text-sleeve-white leading-none">
            SONIC <span className="text-studio-glow">MIRROR</span>
          </h2>
        </div>
        <div className="text-xs uppercase tracking-widest text-static-grey">
          SYSTEM: <span className="text-sleeve-white">ONLINE</span> // API: {isConfigured ? <span className="text-spotify-green">LOCKED</span> : <span className="text-amber-tube animate-pulse">MISSING</span>}
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-grow flex flex-col px-6 py-12 lg:py-24 max-w-7xl mx-auto w-full">
        {/* Tuning-In Animated Hero Text */}
        <h1 className="text-7xl sm:text-8xl md:text-[140px] font-display uppercase leading-[0.85] tracking-tight mb-8 w-full animate-tuning-in">
          YOUR MUSIC TASTE HAS SINS.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-studio-glow to-amber-tube">
            WE RENDER THE RECEIPT.
          </span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-t border-static-grey pt-12">
          {/* Subtitle / Description */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <p className="text-lg md:text-xl text-sleeve-white/80 leading-relaxed max-w-md">
              Sonic Mirror analyzes your Spotify rotation. We roast your emotional avoidance with AI and generate a high-res, bespoke poster ready for your story.
            </p>

            {/* Configuration Notice if .env credentials missing */}
            {!isConfigured && (
              <div className="mt-8 p-4 border border-amber-tube flex items-start gap-4">
                <AlertCircle className="w-5 h-5 text-amber-tube shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-bold text-amber-tube mb-1 uppercase">Credentials Missing</p>
                  <p className="text-sleeve-white/70 mb-2">
                    Add <span className="text-amber-tube">SPOTIFY_CLIENT_ID</span> and <span className="text-amber-tube">SPOTIFY_CLIENT_SECRET</span> to your .env file.
                  </p>
                  <p className="text-xs text-sleeve-white/50 uppercase">
                    URI / {authConfig?.redirectUri || 'http://127.0.0.1:5173/callback'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action / Features */}
          <div className="md:col-span-7 flex flex-col items-start md:items-end md:text-right">
            <a
              href={isConfigured ? loginUrl : '#'}
              onClick={(e) => {
                if (!isConfigured) {
                  e.preventDefault();
                  alert('Please configure your SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in the .env file!');
                }
              }}
              className={`group inline-flex items-center gap-4 px-8 py-5 border-b-2 transition-all duration-300 ${
                isConfigured
                  ? 'border-studio-glow text-studio-glow hover:bg-studio-glow hover:text-void'
                  : 'border-static-grey text-static-grey cursor-not-allowed'
              }`}
            >
              <span className="font-display text-4xl uppercase tracking-wider translate-y-1">CONNECT SPOTIFY</span>
              <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
            </a>
            
            <p className="text-sm text-static-grey mt-4 max-w-sm">
              READ-ONLY ACCESS / 100% PRIVATE IN BROWSER
            </p>

            <div className="mt-16 grid grid-cols-1 gap-6 w-full max-w-lg border-l border-static-grey pl-6 text-left">
              <div>
                <h3 className="font-display text-2xl uppercase tracking-wide text-studio-glow mb-1">1 / UNFILTERED AI ROAST</h3>
                <p className="text-sm text-sleeve-white/60">Pinpoints your exact BPM, valence, and questionable top tracks.</p>
              </div>
              <div className="h-px bg-static-grey w-full"></div>
              <div>
                <h3 className="font-display text-2xl uppercase tracking-wide text-studio-glow mb-1">2 / DESIGNER POSTERS</h3>
                <p className="text-sm text-sleeve-white/60">Switch between layouts and download in crisp 1080×1920.</p>
              </div>
              <div className="h-px bg-static-grey w-full"></div>
              <div>
                <h3 className="font-display text-2xl uppercase tracking-wide text-studio-glow mb-1">3 / DYNAMIC PALETTES</h3>
                <p className="text-sm text-sleeve-white/60">Samples pixel data directly from your top album covers.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full px-6 py-6 border-t border-static-grey flex flex-col sm:flex-row justify-between items-center text-xs uppercase tracking-widest text-static-grey">
        <span>SONIC MIRROR / V2.0</span>
        <span>ALL RIGHTS RESERVED</span>
      </footer>
    </div>
  );
}
