import React, { useState } from 'react';
import { RefreshCw, Copy, Check, Sparkles, ArrowDown, Activity, Flame } from 'lucide-react';
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
    const textToCopy = `🔥 ${roastData.archetype}\n\n"${roastData.burnQuote}"\n\n${roastData.roast}\n\n— Diagnosed via Sonic Mirror`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (isGenerating && !roastData) {
    return (
      <div className="border-4 border-zine-black bg-white p-12 text-center shadow-brutal animate-pulse">
        <div className="inline-block p-3 border-2 border-zine-black bg-zine-lime mb-4">
          <RefreshCw className="w-8 h-8 animate-spin text-black" />
        </div>
        <h3 className="font-headline text-3xl sm:text-4xl uppercase tracking-wider text-black">
          CONDUCTING PSYCHOACOUSTIC AUTOPSY...
        </h3>
        <p className="font-mono text-xs uppercase text-zinc-500 mt-2">
          Consulting Gemini AI Reasoner // Parsing 3AM spirals
        </p>
      </div>
    );
  }

  if (error && !roastData) {
    return (
      <div className="border-4 border-zinc-900 bg-amber-50 p-8 text-center shadow-brutal">
        <h4 className="font-headline text-3xl uppercase tracking-wider text-red-600 mb-2">
          TELEMETRY SIGNAL LOST
        </h4>
        <p className="font-mono text-xs uppercase text-zinc-700 mb-6">{error}</p>
        <button
          onClick={() => onRegenerate(currentTone)}
          className="border-2 border-zine-black bg-zine-lime text-black font-headline text-lg uppercase tracking-wider px-6 py-2.5 shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
        >
          RETRY BIOPSY
        </button>
      </div>
    );
  }

  if (!roastData) {
    return (
      <div className="border-4 border-zine-black bg-white p-12 text-center shadow-brutal">
        <h3 className="font-headline text-4xl uppercase tracking-wider text-black mb-4">
          READY FOR YOUR PSYCHIC BIOPSY?
        </h3>
        <button
          onClick={() => onRegenerate('brutal')}
          disabled={isGenerating}
          className="border-3 border-zine-black bg-zine-lime text-black font-headline text-2xl uppercase tracking-wider px-8 py-4 shadow-brutal hover:bg-zine-pink hover:text-white transition-all"
        >
          EXECUTE CLINICAL EVALUATION
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* 1. Biopsy Header Banner */}
      <div className="border-3 border-zine-black bg-white p-5 shadow-brutal">
        <div className="flex items-center justify-between border-b-2 border-zine-black pb-3 mb-4">
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider">
            <span className="w-2.5 h-2.5 bg-zine-pink inline-block border border-black"></span>
            <span>BIOPSY PIPELINE // EVALUATION RESULT</span>
          </div>
          <span className="font-mono text-[11px] bg-zine-black text-white px-2 py-0.5 uppercase">
            STATUS: EVALUATED
          </span>
        </div>

        {/* Primary Diagnosis Headline Pill */}
        <div className="border-2 border-zine-black bg-zine-lime p-4 mb-4 shadow-brutal-sm">
          <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-800 mb-1">
            PRIMARY DIAGNOSIS:
          </div>
          <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-black leading-none">
            {roastData.archetype}
          </h2>
        </div>

        {/* Tone Selector Tabs (Clinical Brutal, 3AM Bestie, Unlicensed Therapist, Pitchfork Elitist) */}
        <div className="mb-4">
          <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-2 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-zine-pink" />
            <span>SELECT PSYCHO-TONE:</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {TONES.map((t) => (
              <button
                key={t.id}
                onClick={() => onRegenerate(t.id)}
                disabled={isGenerating}
                className={`border-2 border-zine-black p-2 font-headline text-xs sm:text-sm uppercase tracking-wider transition-all text-center ${
                  currentTone === t.id
                    ? 'bg-zine-black text-zine-lime shadow-brutal-sm font-bold -translate-y-0.5'
                    : 'bg-zinc-100 text-zinc-800 hover:bg-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Clinical Notes Container */}
        <div className="border-2 border-zine-black bg-zinc-50 p-4 sm:p-6 mb-4">
          <div className="flex justify-between items-center border-b border-zinc-300 pb-2 mb-3">
            <span className="font-mono text-xs font-bold text-zinc-700 uppercase">
              CLINICAL OBSERVATION NOTES:
            </span>
            <span className="font-mono text-[10px] text-zinc-400">REF: DSM-5-SONIC</span>
          </div>
          <p className="font-mono text-sm sm:text-base text-zinc-900 leading-relaxed whitespace-pre-line">
            {roastData.roast}
          </p>

          {/* Vibe metadata tags */}
          {roastData.vibeTags && roastData.vibeTags.length > 0 && (
            <div className="mt-4 pt-3 border-t border-dashed border-zinc-300 flex flex-wrap gap-2">
              {roastData.vibeTags.map((tag, idx) => (
                <span
                  key={idx}
                  className="border border-zine-black bg-white px-2 py-0.5 font-mono text-[10px] uppercase font-bold text-zinc-700"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action controls (Regenerate, Copy) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            onClick={() => onRegenerate(currentTone)}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-4 py-2 border-2 border-zine-black bg-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-zinc-100 transition-all shadow-brutal-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'RE-EVALUATING...' : 'REGENERATE ROAST'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-4 py-2 border-2 border-zine-black bg-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-zinc-100 transition-all shadow-brutal-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'COPIED TO CLIPBOARD' : 'COPY CLINICAL NOTE'}</span>
          </button>
        </div>

      </div>

      {/* 2. Giant Yellow Quote Callout Card */}
      {roastData.burnQuote && (
        <div className="border-4 border-zine-black bg-zine-lime p-6 sm:p-8 shadow-brutal relative">
          <div className="font-mono text-xs uppercase font-bold text-black/60 mb-2">
            TRANSCRIPT EXCERPT // ACOUSTIC BURNOUT:
          </div>
          <h3 className="font-headline text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tight text-black leading-tight">
            "{roastData.burnQuote}"
          </h3>
        </div>
      )}

      {/* 3. Open Poster Studio CTA */}
      {onProceedToPoster && (
        <button
          onClick={onProceedToPoster}
          className="w-full inline-flex items-center justify-center gap-3 px-8 py-5 border-4 border-zine-black bg-zine-pink text-white font-headline text-2xl uppercase tracking-wider shadow-brutal hover:bg-black hover:text-zine-lime transition-all"
        >
          <span>OPEN DIAGNOSTIC POSTER STUDIO</span>
          <ArrowDown className="w-6 h-6 animate-bounce" />
        </button>
      )}

    </div>
  );
}
