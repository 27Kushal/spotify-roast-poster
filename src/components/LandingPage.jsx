import React from 'react';
import { Sparkles, Music, Flame, Image as ImageIcon, ShieldCheck, AlertCircle } from 'lucide-react';

export default function LandingPage({ loginUrl, authConfig }) {
  const isConfigured = authConfig?.isConfigured;

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#121212] via-[#0d0d0d] to-[#050505]">
      {/* Background glow accents */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-spotify-green/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header / Logo */}
      <header className="relative z-10 max-w-6xl mx-auto w-full px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-spotify-green to-emerald-700 flex items-center justify-center shadow-lg shadow-spotify-green/20">
            <Sparkles className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white font-['Space_Grotesk']">
            SONIC <span className="text-spotify-green">MIRROR</span>
          </span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-spotify-subtext">
          <span className="w-2 h-2 rounded-full bg-spotify-green animate-ping" />
          <span>Spotify Wrapped 24/7</span>
        </div>
      </header>

      {/* Hero Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12 text-center flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-spotify-green/10 border border-spotify-green/30 text-spotify-green text-xs font-semibold mb-6">
          <Flame className="w-4 h-4 text-spotify-green" />
          <span>Brutal Music Taste Roasts + Shareable Posters</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.08] mb-6">
          Your music taste has secrets.{' '}
          <span className="bg-gradient-to-r from-spotify-green via-emerald-300 to-teal-200 bg-clip-text text-transparent">
            We're here to spill them.
          </span>
        </h1>

        {/* Subtitle / Explainer */}
        <p className="text-base sm:text-lg md:text-xl text-spotify-subtext max-w-2xl mx-auto mb-10 leading-relaxed">
          Sonic Mirror analyzes your real Spotify top tracks, tempo, and audio energy. We run it through an unfiltered
          AI roast and generate a high-aesthetic mood board poster ready for your story.
        </p>

        {/* Configuration Warning if .env missing */}
        {!isConfigured && (
          <div className="w-full max-w-xl mb-8 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-left flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-amber-200">
              <p className="font-semibold text-amber-300 mb-1">Spotify Credentials Needed in .env</p>
              <p className="text-amber-200/80 mb-2">
                Set <code className="bg-black/40 px-1.5 py-0.5 rounded text-amber-300">SPOTIFY_CLIENT_ID</code> and{' '}
                <code className="bg-black/40 px-1.5 py-0.5 rounded text-amber-300">SPOTIFY_CLIENT_SECRET</code> in your{' '}
                <code className="bg-black/40 px-1.5 py-0.5 rounded text-amber-300">.env</code> file.
              </p>
              <p className="text-[11px] text-amber-200/60">
                Redirect URI configured:{' '}
                <code className="text-amber-300">{authConfig?.redirectUri || 'http://localhost:5173/callback'}</code>
              </p>
            </div>
          </div>
        )}

        {/* Single "Connect Spotify" CTA Button */}
        <div className="flex flex-col items-center gap-3 w-full sm:w-auto">
          <a
            href={isConfigured ? loginUrl : '#'}
            onClick={(e) => {
              if (!isConfigured) {
                e.preventDefault();
                alert(
                  'Please configure your SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in the .env file before connecting!'
                );
              }
            }}
            className={`group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold text-base transition-all duration-300 shadow-xl ${
              isConfigured
                ? 'bg-spotify-green text-black hover:bg-[#1ed760] hover:scale-105 shadow-spotify-green/25 hover:shadow-spotify-green/40'
                : 'bg-zinc-800 text-zinc-400 cursor-not-allowed border border-zinc-700'
            }`}
          >
            {/* Spotify SVG Icon */}
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.485 17.311c-.216.353-.676.467-1.029.252-2.825-1.727-6.381-2.118-10.57-1.161-.403.092-.807-.16-.9-.562-.091-.403.161-.807.563-.9 4.588-1.048 8.525-.601 11.684 1.342.353.215.467.676.252 1.029zm1.464-3.255c-.271.442-.852.583-1.294.312-3.235-1.988-8.167-2.564-11.994-1.401-.497.151-1.027-.133-1.179-.63-.151-.497.133-1.027.63-1.179 4.375-1.328 9.814-.686 13.525 1.604.442.271.583.852.312 1.294zm.126-3.393C15.2 8.354 8.788 8.143 5.118 9.257c-.596.181-1.229-.158-1.41-.754-.182-.596.158-1.229.754-1.41 4.223-1.282 11.31-1.036 15.655 1.544.536.318.711 1.012.393 1.548-.318.536-1.012.711-1.548.393z" />
            </svg>
            <span>Connect with Spotify</span>
          </a>

          <span className="text-xs text-spotify-subtext">
            Read-only access to top tracks • No login saved on servers
          </span>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 w-full max-w-3xl">
          <div className="p-5 rounded-2xl bg-spotify-dark/80 border border-white/5 text-left">
            <Flame className="w-6 h-6 text-amber-400 mb-3" />
            <h3 className="text-white font-bold text-sm mb-1">Unfiltered AI Roast</h3>
            <p className="text-xs text-spotify-subtext leading-relaxed">
              Powered by Gemini Flash. Specific, sharp commentary referencing your exact stats.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-spotify-dark/80 border border-white/5 text-left">
            <ImageIcon className="w-6 h-6 text-emerald-400 mb-3" />
            <h3 className="text-white font-bold text-sm mb-1">Album Art Mood Board</h3>
            <p className="text-xs text-spotify-subtext leading-relaxed">
              Dynamically generates a palette from your top album covers with high-res PNG export.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-spotify-dark/80 border border-white/5 text-left">
            <ShieldCheck className="w-6 h-6 text-teal-400 mb-3" />
            <h3 className="text-white font-bold text-sm mb-1">100% Private & Free</h3>
            <p className="text-xs text-spotify-subtext leading-relaxed">
              No database, no tracking cookies. Everything is processed directly in your browser session.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-6xl mx-auto w-full px-6 py-6 text-center text-xs text-spotify-subtext border-t border-white/5">
        Sonic Mirror is not affiliated with Spotify AB. Built with Spotify Web API & Google Gemini.
      </footer>
    </div>
  );
}
