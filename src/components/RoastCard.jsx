import React, { useState } from 'react';
import { RefreshCw, Copy, Check, Sparkles, ArrowDown, Activity, Flame, Zap, HeartHandshake, Skull, MessageCircleQuestion } from 'lucide-react';
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

  const getToneStyle = (toneId) => {
    switch (toneId) {
      case 'brutal':
        return {
          active: 'bg-zine-pink text-white shadow-brutal-pink border-zine-black',
          inactive: 'hover:border-zine-pink hover:text-zine-pink',
          tag: 'bg-pink-100 text-pink-700',
        };
      case 'bestie':
        return {
          active: 'bg-zine-cyan text-black shadow-brutal-cyan border-zine-black',
          inactive: 'hover:border-zine-cyan hover:text-cyan-700',
          tag: 'bg-cyan-100 text-cyan-800',
        };
      case 'therapist':
        return {
          active: 'bg-zine-orange text-white shadow-brutal-orange border-zine-black',
          inactive: 'hover:border-zine-orange hover:text-orange-600',
          tag: 'bg-orange-100 text-orange-800',
        };
      case 'critic':
        return {
          active: 'bg-zine-purple text-white shadow-brutal-purple border-zine-black',
          inactive: 'hover:border-zine-purple hover:text-purple-600',
          tag: 'bg-purple-100 text-purple-800',
        };
      default:
        return {
          active: 'bg-zine-lime text-black shadow-brutal-lime border-zine-black',
          inactive: 'hover:border-black',
          tag: 'bg-yellow-100 text-yellow-800',
        };
    }
  };

  const tagColors = [
    'bg-zine-pink/15 text-pink-700 border-pink-400',
    'bg-zine-cyan/25 text-cyan-900 border-cyan-400',
    'bg-zine-lime/30 text-lime-900 border-lime-500',
    'bg-zine-purple/15 text-purple-800 border-purple-400',
    'bg-zine-orange/15 text-orange-800 border-orange-400',
  ];

  if (isGenerating && !roastData) {
    return (
      <div className="border-4 border-zine-black bg-white p-12 text-center shadow-brutal-purple animate-pulse">
        <div className="inline-block p-4 border-3 border-zine-black bg-zine-lime mb-4 shadow-brutal-sm">
          <RefreshCw className="w-8 h-8 animate-spin text-black" />
        </div>
        <h3 className="font-headline text-3xl sm:text-4xl uppercase tracking-wider text-black">
          CONDUCTING PSYCHOACOUSTIC AUTOPSY...
        </h3>
        <p className="font-mono text-xs uppercase text-zinc-600 mt-2 font-bold">
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
          className="border-2 border-zine-black bg-zine-lime text-black font-headline text-lg uppercase tracking-wider px-6 py-2.5 shadow-brutal hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
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
      <div className="border-4 border-zine-black bg-white p-5 sm:p-6 shadow-brutal-purple">
        
        <div className="flex items-center justify-between border-b-3 border-zine-black pb-3 mb-4">
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider">
            <span className="w-3 h-3 bg-zine-pink inline-block border-2 border-black"></span>
            <span>BIOPSY PIPELINE // EVALUATION RESULT</span>
          </div>
          <span className="font-mono text-xs bg-zine-black text-zine-lime px-2.5 py-0.5 uppercase font-bold border border-black shadow-brutal-sm">
            STAGE 2: EVALUATED
          </span>
        </div>

        {/* Primary Diagnosis Headline Pill in Radiant Lime */}
        <div className="border-3 border-zine-black bg-zine-lime p-4 sm:p-5 mb-5 shadow-brutal relative">
          <div className="font-mono text-[11px] font-bold uppercase tracking-widest text-zinc-900 mb-1 flex items-center justify-between">
            <span>PRIMARY PSYCHOACOUSTIC DIAGNOSIS:</span>
            <span className="bg-black text-white px-1.5 py-0.5 text-[10px]">DSM-5 CERTIFIED</span>
          </div>
          <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-black leading-none">
            {roastData.archetype}
          </h2>
        </div>

        {/* Tone Selector with Distinct Saturated Colors per Tone */}
        <div className="mb-5">
          <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-700 mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-zine-pink" />
              <span>SELECT PSYCHO-TONE ASSIGNMENT:</span>
            </div>
            <span className="text-[10px] text-zinc-500 uppercase">CLICK TO RE-ROLL</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {TONES.map((t) => {
              const toneStyle = getToneStyle(t.id);
              const isSelected = currentTone === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => onRegenerate(t.id)}
                  disabled={isGenerating}
                  className={`border-3 border-zine-black p-2.5 font-headline text-xs sm:text-sm uppercase tracking-wider transition-all text-center flex flex-col items-center justify-center gap-1 ${
                    isSelected
                      ? `${toneStyle.active} -translate-y-1 font-bold`
                      : `bg-zinc-100 text-zinc-800 hover:bg-white ${toneStyle.inactive}`
                  }`}
                >
                  <span>{t.label}</span>
                  {isSelected && <span className="w-1.5 h-1.5 bg-current rounded-full animate-ping" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Clinical Notes Container with Left Color Border */}
        <div className="border-3 border-zine-black bg-zinc-50 p-4 sm:p-6 mb-5 relative">
          
          <div className="flex justify-between items-center border-b-2 border-zinc-200 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-zine-pink"></span>
              <span className="font-mono text-xs font-bold text-zinc-800 uppercase">
                CLINICAL OBSERVATION NOTES:
              </span>
            </div>
            <span className="font-mono text-[10px] font-bold bg-zinc-200 text-zinc-700 px-1.5 py-0.5 uppercase">
              CONFIDENTIAL REPORT
            </span>
          </div>

          <p className="font-mono text-sm sm:text-base text-zinc-950 leading-relaxed whitespace-pre-line font-medium">
            {roastData.roast}
          </p>

          {/* Vibe metadata tags with colorful pill chips */}
          {roastData.vibeTags && roastData.vibeTags.length > 0 && (
            <div className="mt-4 pt-3 border-t-2 border-dashed border-zinc-300 flex flex-wrap gap-2">
              {roastData.vibeTags.map((tag, idx) => {
                const colorClass = tagColors[idx % tagColors.length];
                return (
                  <span
                    key={idx}
                    className={`border-2 border-zine-black px-2.5 py-1 font-mono text-[11px] uppercase font-bold shadow-brutal-sm ${colorClass}`}
                  >
                    #{tag}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Action controls (Regenerate, Copy) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <button
            onClick={() => onRegenerate(currentTone)}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-zine-black bg-zine-yellow text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-white transition-all shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'RE-EVALUATING...' : 'REGENERATE ROAST'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-zine-black bg-white hover:bg-zinc-100 font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5"
          >
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'COPIED TO CLIPBOARD!' : 'COPY CLINICAL NOTE'}</span>
          </button>
        </div>

      </div>

      {/* 2. Giant Quote Callout Card in Solar Orange & Acid Lime */}
      {roastData.burnQuote && (
        <div className="border-4 border-zine-black bg-zine-orange text-white p-6 sm:p-8 shadow-brutal relative overflow-hidden">
          
          {/* Top Stamp */}
          <div className="flex justify-between items-center mb-3">
            <div className="font-mono text-xs uppercase font-bold bg-black text-zine-lime px-2 py-0.5 border border-black shadow-brutal-sm">
              TRANSCRIPT EXCERPT // ACOUSTIC BURNOUT
            </div>
            <div className="bg-zine-yellow text-black border-2 border-black font-headline text-xs px-2 py-0.5 rotate-3 shadow-brutal-sm">
              ★ 100% CERTIFIED BURN ★
            </div>
          </div>

          <h3 className="font-headline text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tight text-white leading-tight">
            "{roastData.burnQuote}"
          </h3>
        </div>
      )}

      {/* 3. Open Poster Studio CTA in Punchy Magenta */}
      {onProceedToPoster && (
        <button
          onClick={onProceedToPoster}
          className="w-full inline-flex items-center justify-center gap-3 px-8 py-5 border-4 border-zine-black bg-zine-pink text-white font-headline text-2xl uppercase tracking-wider shadow-brutal hover:bg-black hover:text-zine-lime transition-all hover:translate-x-1 hover:translate-y-1"
        >
          <span>OPEN DIAGNOSTIC POSTER STUDIO</span>
          <ArrowDown className="w-6 h-6 animate-bounce" />
        </button>
      )}

    </div>
  );
}
