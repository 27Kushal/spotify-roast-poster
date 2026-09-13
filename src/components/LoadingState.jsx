import React, { useState, useEffect } from 'react';
import { Activity, RefreshCw } from 'lucide-react';

const WITTY_MESSAGES = [
  'EXTRACTING 3AM ACOUSTIC CO-FACTORS...',
  'CALCULATING EXACT VALENCE-TO-VALIDITY DEFICIT...',
  'CROSS-REFERENCING TOP TRACKS WITH DSM-5 LISTENER NEUROSES...',
  'CALIBRATING ROAST SPICINESS LEVEL...',
  'ISOLATING UNRESOLVED INDIE NOSTALGIA...',
  'PREPARING PSYCHOACOUSTIC AUTOPSY POSTER...',
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
      
      {/* Neo-brutalist Loading Container */}
      <div className="border-4 border-zine-black bg-white p-8 shadow-brutal max-w-md w-full mb-6">
        
        <div className="flex justify-between items-center border-b-2 border-zine-black pb-3 mb-6 font-mono text-xs font-bold uppercase">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            <span>TELEMETRY ACQUISITION</span>
          </div>
          <span className="bg-zine-lime border border-black px-1.5 py-0.5 text-black">
            STAGE 01/03
          </span>
        </div>

        {/* Spinning Box Loader */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 border-4 border-zine-black bg-zine-lime flex items-center justify-center shadow-brutal animate-spin" style={{ animationDuration: '3s' }}>
            <Activity className="w-10 h-10 text-black animate-pulse" />
          </div>
        </div>

        {/* Equalizer segmented bars */}
        <div className="flex items-end justify-center gap-2 h-10 mb-6">
          {[35, 75, 100, 60, 90, 45, 80, 55].map((height, i) => (
            <span
              key={i}
              className="w-3 bg-zine-pink border border-black transition-all duration-300"
              style={{
                height: `${height}%`,
              }}
            />
          ))}
        </div>

        <div className="border-2 border-zine-black bg-zine-cream p-4 font-mono text-xs sm:text-sm font-bold text-black uppercase tracking-wider leading-relaxed">
          {customMessage || WITTY_MESSAGES[msgIndex]}
        </div>

      </div>

      <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
        SECURE IN-BROWSER PSYCHOACOUSTIC EVALUATION // SONIC MIRROR 2026
      </p>

    </div>
  );
}
