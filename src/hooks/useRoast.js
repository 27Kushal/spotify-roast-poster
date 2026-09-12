import { useState, useCallback } from 'react';

const TONES = [
  { id: 'brutal', label: 'Brutal Roast', emoji: '🔥' },
  { id: 'therapist', label: 'Unlicensed Therapist', emoji: '🛋️' },
  { id: 'indie_snob', label: 'Vinyl Snob', emoji: '☕' },
  { id: 'existential', label: 'Existential Dread', emoji: '🌌' },
];

export { TONES };

export function useRoast(stats, tracks, artists) {
  const [roastData, setRoastData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [currentTone, setCurrentTone] = useState('brutal');

  const generateRoast = useCallback(
    async (toneToUse = currentTone) => {
      if (!stats || !tracks || tracks.length === 0) return;

      setIsGenerating(true);
      setError(null);
      setCurrentTone(toneToUse);

      try {
        const payload = {
          stats,
          topTracks: tracks.slice(0, 10).map((t) => ({
            name: t.name,
            artists: t.artists?.map((a) => ({ name: a.name })),
          })),
          topArtists: artists.slice(0, 6).map((a) => ({ name: a.name })),
          tone: toneToUse,
        };

        const res = await fetch('/api/generate-roast', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || data.message || 'Failed to generate roast');
        }

        setRoastData(data);
        return data;
      } catch (err) {
        console.error('Roast generation error:', err);
        setError(err.message || 'Error communicating with Gemini');
      } finally {
        setIsGenerating(false);
      }
    },
    [stats, tracks, artists, currentTone]
  );

  return {
    roastData,
    isGenerating,
    error,
    currentTone,
    generateRoast,
    regenerate: (tone) => generateRoast(tone || currentTone),
  };
}
