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
          active: 'bg-[#FF007F] text-white shadow-[3px_3px_0px_#000] border-black font-bold',
          inactive: 'hover:border-[#FF007F] hover:text-pink-600',
        };
      case 'bestie':
        return {
          active: 'bg-[#00F0FF] text-black shadow-[3px_3px_0px_#000] border-black font-bold',
          inactive: 'hover:border-[#00F0FF] hover:text-cyan-700',
        };
      case 'therapist':
        return {
          active: 'bg-[#FF6D00] text-white shadow-[3px_3px_0px_#000] border-black font-bold',
          inactive: 'hover:border-[#FF6D00] hover:text-orange-600',
        };
      case 'critic':
        return {
          active: 'bg-[#5A189A] text-white shadow-[3px_3px_0px_#000] border-black font-bold',
          inactive: 'hover:border-[#5A189A] hover:text-purple-600',
        };
      default:
        return {
          active: 'bg-[#CCFF00] text-black shadow-[3px_3px_0px_#000] border-black font-bold',
          inactive: 'hover:border-black',
        };
    }
  };

  const tagColors = [
    'bg-[#FF007F] text-white border-black',
    'bg-[#CCFF00] text-black border-black',
    'bg-[#00F0FF] text-black border-black',
    'bg-[#5A189A] text-white border-black',
    'bg-[#FF6D00] text-white border-black',
  ];

  if (isGenerating && !roastData) {
    return (
      <div className="border-4 border-black bg-white text-black p-12 text-center shadow-[8px_8px_0px_#000] animate-pulse">
        <div className="inline-block p-4 border-3 border-black bg-[#CCFF00] mb-4 shadow-[3px_3px_0px_#000]">
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
      <div className="border-4 border-black bg-amber-200 text-black p-8 text-center shadow-[8px_8px_0px_#000]">
        <h4 className="font-headline text-3xl uppercase tracking-wider text-red-600 mb-2">
          TELEMETRY SIGNAL LOST
        </h4>
        <p className="font-mono text-xs uppercase text-zinc-800 mb-6 font-bold">{error}</p>
        <button
          onClick={() => onRegenerate(currentTone)}
          className="border-3 border-black bg-[#CCFF00] text-black font-headline text-lg uppercase tracking-wider px-6 py-3 shadow-[4px_4px_0px_#000] hover:bg-[#FF007F] hover:text-white transition-all"
        >
          RETRY BIOPSY
        </button>
      </div>
    );
  }

  if (!roastData) {
    return (
      <div className="border-4 border-black bg-white text-black p-12 text-center shadow-[8px_8px_0px_#000]">
        <h3 className="font-headline text-4xl uppercase tracking-wider text-black mb-4">
          READY FOR YOUR PSYCHIC BIOPSY?
        </h3>
        <button
          onClick={() => onRegenerate('brutal')}
          disabled={isGenerating}
          className="border-4 border-black bg-[#CCFF00] text-black font-headline text-2xl uppercase tracking-wider px-8 py-4 shadow-[6px_6px_0px_#000] hover:bg-[#FF007F] hover:text-white transition-all"
        >
          EXECUTE CLINICAL EVALUATION
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* 1. Biopsy Header Banner (White card with bold black borders and colorful badges) */}
      <div className="border-4 border-black bg-white text-black p-5 sm:p-6 shadow-[8px_8px_0px_#000]">
        
        <div className="flex items-center justify-between border-b-3 border-black pb-3 mb-4">
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider">
            <span className="w-3 h-3 bg-[#FF007F] inline-block border-2 border-black"></span>
            <span>BIOPSY PIPELINE // EVALUATION RESULT</span>
          </div>
          <span className="font-mono text-xs bg-[#5A189A] text-white px-2.5 py-0.5 uppercase font-bold border-2 border-black shadow-[2px_2px_0px_#000]">
            STAGE 2: EVALUATED
          </span>
        </div>

        {/* Primary Diagnosis Headline Block in Hot Magenta (Like the Poster!) */}
        <div className="border-4 border-black bg-[#FF007F] text-white p-5 sm:p-6 mb-5 shadow-[6px_6px_0px_#000] relative">
          <div className="font-mono text-[11px] font-bold uppercase tracking-widest text-white/90 mb-1 flex items-center justify-between">
            <span>PRIMARY PSYCHOACOUSTIC DIAGNOSIS:</span>
            <span className="bg-[#CCFF00] text-black border-2 border-black px-2 py-0.5 text-[10px] font-bold shadow-[2px_2px_0px_#000]">
              DSM-5 CERTIFIED
            </span>
          </div>
          <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white leading-none drop-shadow-sm">
            {roastData.archetype}
          </h2>

          {/* Rotated Green Stamp Badge */}
          <div className="absolute -right-3 -bottom-4 bg-[#CCFF00] text-black border-3 border-black font-headline text-xs px-2.5 py-1 rotate-6 shadow-[3px_3px_0px_#000] select-none uppercase tracking-wider">
            CONFIRMED
          </div>
        </div>

        {/* Tone Selector with Distinct Saturated Colors per Tone */}
        <div className="mb-5">
          <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-700 mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-[#FF007F]" />
              <span>SELECT PSYCHO-TONE ASSIGNMENT:</span>
            </div>
            <span className="text-[10px] text-zinc-500 uppercase font-bold">CLICK TO RE-ROLL</span>
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
                  className={`border-3 border-black p-2.5 font-headline text-xs sm:text-sm uppercase tracking-wider transition-all text-center flex flex-col items-center justify-center gap-1 ${
                    isSelected
                      ? `${toneStyle.active} -translate-y-1`
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
        <div className="border-3 border-black bg-zinc-50 p-4 sm:p-6 mb-5 relative">
          
          <div className="flex justify-between items-center border-b-2 border-zinc-200 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF007F]"></span>
              <span className="font-mono text-xs font-bold text-zinc-800 uppercase">
                CLINICAL OBSERVATION NOTES:
              </span>
            </div>
            <span className="font-mono text-[10px] font-bold bg-[#CCFF00] text-black px-2 py-0.5 uppercase border border-black shadow-[2px_2px_0px_#000]">
              CONFIDENTIAL REPORT
            </span>
          </div>

          <p className="font-mono text-sm sm:text-base text-zinc-950 leading-relaxed whitespace-pre-line font-medium">
            {roastData.roast}
          </p>

          {/* Vibe metadata tags with colorful poster chips */}
          {roastData.vibeTags && roastData.vibeTags.length > 0 && (
            <div className="mt-4 pt-3 border-t-2 border-dashed border-zinc-300 flex flex-wrap gap-2">
              {roastData.vibeTags.map((tag, idx) => {
                const colorClass = tagColors[idx % tagColors.length];
                return (
                  <span
                    key={idx}
                    className={`border-2 border-black px-2.5 py-1 font-mono text-[11px] uppercase font-bold shadow-[2px_2px_0px_#000] ${colorClass}`}
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
            className="inline-flex items-center gap-2 px-5 py-2.5 border-3 border-black bg-[#CCFF00] text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#FF007F] hover:text-white transition-all shadow-[3px_3px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'RE-EVALUATING...' : 'REGENERATE ROAST'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-5 py-2.5 border-3 border-black bg-white hover:bg-zinc-100 font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[3px_3px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5"
          >
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'COPIED TO CLIPBOARD!' : 'COPY CLINICAL NOTE'}</span>
          </button>
        </div>

      </div>

      {/* 2. Giant Quote Callout Card in Solar Orange (Poster Accent) */}
      {roastData.burnQuote && (
        <div className="border-4 border-black bg-[#FF6D00] text-white p-6 sm:p-8 shadow-[8px_8px_0px_#000] relative overflow-hidden">
          
          {/* Top Stamp */}
          <div className="flex justify-between items-center mb-3">
            <div className="font-mono text-xs uppercase font-bold bg-black text-[#CCFF00] px-2.5 py-1 border border-black shadow-[2px_2px_0px_#000]">
              TRANSCRIPT EXCERPT // ACOUSTIC BURNOUT
            </div>
            <div className="bg-[#CCFF00] text-black border-2 border-black font-headline text-xs px-2.5 py-1 rotate-3 shadow-[2px_2px_0px_#000]">
              ★ 100% CERTIFIED BURN ★
            </div>
          </div>

          <h3 className="font-headline text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tight text-white leading-tight drop-shadow">
            "{roastData.burnQuote}"
          </h3>
        </div>
      )}

      {/* 3. Open Poster Studio CTA in Radiant Acid Lime (Poster Accent) */}
      {onProceedToPoster && (
        <button
          onClick={onProceedToPoster}
          className="w-full inline-flex items-center justify-center gap-3 px-8 py-5 border-4 border-black bg-[#CCFF00] text-black font-headline text-2xl uppercase tracking-wider shadow-[6px_6px_0px_#000] hover:bg-[#FF007F] hover:text-white transition-all hover:translate-x-1 hover:translate-y-1"
        >
          <span>OPEN DIAGNOSTIC POSTER STUDIO</span>
          <ArrowDown className="w-6 h-6 animate-bounce" />
        </button>
      )}

    </div>
  );
}
