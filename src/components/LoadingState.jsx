import React, { useState, useEffect } from 'react';
import { Sparkles, Music } from 'lucide-react';

const WITTY_MESSAGES = [
  'Consulting the music gods...',
  'Analyzing your questionable 2:00 AM music choices...',
  'Calculating exact percentage of sad-girl indie...',
  'Cross-referencing your guilty pleasures with standard shame indexes...',
  'Interrogating your top artists...',
  'Calibrating roast spiciness...',
  'Generating your sonic portrait...',
];

export default function LoadingState({ customMessage }) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    if (customMessage) return;
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % WITTY_MESSAGES.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [customMessage]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center">
      {/* Equalizer animation */}
      <div className="flex items-end justify-center gap-1.5 h-14 mb-8">
        {[40, 75, 100, 60, 85, 45, 90].map((height, i) => (
          <span
            key={i}
            className="w-2 bg-gradient-to-t from-spotify-green to-emerald-300 rounded-full animate-pulse"
            style={{
              height: `${height}%`,
              animationDelay: `${i * 150}ms`,
              animationDuration: '1.2s',
            }}
          />
        ))}
      </div>

      <div className="flex items-center gap-2 mb-3 text-spotify-green">
        <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '3s' }} />
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Sonic Mirror AI</span>
      </div>

      <h3 className="text-xl md:text-2xl font-bold text-white max-w-md transition-all duration-300">
        {customMessage || WITTY_MESSAGES[msgIndex]}
      </h3>
      <p className="text-sm text-spotify-subtext mt-2">
        Crunching your Spotify audio features & top rotation
      </p>
    </div>
  );
}
