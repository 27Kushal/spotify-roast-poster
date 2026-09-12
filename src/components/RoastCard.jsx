import React, { useState } from 'react';
import { Sparkles, RefreshCw, Flame, Quote, Tag, Copy, Check, Headphones, MessageSquareQuote } from 'lucide-react';
import { TONES } from '../hooks/useRoast';

export default function RoastCard({
  roastData,
  isGenerating,
  error,
  currentTone,
  onRegenerate,
  onProceedToPoster,
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!roastData) return;
    const textToCopy = `🔥 ${roastData.archetype}\n\n"${roastData.burnQuote}"\n\n${roastData.roast}\n\n— Roasted via Sonic Mirror`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (isGenerating && !roastData) {
    return (
      <div className="glass-panel-glow p-10 rounded-3xl text-center border border-white/10 animate-pulse">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4">
          <Flame className="w-8 h-8 animate-bounce" />
        </div>
        <h3 className="text-2xl font-black text-white font-syne mb-2">Analyzing your musical trauma...</h3>
        <p className="text-sm text-zinc-400 font-mono">Gemini 3.5 Flash is calculating your exact percentage of emotional avoidance</p>
      </div>
    );
  }

  if (error && !roastData) {
    return (
      <div className="glass-panel p-8 rounded-3xl border border-red-500/30 text-center">
        <Flame className="w-8 h-8 text-red-400 mx-auto mb-3" />
        <h4 className="text-white font-syne font-bold text-lg mb-1">Roast Generation Stumbled</h4>
        <p className="text-xs text-red-200 mb-5 font-mono">{error}</p>
        <button
          onClick={() => onRegenerate(currentTone)}
          className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!roastData) {
    return (
      <div className="glass-panel-glow p-10 rounded-[32px] text-center border border-white/15">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-amber-500/20">
          <Flame className="w-8 h-8 text-white fill-white" />
        </div>
        <h3 className="text-3xl font-black text-white font-syne mb-2">
          Ready to Get Roasted?
        </h3>
        <p className="text-sm text-zinc-400 max-w-md mx-auto mb-6">
          We'll feed your real Spotify metrics and heavy rotation tracks to Gemini Flash to generate an unfiltered
          personality diagnosis.
        </p>
        <button
          onClick={() => onRegenerate('brutal')}
          disabled={isGenerating}
          className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-black font-black text-sm shadow-xl shadow-amber-500/25 hover:scale-105 transition-all"
        >
          <Flame className="w-5 h-5 fill-current" />
          <span>Generate My Sonic Roast</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-[36px] glass-panel-glow border border-white/15 shadow-2xl p-7 sm:p-10">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-500/10 to-rose-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-7 relative z-10">
        <div className="flex items-center gap-2.5">
          <span className="px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-mono font-extrabold uppercase tracking-widest flex items-center gap-1.5">
            <Flame className="w-4 h-4 fill-current" />
            <span>AI Personality Diagnosis</span>
          </span>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
            Gemini Live
          </span>
        </div>

        {/* Tone Switcher Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/60 border border-white/10 overflow-x-auto">
          {TONES.map((t) => (
            <button
              key={t.id}
              onClick={() => onRegenerate(t.id)}
              disabled={isGenerating}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                currentTone === t.id
                  ? 'bg-amber-400 text-black font-black shadow-md scale-105'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{t.emoji}</span>
              <span className="hidden md:inline">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Archetype Title */}
      <div className="mb-6 relative z-10">
        <span className="text-xs font-mono font-bold tracking-widest text-zinc-500 uppercase block mb-1">
          Diagnosed Sonic Archetype
        </span>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight font-syne leading-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-200 to-teal-200">
          {roastData.archetype}
        </h2>
      </div>

      {/* Burn Quote Callout */}
      {roastData.burnQuote && (
        <div className="mb-7 p-5 rounded-2xl bg-black/50 border border-white/10 flex items-start gap-3.5 relative z-10 shadow-inner">
          <MessageSquareQuote className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-base sm:text-lg font-bold italic text-amber-200/90 font-grotesk leading-snug">
            {roastData.burnQuote}
          </p>
        </div>
      )}

      {/* Main Roast Paragraphs */}
      <div className="mb-7 text-sm sm:text-base text-zinc-300 leading-relaxed font-sans space-y-4 whitespace-pre-line relative z-10">
        {roastData.roast}
      </div>

      {/* Vibe Tags */}
      {roastData.vibeTags && roastData.vibeTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8 relative z-10">
          {roastData.vibeTags.map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono font-semibold text-zinc-300 hover:border-spotify-green/40 transition-colors"
            >
              <Tag className="w-3 h-3 text-amber-400" />
              <span>{tag}</span>
            </span>
          ))}
        </div>
      )}

      {/* Footer Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3.5 pt-6 border-t border-white/10 relative z-10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onRegenerate(currentTone)}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white font-bold text-xs transition-all border border-white/10 hover:scale-105 active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Cooking fresh roast...' : 'Remix Roast'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-xs font-semibold transition-all border border-white/5"
            title="Copy roast text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-spotify-green" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Roast'}</span>
          </button>
        </div>

        {onProceedToPoster && (
          <button
            onClick={onProceedToPoster}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-spotify-green hover:bg-[#1ed760] text-black font-extrabold text-xs tracking-wide uppercase transition-all shadow-lg shadow-spotify-green/20 hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-4 h-4 fill-current" />
            <span>Customize Story Poster ↓</span>
          </button>
        )}
      </div>
    </div>
  );
}
