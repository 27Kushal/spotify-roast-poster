import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Download, Sparkles, Share2, RefreshCw, Check, Palette } from 'lucide-react';
import confetti from 'canvas-confetti';
import { extractVibrantPalette } from '../utils/colorExtraction';

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1920;

export default function PosterCanvas({
  user,
  tracks = [],
  stats,
  roastData,
  currentTone,
  onRegenerateRoast,
  isRegenerating,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isRendering, setIsRendering] = useState(true);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [extractedPalette, setExtractedPalette] = useState(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // 3D Perspective Tilt on Hover
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const tiltX = (y - rect.height / 2) / 28;
    const tiltY = (rect.width / 2 - x) / 28;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Helper to load CORS-safe images with proxy fallback
  const loadCorsImage = (url) => {
    return new Promise((resolve) => {
      if (!url) return resolve(null);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => {
        const proxyImg = new Image();
        proxyImg.crossOrigin = 'anonymous';
        proxyImg.onload = () => resolve(proxyImg);
        proxyImg.onerror = () => resolve(null);
        proxyImg.src = `/api/image-proxy?url=${encodeURIComponent(url)}`;
      };
      img.src = url;
    });
  };

  // Helper: Rounded Rectangle Path
  const drawRoundedRect = (ctx, x, y, width, height, radius) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  // Helper: Text Wrapping
  const wrapText = (ctx, text, maxWidth) => {
    const words = (text || '').split(' ');
    const lines = [];
    let currentLine = words[0] || '';

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  };

  // Helper: Tactile Film Grain / Noise Overlay (5-8% opacity)
  const applyNoiseOverlay = (ctx, opacity = 0.07) => {
    const noiseCanvas = document.createElement('canvas');
    noiseCanvas.width = 256;
    noiseCanvas.height = 256;
    const nCtx = noiseCanvas.getContext('2d');
    if (!nCtx) return;

    const imgData = nCtx.createImageData(256, 256);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const val = Math.floor(Math.random() * 255);
      imgData.data[i] = val;
      imgData.data[i + 1] = val;
      imgData.data[i + 2] = val;
      imgData.data[i + 3] = 255;
    }
    nCtx.putImageData(imgData, 0, 0);

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.globalCompositeOperation = 'overlay';
    const pattern = ctx.createPattern(noiseCanvas, 'repeat');
    if (pattern) {
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
    ctx.restore();
  };

  // Helper: Render an album cover with tilt and duotone/color tint
  const drawTiltedAlbum = (ctx, img, x, y, size, angleDeg, tintColor) => {
    ctx.save();
    ctx.translate(x + size / 2, y + size / 2);
    ctx.rotate((angleDeg * Math.PI) / 180);

    // Deep drop shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
    ctx.shadowBlur = 45;
    ctx.shadowOffsetY = 24;

    // Rounded clipping
    drawRoundedRect(ctx, -size / 2, -size / 2, size, size, 24);
    ctx.clip();
    ctx.drawImage(img, -size / 2, -size / 2, size, size);

    // Subtle duotone / color-overlay tint matching the palette
    ctx.shadowColor = 'transparent';
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = tintColor;
    ctx.fillRect(-size / 2, -size / 2, size, size);

    // Subtle edge highlight
    ctx.globalAlpha = 0.25;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.restore();
  };

  // Master Render Function
  const renderPoster = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || !roastData || !stats) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsRendering(true);

    // 1. Preload top 4 album cover images
    const topTracksToUse = tracks.slice(0, 4);
    const loadedImages = (
      await Promise.all(
        topTracksToUse.map((t) => {
          const url = t.album?.images?.[1]?.url || t.album?.images?.[0]?.url;
          return loadCorsImage(url);
        })
      )
    ).filter(Boolean);

    // 2. Extract vibrant palette from album art
    const palette = extractVibrantPalette(loadedImages);
    setExtractedPalette(palette);

    // =========================================================
    // LAYER 1: Dynamic Mesh / Blob Gradient Background
    // =========================================================
    // Base dark tinted fill
    ctx.fillStyle = palette.darkBase || '#08060c';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Large organic blurred blobs (asymmetric, 40-70% opacity)
    (palette.blobs || []).forEach((b) => {
      const grad = ctx.createRadialGradient(b.x, b.y, 40, b.x, b.y, b.r);
      grad.addColorStop(0, b.color);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    });

    // Central soft ambient glow
    const centerAura = ctx.createRadialGradient(
      CANVAS_WIDTH * 0.45,
      CANVAS_HEIGHT * 0.48,
      100,
      CANVAS_WIDTH * 0.45,
      CANVAS_HEIGHT * 0.48,
      750
    );
    centerAura.addColorStop(0, `${palette.color2}44`);
    centerAura.addColorStop(1, 'transparent');
    ctx.fillStyle = centerAura;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // =========================================================
    // LAYER 2: Tactile Film Grain Texture (5-8% opacity)
    // =========================================================
    applyNoiseOverlay(ctx, 0.07);

    // =========================================================
    // LAYER 3: Minimal Header & Watermark Tag
    // =========================================================
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.font = '700 18px "Space Grotesk", sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('SONIC MIRROR // 2026 AUDIO DNA', 80, 105);

    const userName = (user?.display_name || 'AUTHENTICATED LISTENER').toUpperCase();
    ctx.textAlign = 'right';
    ctx.fillStyle = palette.color1;
    ctx.font = '800 18px "Space Grotesk", sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillText(userName, CANVAS_WIDTH - 80, 105);
    ctx.restore();

    // =========================================================
    // LAYER 4: Scattered, Overlapping Rotated Album Art Collage
    // =========================================================
    if (loadedImages.length > 0) {
      // Collage layout: 3-4 scattered cards with -7° to +6° rotation offsets
      const covers = [
        { img: loadedImages[0], x: 80, y: 155, size: 320, rot: -5, tint: palette.color1 },
        { img: loadedImages[1] || loadedImages[0], x: 340, y: 140, size: 280, rot: 5, tint: palette.color2 },
        { img: loadedImages[2] || loadedImages[0], x: 580, y: 175, size: 260, rot: -3, tint: palette.color3 },
        { img: loadedImages[3] || loadedImages[1], x: 780, y: 220, size: 220, rot: 7, tint: palette.color1 },
      ];

      covers.forEach((c) => {
        if (c.img) {
          drawTiltedAlbum(ctx, c.img, c.x, c.y, c.size, c.rot, c.tint);
        }
      });
    }

    // =========================================================
    // LAYER 5: Giant Dominant Archetype Headline (The Focal Point)
    // =========================================================
    const headlineY = 560;
    ctx.save();
    ctx.fillStyle = '#ffffff';
    // Huge Archivo Black display font (dominates 40-50% of the poster)
    ctx.font = '900 96px "Archivo Black", sans-serif';
    ctx.letterSpacing = '-2px';
    ctx.textAlign = 'left';

    // Deep contrast shadow behind title
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 10;

    const archetype = (roastData.archetype || 'THE CURATED MELTDOWN').toUpperCase();
    const headlineLines = wrapText(ctx, archetype, 920);

    headlineLines.forEach((line, idx) => {
      ctx.fillText(line, 80, headlineY + idx * 105);
    });

    const headlineBottomY = headlineY + headlineLines.length * 105;
    ctx.restore();

    // =========================================================
    // LAYER 6: Borderless Pull-Quote (Directly on Gradient)
    // =========================================================
    const quoteY = headlineBottomY + 40;
    ctx.save();
    ctx.textAlign = 'left';
    ctx.fillStyle = palette.color2 || '#ffd166';
    ctx.font = 'italic 700 38px "Inter", sans-serif';

    // Shadow for legibility over gradient
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 20;

    const burnQuote = roastData.burnQuote || '"100% emotional avoidance."';
    const quoteLines = wrapText(ctx, burnQuote, 920);
    quoteLines.slice(0, 2).forEach((line, idx) => {
      ctx.fillText(line, 80, quoteY + idx * 52);
    });

    const quoteBottomY = quoteY + quoteLines.length * 52;
    ctx.restore();

    // =========================================================
    // LAYER 7: Editorial Roast Paragraph
    // =========================================================
    const roastY = quoteBottomY + 50;
    ctx.save();
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = '500 28px "Inter", sans-serif';

    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 18;

    const roastLines = [];
    const paragraphs = (roastData.roast || '').split('\n').filter(Boolean);
    paragraphs.forEach((p) => {
      const wrapped = wrapText(ctx, p, 920);
      roastLines.push(...wrapped);
    });

    const maxLines = Math.min(roastLines.length, 5);
    for (let i = 0; i < maxLines; i++) {
      ctx.fillText(roastLines[i], 80, roastY + i * 46);
    }
    ctx.restore();

    // =========================================================
    // LAYER 8: Inline Clean Stats (No Boxes, No Borders)
    // =========================================================
    const statsY = 1630;
    const statsItems = [
      { num: `${stats.avgEnergy}%`, label: 'ENERGY', color: palette.color1 },
      { num: `${stats.avgValence}%`, label: 'HAPPINESS', color: palette.color2 },
      { num: `${stats.avgTempo}`, label: 'BPM TEMPO', color: palette.color3 },
    ];

    const statSpacing = 310;
    statsItems.forEach((st, idx) => {
      const sx = 80 + idx * statSpacing;
      ctx.save();
      ctx.textAlign = 'left';

      // Big bold number directly on gradient
      ctx.fillStyle = st.color;
      ctx.font = '900 80px "Archivo Black", sans-serif';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 24;
      ctx.fillText(st.num, sx, statsY);

      // Clean supporting label underneath
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '700 18px "Space Grotesk", sans-serif';
      ctx.letterSpacing = '3px';
      ctx.shadowBlur = 0;
      ctx.fillText(st.label, sx, statsY + 36);
      ctx.restore();
    });

    // =========================================================
    // LAYER 9: Minimal Subtle Corner Watermark
    // =========================================================
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.font = '600 18px "Space Grotesk", sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillText('● SONIC MIRROR', 80, 1840);

    ctx.textAlign = 'right';
    ctx.fillText('SPOTIFY WRAPPED 24/7', CANVAS_WIDTH - 80, 1840);
    ctx.restore();

    setIsRendering(false);
  }, [user, tracks, stats, roastData]);

  useEffect(() => {
    renderPoster();
  }, [renderPoster]);

  // Download High-Resolution PNG
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const safeArchetype = (roastData?.archetype || 'sonic-mirror-roast')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-');
        a.download = `${safeArchetype}-poster.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: [extractedPalette?.color1 || '#1DB954', extractedPalette?.color2 || '#ec4899', '#ffffff'],
        });

        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3000);
      },
      'image/png',
      1.0
    );
  };

  // Share / Copy Image
  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const file = new File([blob], 'sonic-mirror-roast.png', { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'My Sonic Mirror Roast',
            text: `Look what Gemini said about my Spotify music taste! #${roastData?.archetype?.replace(/\s+/g, '') || 'SonicMirror'}`,
          });
          return;
        } catch (err) {
          if (err.name !== 'AbortError') console.warn('Share error:', err);
        }
      }

      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setCopiedSuccess(true);
        setTimeout(() => setCopiedSuccess(false), 3000);
      } catch (err) {
        console.warn('Clipboard write error:', err);
        handleDownload();
      }
    });
  };

  return (
    <div id="poster-section" className="flex flex-col items-center w-full max-w-5xl mx-auto py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-spotify-green/10 border border-spotify-green/30 text-spotify-green text-xs font-mono font-bold tracking-widest uppercase mb-3">
          <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
          <span>Spotify Wrapped Quality Graphic</span>
        </div>
        <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight font-archivo">
          Your Shareable <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-300">Mood Board</span>
        </h2>
        <p className="text-sm sm:text-base text-zinc-400 mt-2 max-w-lg mx-auto font-sans">
          Organic mesh gradient derived from your album art, scattered tilted collage, and bold Archivo typography.
        </p>
      </div>

      {/* 3D Perspective Tilt Card */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 0.15s ease-out',
        }}
        className="relative w-full max-w-[380px] sm:max-w-[440px] aspect-[9/16] rounded-[36px] p-2 bg-gradient-to-b from-white/20 via-white/5 to-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.85)] border border-white/20 group"
      >
        <div className="relative w-full h-full rounded-[28px] overflow-hidden bg-black flex items-center justify-center">
          {isRendering && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center z-20 text-center p-6">
              <RefreshCw className="w-8 h-8 text-spotify-green animate-spin mb-3" />
              <p className="text-sm font-bold text-white font-grotesk">Synthesizing mesh gradient & typography...</p>
            </div>
          )}

          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="w-full h-full object-contain block select-none pointer-events-none"
          />

          {/* Light Sheen */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-8 w-full max-w-md">
        <button
          onClick={handleDownload}
          disabled={isRendering}
          className="flex-1 inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-gradient-to-r from-spotify-green to-emerald-400 hover:from-[#1ed760] hover:to-emerald-300 text-black font-black text-sm shadow-xl shadow-spotify-green/25 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          {downloadSuccess ? (
            <>
              <Check className="w-5 h-5" />
              <span>Downloaded 1080x1920 PNG!</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span>Download Poster (PNG)</span>
            </>
          )}
        </button>

        <button
          onClick={handleShare}
          disabled={isRendering}
          className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-all border border-white/10 hover:scale-105 active:scale-95"
          title="Share or copy poster"
        >
          {copiedSuccess ? (
            <>
              <Check className="w-4 h-4 text-spotify-green" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </>
          )}
        </button>

        {onRegenerateRoast && (
          <button
            onClick={() => onRegenerateRoast(currentTone)}
            disabled={isRegenerating || isRendering}
            className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white font-semibold text-xs transition-all border border-white/5"
            title="Generate a new roast"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>Remix Roast</span>
          </button>
        )}
      </div>

      {/* Extracted Palette Indicator */}
      {extractedPalette && (
        <div className="flex items-center gap-3 mt-6 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-400 backdrop-blur-md">
          <Palette className="w-3.5 h-3.5 text-spotify-green" />
          <span>Extracted Palette:</span>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: extractedPalette.color1 }} title={extractedPalette.color1} />
            <span className="w-4 h-4 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: extractedPalette.color2 }} title={extractedPalette.color2} />
            <span className="w-4 h-4 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: extractedPalette.color3 }} title={extractedPalette.color3} />
          </div>
        </div>
      )}
    </div>
  );
}
