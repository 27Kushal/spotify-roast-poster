import React, { useState } from 'react';
import { RefreshCw, Copy, Check, Sparkles } from 'lucide-react';
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
      <div className="w-full text-center py-24 animate-pulse border-b border-static-grey">
        <h3 className="text-4xl md:text-6xl font-display uppercase tracking-wider text-static-grey">ANALYZING YOUR TASTE...</h3>
        <p className="text-sm text-sleeve-white/50 uppercase mt-4">Consulting Gemini Flash</p>
      </div>
    );
  }

  if (error && !roastData) {
    return (
      <div className="w-full text-center py-24 border-b border-static-grey">
        <h4 className="text-4xl md:text-6xl font-display uppercase tracking-wider text-amber-tube mb-4">SIGNAL LOST</h4>
        <p className="text-sm text-sleeve-white/70 mb-8 uppercase tracking-widest">{error}</p>
        <button
          onClick={() => onRegenerate(currentTone)}
          className="border-b-2 border-studio-glow text-studio-glow font-display text-2xl uppercase tracking-wider hover:bg-studio-glow hover:text-void transition-all px-4 py-2"
        >
          RETRY CONNECTION
        </button>
      </div>
    );
  }

  if (!roastData) {
    return (
      <div className="w-full py-24 text-center border-b border-static-grey flex flex-col items-center">
        <h3 className="text-5xl md:text-7xl font-display uppercase tracking-wider text-sleeve-white mb-6">
          READY FOR THE VERDICT?
        </h3>
        <button
          onClick={() => onRegenerate('brutal')}
          disabled={isGenerating}
          className="group inline-flex flex-col items-center border-b border-studio-glow pb-2 hover:border-b-4 transition-all"
        >
          <span className="font-display text-4xl uppercase text-studio-glow">GENERATE DIAGNOSIS</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col pt-12 pb-24 border-b border-static-grey">
      
      {/* Editorial Roast Header */}
      <div className="flex flex-col md:flex-row gap-8 mb-16 relative">
        <div className="flex-1">
          <h2 className="text-6xl sm:text-8xl md:text-[120px] font-display uppercase leading-[0.85] tracking-tight mb-8">
            "{roastData.burnQuote || roastData.archetype}"
          </h2>
          <div className="text-base sm:text-lg text-sleeve-white/90 leading-relaxed max-w-2xl whitespace-pre-line border-l border-studio-glow pl-6">
            {roastData.roast}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-12">
          
          {/* Tone Selector */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-static-grey mb-3">TONE SETTING</h4>
            <div className="flex flex-col gap-2">
              {TONES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onRegenerate(t.id)}
                  disabled={isGenerating}
                  className={`text-left uppercase tracking-wider text-sm border-b pb-1 transition-all flex items-center justify-between ${
                    currentTone === t.id
                      ? t.id === 'brutal' ? 'border-amber-tube text-amber-tube font-bold' : 'border-studio-glow text-studio-glow font-bold'
                      : 'border-transparent text-static-grey hover:text-sleeve-white hover:border-static-grey'
                  }`}
                >
                  <span>{t.label}</span>
                  {currentTone === t.id && <span className="w-1.5 h-1.5 bg-current rounded-full" />}
                </button>
              ))}
            </div>
          </div>

          {/* Vibe Tags */}
          {roastData.vibeTags && roastData.vibeTags.length > 0 && (
            <div>
              <h4 className="text-xs uppercase tracking-widest text-static-grey mb-3">VIBE METADATA</h4>
              <div className="text-sm uppercase tracking-wider text-sleeve-white/80 leading-loose">
                {roastData.vibeTags.join(' / ')}
              </div>
            </div>
          )}
          
          {/* Controls */}
          <div className="flex flex-col gap-4 mt-auto">
             <button
                onClick={() => onRegenerate(currentTone)}
                disabled={isGenerating}
                className="flex items-center gap-2 text-xs uppercase tracking-widest text-static-grey hover:text-sleeve-white transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isGenerating ? 'GENERATING...' : 'REGENERATE'}</span>
              </button>

              <button
                onClick={handleCopy}
                className="flex items-center gap-2 text-xs uppercase tracking-widest text-static-grey hover:text-sleeve-white transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-studio-glow" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'COPIED TO CLIPBOARD' : 'COPY ROAST'}</span>
              </button>
          </div>
        </div>
      </div>

      {/* Proceed to Poster CTA */}
      {onProceedToPoster && (
        <div className="flex justify-center mt-8">
          <button
            onClick={onProceedToPoster}
            className="group flex items-center gap-4 px-8 py-4 border border-studio-glow text-studio-glow hover:bg-studio-glow hover:text-void transition-all duration-300"
          >
            <span className="font-display text-4xl uppercase tracking-wider translate-y-1">OPEN STUDIO POSTER</span>
            <Sparkles className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}
