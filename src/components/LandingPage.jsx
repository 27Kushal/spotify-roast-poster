import React from 'react';
import { Sparkles, Flame, ShieldCheck, Disc, ArrowRight, Music, AlertCircle, Headphones } from 'lucide-react';

const TICKER_ITEMS = [
  '🔥 "Your playlist needs 8 hours of sleep and a hug"',
  '☕ "Target commercial indie cred"',
  '⚡ "70% danceable, 39% happy, 100% crying in a cardigan"',
  '🛋️ "Listening to Glass Animals as an emotional coping mechanism"',
  '🚨 "Aux privileges permanently revoked"',
  '💿 "Overthinking at 120 BPM"',
];

export default function LandingPage({ loginUrl, authConfig }) {
  const isConfigured = authConfig?.isConfigured;

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#070709] text-white selection:bg-spotify-green selection:text-black">
      {/* Dynamic Aurora & Mesh Background Blobs */}
      <div className="absolute -top-48 -left-48 w-[600px] h-[600px] bg-spotify-green/20 rounded-full blur-[140px] pointer-events-none animate-pulseGlow" />
      <div className="absolute top-1/3 -right-48 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[160px] pointer-events-none animate-pulseGlow" style={{ animationDelay: '2s' }} />
      <div className="absolute -bottom-48 left-1/3 w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Subtle diagonal background grid texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Top Live Ticker Tape */}
      <div className="relative z-20 w-full overflow-hidden border-b border-white/10 bg-black/40 backdrop-blur-md py-2.5">
        <div className="flex w-max animate-marquee space-x-8 text-xs font-mono font-bold tracking-wider text-spotify-subtext uppercase">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="flex items-center gap-3">
              <span>{item}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-spotify-green" />
            </span>
          ))}
        </div>
      </div>

      {/* Navigation Header */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-spotify-green via-emerald-400 to-teal-200 flex items-center justify-center shadow-lg shadow-spotify-green/25">
            <Sparkles className="w-6 h-6 text-black" />
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight font-syne text-white block leading-none">
              SONIC <span className="text-spotify-green">MIRROR</span>
            </span>
            <span className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">
              AI Roast & Poster Studio
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-spotify-green animate-ping" />
            <span>Spotify Web API Live</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12 flex flex-col items-center text-center">
        {/* Glowing Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/15 text-xs font-mono font-semibold text-emerald-300 mb-8 shadow-inner backdrop-blur-md">
          <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>SPOTIFY WRAPPED, BUT BRUTALLY HONEST & 24/7</span>
        </div>

        {/* Hero Title with Display Typography */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight font-syne text-white leading-[1.02] max-w-5xl mb-6">
          Your music taste has sins.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-spotify-green via-emerald-300 to-teal-200">
            We render the receipt.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
          Sonic Mirror analyzes your real Spotify rotation, tempo, and mood features. We roast your emotional
          avoidance with Gemini Flash and generate a drop-dead gorgeous, high-res mood board poster ready for your story.
        </p>

        {/* Configuration Notice if .env credentials missing */}
        {!isConfigured && (
          <div className="w-full max-w-xl mb-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-left flex items-start gap-3 backdrop-blur-md">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-amber-200">
              <p className="font-bold text-amber-300 mb-1">Spotify Credentials Required in .env</p>
              <p className="text-amber-200/80 mb-2">
                Add <code className="bg-black/50 px-1.5 py-0.5 rounded text-amber-300">SPOTIFY_CLIENT_ID</code> and{' '}
                <code className="bg-black/50 px-1.5 py-0.5 rounded text-amber-300">SPOTIFY_CLIENT_SECRET</code> to your{' '}
                <code className="bg-black/50 px-1.5 py-0.5 rounded text-amber-300">.env</code>.
              </p>
              <p className="text-[11px] text-amber-200/60 font-mono">
                Redirect URI: <code className="text-amber-300">{authConfig?.redirectUri || 'http://127.0.0.1:5173/callback'}</code>
              </p>
            </div>
          </div>
        )}

        {/* Prominent CTA Button */}
        <div className="flex flex-col items-center gap-3">
          <a
            href={isConfigured ? loginUrl : '#'}
            onClick={(e) => {
              if (!isConfigured) {
                e.preventDefault();
                alert('Please configure your SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in the .env file!');
              }
            }}
            className={`group relative inline-flex items-center justify-center gap-3.5 px-9 py-5 rounded-full font-black text-base transition-all duration-300 shadow-2xl ${
              isConfigured
                ? 'bg-spotify-green text-black hover:bg-[#1ed760] hover:scale-105 active:scale-95 shadow-spotify-green/30 hover:shadow-spotify-green/50'
                : 'bg-zinc-800 text-zinc-400 cursor-not-allowed border border-zinc-700'
            }`}
          >
            {/* Spotify Icon */}
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.485 17.311c-.216.353-.676.467-1.029.252-2.825-1.727-6.381-2.118-10.57-1.161-.403.092-.807-.16-.9-.562-.091-.403.161-.807.563-.9 4.588-1.048 8.525-.601 11.684 1.342.353.215.467.676.252 1.029zm1.464-3.255c-.271.442-.852.583-1.294.312-3.235-1.988-8.167-2.564-11.994-1.401-.497.151-1.027-.133-1.179-.63-.151-.497.133-1.027.63-1.179 4.375-1.328 9.814-.686 13.525 1.604.442.271.583.852.312 1.294zm.126-3.393C15.2 8.354 8.788 8.143 5.118 9.257c-.596.181-1.229-.158-1.41-.754-.182-.596.158-1.229.754-1.41 4.223-1.282 11.31-1.036 15.655 1.544.536.318.711 1.012.393 1.548-.318.536-1.012.711-1.548.393z" />
            </svg>
            <span className="tracking-tight">Connect with Spotify</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>

          <span className="text-xs font-mono text-zinc-500">
            Read-only access • 100% private in your browser session
          </span>
        </div>

        {/* Interactive Feature Visual Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-20 w-full max-w-4xl">
          {/* Feature 1 */}
          <div className="glass-panel-glow p-6 rounded-3xl text-left border border-white/10 hover:border-spotify-green/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Flame className="w-6 h-6 fill-current" />
            </div>
            <h3 className="text-white font-syne font-bold text-lg mb-1.5">Unfiltered AI Roast</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Powered by Gemini 3.5 Flash. Pinpoints your exact BPM, sad-girl valence, and questionable top tracks.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-panel-glow p-6 rounded-3xl text-left border border-white/10 hover:border-emerald-400/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Disc className="w-6 h-6" />
            </div>
            <h3 className="text-white font-syne font-bold text-lg mb-1.5">3 Designer Story Posters</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Switch between Cyber Zine, Midnight Vinyl, and Sonic Receipt templates. Download in crisp 1080×1920.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-panel-glow p-6 rounded-3xl text-left border border-white/10 hover:border-teal-400/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-white font-syne font-bold text-lg mb-1.5">Dynamic Album Palette</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Samples pixel data directly from your top album covers to generate custom hues and glowing gradients.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full px-6 py-8 text-center text-xs font-mono text-zinc-600 border-t border-white/5">
        SONIC MIRROR • BUILT WITH SPOTIFY WEB API & GOOGLE GEMINI • ALL RIGHTS RESERVED
      </footer>
    </div>
  );
}
