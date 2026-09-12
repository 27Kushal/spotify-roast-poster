import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Download, Sparkles, Share2, RefreshCw, Check, Copy } from 'lucide-react';
import { extractPaletteFromImages } from '../utils/colorExtraction';

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
  const [isRendering, setIsRendering] = useState(true);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [extractedPalette, setExtractedPalette] = useState(null);

  // Helper to load images with CORS and automatic proxy fallback
  const loadCorsImage = (url) => {
    return new Promise((resolve) => {
      if (!url) return resolve(null);

      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => resolve(img);
      img.onerror = () => {
        // Fallback to local serverless image-proxy to bypass any CDN CORS restrictions
        const proxyImg = new Image();
        proxyImg.crossOrigin = 'anonymous';
        proxyImg.onload = () => resolve(proxyImg);
        proxyImg.onerror = () => resolve(null);
        proxyImg.src = `/api/image-proxy?url=${encodeURIComponent(url)}`;
      };

      img.src = url;
    });
  };

  // Helper to wrap text into lines fitting a maxWidth
  const wrapText = (ctx, text, maxWidth) => {
    const words = text.split(' ');
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
    if (currentLine) {
      lines.push(currentLine);
    }
    return lines;
  };

  // Helper to draw rounded rectangle
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

  // Render poster on HTML5 Canvas
  const renderPoster = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || !roastData || !stats) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsRendering(true);

    // 1. Preload top 6 album cover images
    const topTracksToUse = tracks.slice(0, 6);
    const imagePromises = topTracksToUse.map((t) => {
      const imgUrl = t.album?.images?.[1]?.url || t.album?.images?.[0]?.url;
      return loadCorsImage(imgUrl);
    });

    const loadedImages = (await Promise.all(imagePromises)).filter(Boolean);

    // 2. Extract dynamic color palette from album art
    const palette = extractPaletteFromImages(loadedImages);
    setExtractedPalette(palette);

    // 3. Clear canvas & Draw background
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Base background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    bgGradient.addColorStop(0, palette.backgroundDark);
    bgGradient.addColorStop(0.5, '#0c0a10');
    bgGradient.addColorStop(1, '#050508');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Ambient radial glows from extracted colors
    const glow1 = ctx.createRadialGradient(250, 450, 50, 250, 450, 600);
    glow1.addColorStop(0, palette.glowColor || 'rgba(29, 185, 84, 0.2)');
    glow1.addColorStop(1, 'transparent');
    ctx.fillStyle = glow1;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const glow2 = ctx.createRadialGradient(850, 1100, 50, 850, 1100, 550);
    glow2.addColorStop(0, `${palette.accentSecondary}26`);
    glow2.addColorStop(1, 'transparent');
    ctx.fillStyle = glow2;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Elegant poster border frame
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, 40, 40, CANVAS_WIDTH - 80, CANVAS_HEIGHT - 80, 48);
    ctx.stroke();
    ctx.restore();

    // 4. Header: Logo & Branding
    ctx.save();
    // Glowing logo pill
    ctx.fillStyle = palette.accentPrimary;
    ctx.beginPath();
    ctx.arc(95, 110, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 36px "Space Grotesk", sans-serif';
    ctx.fillText('SONIC MIRROR', 125, 122);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '600 20px Inter, sans-serif';
    ctx.fillText('SPOTIFY PLAYLIST ROAST', 125, 154);

    // Right-aligned user / verified tag
    const userName = (user?.display_name || 'AUTHENTICATED LISTENER').toUpperCase();
    ctx.textAlign = 'right';
    ctx.fillStyle = palette.accentPrimary;
    ctx.font = '700 20px Inter, sans-serif';
    ctx.fillText(userName, CANVAS_WIDTH - 95, 122);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '500 18px Inter, sans-serif';
    ctx.fillText('AUDIO DNA ANALYSIS', CANVAS_WIDTH - 95, 154);
    ctx.restore();

    // 5. Album Art Collage (3 columns x 2 rows)
    const collageStartY = 210;
    const tileWidth = 276;
    const tileHeight = 276;
    const tileGap = 26;
    const collageStartX = (CANVAS_WIDTH - (tileWidth * 3 + tileGap * 2)) / 2;

    loadedImages.forEach((img, idx) => {
      if (idx >= 6) return;
      const col = idx % 3;
      const row = Math.floor(idx / 3);
      const x = collageStartX + col * (tileWidth + tileGap);
      const y = collageStartY + row * (tileHeight + tileGap);

      ctx.save();
      // Drop shadow for album cards
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 24;
      ctx.shadowOffsetY = 12;

      // Card rounded clip
      drawRoundedRect(ctx, x, y, tileWidth, tileHeight, 24);
      ctx.clip();
      ctx.drawImage(img, x, y, tileWidth, tileHeight);

      // Subtle inner border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();
    });

    // 6. Dynamic Color Swatches Palette Bar
    const paletteBarY = collageStartY + tileHeight * 2 + tileGap + 40;
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '600 18px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('EXTRACTED ALBUM PALETTE', CANVAS_WIDTH / 2, paletteBarY);

    const swatches = palette.swatches || ['#1DB954', '#3b82f6', '#ec4899', '#f59e0b'];
    const swatchRadius = 14;
    const swatchSpacing = 42;
    const swatchStartX = CANVAS_WIDTH / 2 - ((swatches.length - 1) * swatchSpacing) / 2;

    swatches.forEach((color, i) => {
      const cx = swatchStartX + i * swatchSpacing;
      const cy = paletteBarY + 36;
      ctx.beginPath();
      ctx.arc(cx, cy, swatchRadius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
    ctx.restore();

    // 7. Sonic Archetype Title
    const archetypeY = paletteBarY + 130;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = palette.accentPrimary;
    ctx.font = '800 22px Inter, sans-serif';
    ctx.letterSpacing = '4px';
    ctx.fillText('SONIC ARCHETYPE', CANVAS_WIDTH / 2, archetypeY);

    // Large Archetype Text
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 56px "Space Grotesk", sans-serif';
    const archetypeTitle = (roastData.archetype || 'THE CURATED AUX MENACE').toUpperCase();
    ctx.fillText(archetypeTitle, CANVAS_WIDTH / 2, archetypeY + 70);
    ctx.restore();

    // 8. Burn Quote Container (Glassmorphism Pill)
    const quoteY = archetypeY + 120;
    const quoteBoxWidth = 880;
    const quoteBoxHeight = 110;
    const quoteBoxX = (CANVAS_WIDTH - quoteBoxWidth) / 2;

    ctx.save();
    // Glass background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    drawRoundedRect(ctx, quoteBoxX, quoteY, quoteBoxWidth, quoteBoxHeight, 24);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Quote text
    ctx.textAlign = 'center';
    ctx.fillStyle = palette.accentSecondary || '#ffd166';
    ctx.font = 'italic 700 28px Inter, sans-serif';
    const burnText = roastData.burnQuote || '"100% emotional avoidance."';
    ctx.fillText(burnText, CANVAS_WIDTH / 2, quoteY + 65);
    ctx.restore();

    // 9. Main Roast Text (Line-wrapped)
    const roastStartY = quoteY + 160;
    ctx.save();
    ctx.fillStyle = '#f0f0f5';
    ctx.font = '500 28px Inter, sans-serif';
    ctx.textAlign = 'center';

    const roastLines = [];
    const paragraphs = (roastData.roast || '').split('\n').filter(Boolean);
    paragraphs.forEach((p) => {
      const wrapped = wrapText(ctx, p, 860);
      roastLines.push(...wrapped);
    });

    const maxLines = Math.min(roastLines.length, 6);
    const lineHeight = 46;
    for (let i = 0; i < maxLines; i++) {
      ctx.fillText(roastLines[i], CANVAS_WIDTH / 2, roastStartY + i * lineHeight);
    }
    ctx.restore();

    // 10. Taste Metrics Row (Bottom Cards)
    const metricsY = 1660;
    const cardWidth = 196;
    const cardHeight = 100;
    const cardGap = 24;
    const totalMetricsWidth = cardWidth * 4 + cardGap * 3;
    const metricsStartX = (CANVAS_WIDTH - totalMetricsWidth) / 2;

    const metricsData = [
      { label: 'ENERGY', val: `${stats.avgEnergy}%`, color: '#f59e0b' },
      { label: 'HAPPINESS', val: `${stats.avgValence}%`, color: '#f43f5e' },
      { label: 'TEMPO', val: `${stats.avgTempo} BPM`, color: '#a855f7' },
      { label: 'GENRE', val: (stats.dominantGenre || 'Indie').slice(0, 10), color: palette.accentPrimary },
    ];

    metricsData.forEach((m, idx) => {
      const mx = metricsStartX + idx * (cardWidth + cardGap);
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      drawRoundedRect(ctx, mx, metricsY, cardWidth, cardHeight, 18);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '700 16px Inter, sans-serif';
      ctx.fillText(m.label, mx + cardWidth / 2, metricsY + 36);

      ctx.fillStyle = m.color;
      ctx.font = '800 24px "Space Grotesk", sans-serif';
      ctx.fillText(m.val, mx + cardWidth / 2, metricsY + 76);
      ctx.restore();
    });

    // 11. Footer Watermark & Branding
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.font = '600 20px Inter, sans-serif';
    ctx.fillText('sonicmirror.app • Generated anytime with Spotify & Gemini AI', CANVAS_WIDTH / 2, 1840);
    ctx.restore();

    setIsRendering(false);
  }, [user, tracks, stats, roastData]);

  useEffect(() => {
    renderPoster();
  }, [renderPoster]);

  // Download high-resolution PNG
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

        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3000);
      },
      'image/png',
      1.0
    );
  };

  // Copy Image to Clipboard (or Native Share on mobile)
  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      // Try native Web Share API with file support (great for mobile Instagram/TikTok share!)
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
          if (err.name !== 'AbortError') {
            console.warn('Share error:', err);
          }
        }
      }

      // Fallback to Clipboard API
      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob,
          }),
        ]);
        setCopiedSuccess(true);
        setTimeout(() => setCopiedSuccess(false), 3000);
      } catch (err) {
        console.warn('Clipboard write error:', err);
        // If clipboard copy fails, fallback to download
        handleDownload();
      }
    });
  };

  return (
    <div id="poster-section" className="flex flex-col items-center w-full max-w-4xl mx-auto py-8">
      {/* Section Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-spotify-green/10 border border-spotify-green/30 text-spotify-green text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Shareable Story Card</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-['Space_Grotesk']">
          Your Sonic Mirror Poster
        </h2>
        <p className="text-sm sm:text-base text-spotify-subtext mt-2 max-w-md mx-auto">
          Rendered in 1080×1920 high resolution with an extracted color palette from your actual top album covers.
        </p>
      </div>

      {/* Poster Canvas Preview Container */}
      <div className="relative w-full max-w-[360px] sm:max-w-[420px] aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-black/60 group">
        {/* Loading Overlay */}
        {isRendering && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-20 text-center p-6">
            <RefreshCw className="w-8 h-8 text-spotify-green animate-spin mb-3" />
            <p className="text-sm font-bold text-white">Synthesizing album palette & typography...</p>
          </div>
        )}

        {/* The HTML5 Canvas */}
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="w-full h-full object-contain block select-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3.5 mt-8 w-full max-w-md">
        {/* Download Button */}
        <button
          onClick={handleDownload}
          disabled={isRendering}
          className="flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-full bg-spotify-green hover:bg-[#1ed760] text-black font-extrabold text-sm shadow-xl shadow-spotify-green/25 hover:scale-105 transition-all disabled:opacity-50"
        >
          {downloadSuccess ? (
            <>
              <Check className="w-4 h-4" />
              <span>Downloaded!</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download Poster (PNG)</span>
            </>
          )}
        </button>

        {/* Share / Copy Button */}
        <button
          onClick={handleShare}
          disabled={isRendering}
          className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all border border-white/10 hover:scale-105"
          title="Share or copy poster image"
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

        {/* Quick Regenerate Roast */}
        {onRegenerateRoast && (
          <button
            onClick={() => onRegenerateRoast(currentTone)}
            disabled={isRegenerating || isRendering}
            className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-full bg-white/5 hover:bg-white/10 text-spotify-subtext hover:text-white font-medium text-xs transition-all border border-white/5"
            title="Re-generate roast for poster"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>Regenerate Roast</span>
          </button>
        )}
      </div>

      {/* Palette Preview Pill */}
      {extractedPalette?.swatches && (
        <div className="flex items-center gap-2 mt-6 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-spotify-subtext">
          <span>Palette extracted from album art:</span>
          <div className="flex items-center gap-1.5">
            {extractedPalette.swatches.map((color, i) => (
              <span
                key={i}
                className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
