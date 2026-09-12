import React from 'react';
import { Sparkles, RefreshCw, Flame, AlertCircle, Quote, Tag, Wand2 } from 'lucide-react';
import { TONES } from '../hooks/useRoast';

export default function RoastCard({
  roastData,
  isGenerating,
  error,
  currentTone,
  onRegenerate,
  onProceedToPoster,
}) {
  if (isGenerating && !roastData) {
    return (
      <div className="p-8 rounded-3xl bg-spotify-dark border border-white/10 text-center animate-pulse">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4">
          <Flame className="w-6 h-6 animate-bounce" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Analyzing your musical trauma...</h3>
        <p className="text-sm text-spotify-subtext">Gemini is roasting your 2:00 AM listening habits</p>
      </div>
    );
  }

  if (error && !roastData) {
    return (
      <div className="p-6 rounded-2xl bg-red-950/40 border border-red-500/30 text-center">
        <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
        <h4 className="text-white font-bold mb-1">Roast Generation Stumbled</h4>
        <p className="text-xs text-red-200 mb-4">{error}</p>
        <button
          onClick={() => onRegenerate(currentTone)}
          className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!roastData) {
    return (
      <div className="p-8 rounded-3xl bg-gradient-to-b from-spotify-dark to-black border border-white/10 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/20">
          <Flame className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-2xl font-black text-white mb-2 font-['Space_Grotesk']">
          Ready to Get Roasted?
        </h3>
        <p className="text-sm text-spotify-subtext max-w-md mx-auto mb-6">
          We'll feed your top tracks, tempo, and mood scores into Gemini Flash to generate a hilariously specific
          personality readout.
        </p>
        <button
          onClick={() => onRegenerate('brutal')}
          disabled={isGenerating}
          className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-black font-extrabold text-base shadow-xl shadow-amber-500/25 hover:scale-105 transition-all"
        >
          <Flame className="w-5 h-5 fill-current" />
          <span>Generate My Sonic Roast</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#1c1a1f] to-[#121214] border border-white/10 shadow-2xl p-6 sm:p-8">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5" />
            <span>AI Personality Readout</span>
          </span>
          {roastData.isMock ? (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Mock Preview (Set GEMINI_API_KEY for Live AI)
            </span>
          ) : (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Gemini 1.5 Flash
            </span>
          )}
        </div>

        {/* Tone Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10 overflow-x-auto">
          {TONES.map((t) => (
            <button
              key={t.id}
              onClick={() => onRegenerate(t.id)}
              disabled={isGenerating}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 ${
                currentTone === t.id
                  ? 'bg-amber-500 text-black font-bold shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{t.emoji}</span>
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Archetype Title */}
      <div className="mb-4 relative z-10">
        <span className="text-xs uppercase tracking-widest font-bold text-spotify-subtext block mb-1">
          Your Sonic Archetype
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-['Space_Grotesk'] bg-gradient-to-r from-amber-200 via-rose-200 to-teal-200 bg-clip-text text-transparent">
          {roastData.archetype}
        </h2>
      </div>

      {/* Burn Quote Highlight */}
      {roastData.burnQuote && (
        <div className="mb-6 p-4 rounded-2xl bg-black/50 border border-white/10 flex items-start gap-3 relative z-10">
          <Quote className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-sm sm:text-base font-medium italic text-amber-200/90 leading-snug">
            {roastData.burnQuote}
          </p>
        </div>
      )}

      {/* Main Roast Text */}
      <div className="mb-6 text-sm sm:text-base text-zinc-200 leading-relaxed space-y-3 whitespace-pre-line relative z-10">
        {roastData.roast}
      </div>

      {/* Vibe Tags */}
      {roastData.vibeTags && roastData.vibeTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8 relative z-10">
          {roastData.vibeTags.map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-zinc-300"
            >
              <Tag className="w-3 h-3 text-amber-400" />
              <span>{tag}</span>
            </span>
          ))}
        </div>
      )}

      {/* Actions: Regenerate & Proceed */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10 relative z-10">
        <button
          onClick={() => onRegenerate(currentTone)}
          disabled={isGenerating}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white font-semibold text-xs transition-all border border-white/10"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Regenerating roast...' : 'Regenerate Different Roast'}</span>
        </button>

        {onProceedToPoster && (
          <button
            onClick={onProceedToPoster}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-spotify-green hover:bg-[#1ed760] text-black font-extrabold text-sm transition-all shadow-lg shadow-spotify-green/20 hover:scale-105"
          >
            <Sparkles className="w-4 h-4 fill-current" />
            <span>Design My Poster (Next Phase)</span>
          </button>
        )}
      </div>
    </div>
  );
}
