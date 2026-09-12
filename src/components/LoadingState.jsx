import React, { useState, useEffect } from 'react';
import { Sparkles, Disc } from 'lucide-react';

const WITTY_MESSAGES = [
  'Consulting the algorithmic music gods...',
  'Analyzing your questionable 2:00 AM listening habits...',
  'Calculating exact percentage of sad-girl indie energy...',
  'Cross-referencing your top tracks with universal shame indexes...',
  'Calibrating roast spiciness...',
  'Extracting album art hex palettes...',
  'Preparing your sonic indictment...',
];

export default function LoadingState({ customMessage }) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    if (customMessage) return;
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % WITTY_MESSAGES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [customMessage]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      {/* Spinning holographic vinyl disc animation */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#111] via-[#1a1a24] to-[#0a0a0f] border-2 border-white/20 shadow-2xl flex items-center justify-center animate-spin" style={{ animationDuration: '4s' }}>
          {/* Vinyl grooves */}
          <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-spotify-green/20 border border-spotify-green flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-white/80" />
            </div>
          </div>
        </div>

        {/* Ambient glow behind vinyl */}
        <div className="absolute inset-0 bg-spotify-green/30 rounded-full blur-xl animate-pulse" />
      </div>

      {/* Equalizer animation */}
      <div className="flex items-end justify-center gap-1.5 h-10 mb-6">
        {[40, 75, 100, 60, 85, 45, 90, 65, 30].map((height, i) => (
          <span
            key={i}
            className="w-1.5 bg-gradient-to-t from-spotify-green via-emerald-300 to-teal-200 rounded-full animate-pulse"
            style={{
              height: `${height}%`,
              animationDelay: `${i * 120}ms`,
              animationDuration: '0.9s',
            }}
          />
        ))}
      </div>

      <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-spotify-green/10 border border-spotify-green/30 text-spotify-green text-xs font-mono font-bold tracking-widest uppercase">
        <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
        <span>SONIC MIRROR AI ENGINE</span>
      </div>

      <h3 className="text-2xl sm:text-3xl font-black text-white font-syne max-w-lg transition-all duration-300">
        {customMessage || WITTY_MESSAGES[msgIndex]}
      </h3>
      <p className="text-xs font-mono text-zinc-500 mt-2 tracking-wide">
        PROCESSING SPOTIFY METRICS IN YOUR BROWSER
      </p>
    </div>
  );
}
