import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Download, Sparkles, Share2, RefreshCw, Check, Palette, Disc, Layers, Receipt } from 'lucide-react';
import confetti from 'canvas-confetti';
import { extractPaletteFromImages } from '../utils/colorExtraction';

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1920;

const TEMPLATES = [
  { id: 'cyber', name: 'Cyber Zine', icon: Layers, desc: 'Acid-editorial, bold typography & barcode' },
  { id: 'vinyl', name: 'Midnight Vinyl', icon: Disc, desc: 'Collector LP disc with ambient glow' },
  { id: 'receipt', name: 'Sonic Receipt', icon: Receipt, desc: 'Concert pass & itemized music sins' },
];

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
  const [selectedTemplate, setSelectedTemplate] = useState('cyber');
  const [isRendering, setIsRendering] = useState(true);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [extractedPalette, setExtractedPalette] = useState(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Mouse move 3D tilt effect on poster container
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltX = (y - centerY) / 25;
    const tiltY = (centerX - x) / 25;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Helper to load CORS-safe images
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

  // Rounded rectangle helper
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

  // Text wrap helper
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

  // Realistic Vinyl Record Drawing
  const drawVinylRecord = (ctx, cx, cy, radius, labelImg) => {
    ctx.save();
    // Drop shadow
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 15;

    // Outer disc
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#0f0f12';
    ctx.fill();

    // Subtle edge highlight
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Grooves
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = 'rgba(255,255,255,0.035)';
    ctx.lineWidth = 1.5;
    for (let r = radius * 0.45; r < radius * 0.92; r += 10) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Vinyl sheen reflections
    const sheenGrad = ctx.createConicGradient(0, cx, cy);
    sheenGrad.addColorStop(0, 'rgba(255,255,255,0)');
    sheenGrad.addColorStop(0.12, 'rgba(255,255,255,0.06)');
    sheenGrad.addColorStop(0.25, 'rgba(255,255,255,0)');
    sheenGrad.addColorStop(0.5, 'rgba(255,255,255,0)');
    sheenGrad.addColorStop(0.62, 'rgba(255,255,255,0.06)');
    sheenGrad.addColorStop(0.75, 'rgba(255,255,255,0)');
    sheenGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = sheenGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    // Center Label (Album Art)
    const labelRadius = radius * 0.38;
    if (labelImg) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, labelRadius, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(labelImg, cx - labelRadius, cy - labelRadius, labelRadius * 2, labelRadius * 2);
      ctx.restore();
    }

    // Center spindle hole
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.fillStyle = '#050507';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  };

  // Skewed Sticker Graphic
  const drawSticker = (ctx, text, x, y, angle, bg, fg, border = 'rgba(255,255,255,0.2)') => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((angle * Math.PI) / 180);

    ctx.font = '800 20px "Space Grotesk", sans-serif';
    const textWidth = ctx.measureText(text).width;
    const padX = 18;
    const padY = 10;
    const width = textWidth + padX * 2;
    const height = 40;

    // Shadow
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 6;

    // Background
    ctx.fillStyle = bg;
    drawRoundedRect(ctx, -width / 2, -height / 2, width, height, 8);
    ctx.fill();
    ctx.strokeStyle = border;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Text
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = fg;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 0, 1);

    ctx.restore();
  };

  // Barcode & Serial drawing
  const drawBarcode = (ctx, x, y, width, height, serial) => {
    ctx.save();
    ctx.fillStyle = '#ffffff';
    let currX = x;
    const endX = x + width;
    while (currX < endX) {
      const barWidth = Math.random() > 0.4 ? 2 : Math.random() > 0.6 ? 5 : 8;
      const gap = Math.random() > 0.3 ? 3 : 6;
      ctx.fillRect(currX, y, barWidth, height);
      currX += barWidth + gap;
    }
    // Serial number underneath
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '700 16px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(serial, x + width / 2, y + height + 24);
    ctx.restore();
  };

  // Procedural subtle film grain
  const applyFilmGrain = (ctx, opacity = 0.035) => {
    const grainCanvas = document.createElement('canvas');
    grainCanvas.width = 128;
    grainCanvas.height = 128;
    const gCtx = grainCanvas.getContext('2d');
    if (!gCtx) return;

    const imgData = gCtx.createImageData(128, 128);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const v = Math.floor(Math.random() * 255);
      imgData.data[i] = v;
      imgData.data[i + 1] = v;
      imgData.data[i + 2] = v;
      imgData.data[i + 3] = 255;
    }
    gCtx.putImageData(imgData, 0, 0);

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.globalCompositeOperation = 'overlay';
    const pattern = ctx.createPattern(grainCanvas, 'repeat');
    if (pattern) {
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
    ctx.restore();
  };

  // Master Render Function
  const renderPoster = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || !roastData || !stats) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsRendering(true);

    // Preload album covers (up to 8)
    const topTracksToUse = tracks.slice(0, 8);
    const loadedImages = (
      await Promise.all(
        topTracksToUse.map((t) => {
          const url = t.album?.images?.[1]?.url || t.album?.images?.[0]?.url;
          return loadCorsImage(url);
        })
      )
    ).filter(Boolean);

    const palette = extractPaletteFromImages(loadedImages);
    setExtractedPalette(palette);

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // ROUTE TO SELECTED TEMPLATE
    if (selectedTemplate === 'cyber') {
      renderCyberZine(ctx, palette, loadedImages);
    } else if (selectedTemplate === 'vinyl') {
      renderMidnightVinyl(ctx, palette, loadedImages);
    } else {
      renderSonicReceipt(ctx, palette, loadedImages);
    }

    // Apply global aesthetic film grain overlay
    applyFilmGrain(ctx, 0.04);

    setIsRendering(false);
  }, [user, tracks, stats, roastData, selectedTemplate]);

  // -------------------------------------------------------------
  // TEMPLATE 1: CYBER ZINE / ACID WRAPPED
  // -------------------------------------------------------------
  const renderCyberZine = (ctx, palette, images) => {
    // 1. Dark Acid mesh background
    const bgGrad = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    bgGrad.addColorStop(0, '#0a090f');
    bgGrad.addColorStop(0.3, palette.backgroundDark || '#100a18');
    bgGrad.addColorStop(0.7, '#07070a');
    bgGrad.addColorStop(1, '#050508');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Cyber glowing radial blobs
    const glow1 = ctx.createRadialGradient(200, 350, 20, 200, 350, 600);
    glow1.addColorStop(0, palette.glowColor || 'rgba(29, 185, 84, 0.35)');
    glow1.addColorStop(1, 'transparent');
    ctx.fillStyle = glow1;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const glow2 = ctx.createRadialGradient(900, 1050, 40, 900, 1050, 650);
    glow2.addColorStop(0, `${palette.accentSecondary}33`);
    glow2.addColorStop(1, 'transparent');
    ctx.fillStyle = glow2;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Outer double border
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, 36, 36, CANVAS_WIDTH - 72, CANVAS_HEIGHT - 72, 44);
    ctx.stroke();

    ctx.strokeStyle = `${palette.accentPrimary}40`;
    ctx.lineWidth = 1;
    drawRoundedRect(ctx, 48, 48, CANVAS_WIDTH - 96, CANVAS_HEIGHT - 96, 36);
    ctx.stroke();
    ctx.restore();

    // Top Header: Acid Pill Branding
    ctx.save();
    ctx.fillStyle = palette.accentPrimary;
    drawRoundedRect(ctx, 80, 80, 190, 42, 21);
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.font = '900 18px "Syne", sans-serif';
    ctx.fillText('SONIC MIRROR', 104, 107);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 24px "Space Grotesk", sans-serif';
    const userName = (user?.display_name || 'AUTHENTICATED AUX').toUpperCase();
    ctx.fillText(userName, CANVAS_WIDTH - 80, 106);

    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '600 16px "JetBrains Mono", monospace';
    ctx.fillText('EST. 2026 // UNFILTERED READOUT', CANVAS_WIDTH - 80, 134);
    ctx.restore();

    // Asymmetrical Album Art Collage
    if (images.length > 0) {
      // Main Hero Album Cover (left)
      const heroX = 80;
      const heroY = 180;
      const heroW = 420;
      const heroH = 420;

      // Vinyl disc sliding out of hero album
      drawVinylRecord(ctx, heroX + heroW + 60, heroY + heroH / 2, 210, images[1] || images[0]);

      // Hero album cover shadow and clip
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.85)';
      ctx.shadowBlur = 35;
      ctx.shadowOffsetY = 18;
      drawRoundedRect(ctx, heroX, heroY, heroW, heroH, 28);
      ctx.clip();
      ctx.drawImage(images[0], heroX, heroY, heroW, heroH);

      // Glass shine over hero album
      const sheen = ctx.createLinearGradient(heroX, heroY, heroX + heroW, heroY + heroH);
      sheen.addColorStop(0, 'rgba(255,255,255,0.25)');
      sheen.addColorStop(0.3, 'rgba(255,255,255,0.05)');
      sheen.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = sheen;
      ctx.fillRect(heroX, heroY, heroW, heroH);
      ctx.restore();

      // Right stack of 4 small album thumbnails
      const miniX = 740;
      const miniY = 180;
      const miniSize = 120;
      const miniGap = 16;
      [images[2], images[3], images[4], images[5]].forEach((img, idx) => {
        if (!img) return;
        const mx = miniX + (idx % 2) * (miniSize + miniGap);
        const my = miniY + Math.floor(idx / 2) * (miniSize + miniGap);
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.6)';
        ctx.shadowBlur = 15;
        drawRoundedRect(ctx, mx, my, miniSize, miniSize, 18);
        ctx.clip();
        ctx.drawImage(img, mx, my, miniSize, miniSize);
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      });

      // Palette Swatch strip under mini album covers
      const swatches = palette.swatches || ['#1DB954', '#3b82f6', '#ec4899', '#f59e0b'];
      swatches.forEach((color, i) => {
        const sx = miniX + i * 44;
        const sy = miniY + (miniSize * 2) + miniGap + 20;
        ctx.save();
        ctx.beginPath();
        ctx.arc(sx + 14, sy, 14, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      });
    }

    // Skewed Fun Stickers
    drawSticker(ctx, 'PARENTAL ADVISORY // ZERO CHILL', 280, 630, -3, '#f43f5e', '#ffffff');
    drawSticker(ctx, `${stats.avgValence}% HAPPY`, 860, 615, 5, palette.accentPrimary, '#000000');

    // Hero Archetype Section
    ctx.save();
    ctx.textAlign = 'left';
    ctx.fillStyle = palette.accentPrimary;
    ctx.font = '800 22px "JetBrains Mono", monospace';
    ctx.fillText('// ARCHETYPE DIAGNOSIS:', 80, 710);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 68px "Syne", sans-serif';
    const archetypeTitle = (roastData.archetype || 'THE CURATED MELTDOWN').toUpperCase();
    const wrappedTitle = wrapText(ctx, archetypeTitle, 920);
    wrappedTitle.forEach((line, idx) => {
      ctx.fillText(line, 80, 785 + idx * 75);
    });
    const archetypeEndY = 785 + wrappedTitle.length * 75;
    ctx.restore();

    // Burn Quote Banner (Glass card with accent border)
    const quoteY = archetypeEndY + 20;
    const quoteW = 920;
    const quoteH = 130;
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    drawRoundedRect(ctx, 80, quoteY, quoteW, quoteH, 24);
    ctx.fill();
    ctx.strokeStyle = `${palette.accentSecondary}66`;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = palette.accentSecondary || '#fcd34d';
    ctx.font = 'italic 800 30px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    const burnText = roastData.burnQuote || '"100% emotional avoidance."';
    const burnLines = wrapText(ctx, burnText, 860);
    burnLines.slice(0, 2).forEach((line, i) => {
      ctx.fillText(line, CANVAS_WIDTH / 2, quoteY + 55 + i * 40);
    });
    ctx.restore();

    // Main Roast Editorial Paragraph
    const roastStartY = quoteY + quoteH + 50;
    ctx.save();
    ctx.fillStyle = '#e2e2ec';
    ctx.font = '500 28px Inter, sans-serif';
    ctx.textAlign = 'left';

    const roastLines = [];
    const paragraphs = (roastData.roast || '').split('\n').filter(Boolean);
    paragraphs.forEach((p) => {
      const wrapped = wrapText(ctx, p, 920);
      roastLines.push(...wrapped);
    });

    const maxLines = Math.min(roastLines.length, 6);
    for (let i = 0; i < maxLines; i++) {
      ctx.fillText(roastLines[i], 80, roastStartY + i * 44);
    }
    ctx.restore();

    // Bottom Stats Matrix Cards
    const metricsY = 1530;
    const cardW = 210;
    const cardH = 110;
    const gap = 26;
    const metricsData = [
      { label: 'ENERGY', val: `${stats.avgEnergy}%`, color: '#f59e0b' },
      { label: 'DANCE', val: `${stats.avgDanceability}%`, color: '#ec4899' },
      { label: 'TEMPO', val: `${stats.avgTempo} BPM`, color: '#8b5cf6' },
      { label: 'POPULARITY', val: `${stats.avgPopularity}%`, color: palette.accentPrimary },
    ];

    metricsData.forEach((m, idx) => {
      const cx = 80 + idx * (cardW + gap);
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      drawRoundedRect(ctx, cx, metricsY, cardW, cardH, 20);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.font = '700 15px "JetBrains Mono", monospace';
      ctx.fillText(m.label, cx + 22, metricsY + 36);

      ctx.fillStyle = m.color;
      ctx.font = '900 32px "Syne", sans-serif';
      ctx.fillText(m.val, cx + 22, metricsY + 84);
      ctx.restore();
    });

    // Barcode & Footer
    drawBarcode(ctx, 80, 1690, 360, 48, `#SM-${stats.avgTempo}-${stats.avgEnergy}`);
    ctx.save();
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '700 20px "Space Grotesk", sans-serif';
    ctx.fillText('SONICMIRROR.APP', CANVAS_WIDTH - 80, 1720);
    ctx.font = '500 16px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillText('SPOTIFY AUDIO ENGINE // 2026', CANVAS_WIDTH - 80, 1748);
    ctx.restore();
  };

  // -------------------------------------------------------------
  // TEMPLATE 2: MIDNIGHT VINYL / MOODBOARD
  // -------------------------------------------------------------
  const renderMidnightVinyl = (ctx, palette, images) => {
    // 1. Deep Velvet Background
    const bgGrad = ctx.createRadialGradient(
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT / 2,
      100,
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT / 2,
      CANVAS_HEIGHT
    );
    bgGrad.addColorStop(0, palette.backgroundDark || '#140f1a');
    bgGrad.addColorStop(0.6, '#09080c');
    bgGrad.addColorStop(1, '#040305');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Warm atmospheric halo
    const halo = ctx.createRadialGradient(CANVAS_WIDTH / 2, 480, 80, CANVAS_WIDTH / 2, 480, 520);
    halo.addColorStop(0, palette.glowColor || 'rgba(236, 72, 153, 0.25)');
    halo.addColorStop(1, 'transparent');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Elegant thin double border
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(50, 50, CANVAS_WIDTH - 100, CANVAS_HEIGHT - 100);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.strokeRect(60, 60, CANVAS_WIDTH - 120, CANVAS_HEIGHT - 120);
    ctx.restore();

    // Top Header
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '600 18px "Space Grotesk", sans-serif';
    ctx.letterSpacing = '8px';
    ctx.fillText('— SONIC MIRROR ARCHIVES —', CANVAS_WIDTH / 2, 105);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'italic 700 24px "Inter", serif';
    ctx.fillText(`Auditory Portrait of ${user?.display_name || 'The Listener'}`, CANVAS_WIDTH / 2, 142);
    ctx.restore();

    // Center Large Vinyl Disc
    if (images.length > 0) {
      drawVinylRecord(ctx, CANVAS_WIDTH / 2, 440, 240, images[0]);
    }

    // 4 Floating Album Polaroid Cards
    const polaroidY = 740;
    const pW = 190;
    const pH = 230;
    const pGap = 24;
    const pStartX = (CANVAS_WIDTH - (pW * 4 + pGap * 3)) / 2;

    [images[1], images[2], images[3], images[4]].forEach((img, idx) => {
      if (!img) return;
      const px = pStartX + idx * (pW + pGap);
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.7)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetY = 10;

      // White polaroid frame
      ctx.fillStyle = '#18181f';
      drawRoundedRect(ctx, px, polaroidY, pW, pH, 16);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.stroke();

      // Image inside
      drawRoundedRect(ctx, px + 12, polaroidY + 12, pW - 24, pW - 24, 10);
      ctx.clip();
      ctx.drawImage(img, px + 12, polaroidY + 12, pW - 24, pW - 24);
      ctx.restore();
    });

    // Archetype Title
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = palette.accentPrimary;
    ctx.font = '800 20px "JetBrains Mono", monospace';
    ctx.fillText('PREVALENT SONIC TEMPERAMENT', CANVAS_WIDTH / 2, 1040);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 64px "Bebas Neue", sans-serif';
    ctx.letterSpacing = '2px';
    const archetypeTitle = (roastData.archetype || 'THE CURATED MELTDOWN').toUpperCase();
    ctx.fillText(archetypeTitle, CANVAS_WIDTH / 2, 1110);
    ctx.restore();

    // Burn Quote Callout
    const quoteY = 1140;
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    drawRoundedRect(ctx, 100, quoteY, 880, 110, 20);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = palette.accentSecondary || '#ffd166';
    ctx.font = 'italic 700 26px "Space Grotesk", sans-serif';
    const burnText = roastData.burnQuote || '"100% emotional avoidance."';
    ctx.fillText(burnText, CANVAS_WIDTH / 2, quoteY + 65);
    ctx.restore();

    // Roast Text
    const roastStartY = 1290;
    ctx.save();
    ctx.fillStyle = '#dedee8';
    ctx.font = '400 26px "Inter", sans-serif';
    ctx.textAlign = 'center';

    const roastLines = [];
    const paragraphs = (roastData.roast || '').split('\n').filter(Boolean);
    paragraphs.forEach((p) => {
      const wrapped = wrapText(ctx, p, 840);
      roastLines.push(...wrapped);
    });

    const maxLines = Math.min(roastLines.length, 5);
    for (let i = 0; i < maxLines; i++) {
      ctx.fillText(roastLines[i], CANVAS_WIDTH / 2, roastStartY + i * 44);
    }
    ctx.restore();

    // Bottom Vinyl Specs & Watermark
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(100, 1680);
    ctx.lineTo(CANVAS_WIDTH - 100, 1680);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '700 18px "JetBrains Mono", monospace';
    ctx.fillText(
      `RPM: 33 ⅓  •  TEMPO: ${stats.avgTempo} BPM  •  VALENCE: ${stats.avgValence}%  •  ENERGY: ${stats.avgEnergy}%`,
      CANVAS_WIDTH / 2,
      1730
    );

    ctx.fillStyle = palette.accentPrimary;
    ctx.font = '800 20px "Space Grotesk", sans-serif';
    ctx.fillText('SONIC MIRROR // 2026 EDITION', CANVAS_WIDTH / 2, 1790);
    ctx.restore();
  };

  // -------------------------------------------------------------
  // TEMPLATE 3: SONIC RECEIPT / FESTIVAL PASS
  // -------------------------------------------------------------
  const renderSonicReceipt = (ctx, palette, images) => {
    // 1. Dark Grunge Background
    ctx.fillStyle = '#0a0a0d';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Receipt Paper Body
    const rX = 70;
    const rY = 60;
    const rW = CANVAS_WIDTH - 140;
    const rH = CANVAS_HEIGHT - 120;

    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.85)';
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 20;

    // Thermal paper off-white
    ctx.fillStyle = '#f6f6f2';
    drawRoundedRect(ctx, rX, rY, rW, rH, 28);
    ctx.fill();
    ctx.restore();

    // Receipt Header
    ctx.save();
    ctx.fillStyle = '#111111';
    ctx.textAlign = 'center';
    ctx.font = '900 48px "Bebas Neue", sans-serif';
    ctx.fillText('*** SONIC MIRROR RECEIPT ***', CANVAS_WIDTH / 2, 140);

    ctx.font = '700 16px "JetBrains Mono", monospace';
    ctx.fillText('STORE #404: YOUR QUESTIONABLE TASTE', CANVAS_WIDTH / 2, 175);
    ctx.fillText(`CASHIER: GEMINI AI  •  CUSTOMER: ${user?.display_name || 'AUX MENACE'}`, CANVAS_WIDTH / 2, 202);

    // Dashed divider line
    ctx.setLineDash([8, 8]);
    ctx.strokeStyle = '#222222';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(rX + 40, 230);
    ctx.lineTo(rX + rW - 40, 230);
    ctx.stroke();
    ctx.restore();

    // Album Art Mosaic (Receipt attachment)
    const mosaicY = 260;
    const mSize = 130;
    const mGap = 16;
    const mStartX = (CANVAS_WIDTH - (mSize * 4 + mGap * 3)) / 2;
    images.slice(0, 4).forEach((img, i) => {
      if (!img) return;
      const mx = mStartX + i * (mSize + mGap);
      ctx.save();
      drawRoundedRect(ctx, mx, mosaicY, mSize, mSize, 14);
      ctx.clip();
      ctx.drawImage(img, mx, mosaicY, mSize, mSize);
      ctx.restore();
    });

    // Diagnosed Archetype Box
    ctx.save();
    ctx.fillStyle = '#111111';
    ctx.textAlign = 'center';
    ctx.font = '800 20px "JetBrains Mono", monospace';
    ctx.fillText('PRIMARY DIAGNOSIS / ARCHETYPE:', CANVAS_WIDTH / 2, 440);

    ctx.fillStyle = '#dc2626';
    ctx.font = '900 52px "Bebas Neue", sans-serif';
    const archetypeTitle = (roastData.archetype || 'THE CURATED MELTDOWN').toUpperCase();
    ctx.fillText(archetypeTitle, CANVAS_WIDTH / 2, 500);
    ctx.restore();

    // Itemized Sins Table
    ctx.save();
    ctx.font = '700 20px "JetBrains Mono", monospace';
    ctx.fillStyle = '#111111';
    ctx.textAlign = 'left';

    const tableY = 560;
    ctx.fillText('QTY   ITEM / OFFENSE                          VALUE', rX + 40, tableY);

    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = '#666666';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(rX + 40, tableY + 15);
    ctx.lineTo(rX + rW - 40, tableY + 15);
    ctx.stroke();

    const items = [
      { qty: '01', desc: `Dominant Genre: ${stats.dominantGenre}`, val: 'Priceless' },
      { qty: '02', desc: `Energy Overdose`, val: `${stats.avgEnergy}%` },
      { qty: '03', desc: `Emotional Stability`, val: `${stats.avgValence}%` },
      { qty: '04', desc: `Danceability (in bedroom)`, val: `${stats.avgDanceability}%` },
      { qty: '05', desc: `Heavy Rotation Tracks`, val: `${tracks.length} Songs` },
    ];

    items.forEach((it, i) => {
      const iy = tableY + 55 + i * 36;
      ctx.fillText(it.qty, rX + 40, iy);
      ctx.fillText(it.desc.slice(0, 32), rX + 110, iy);
      ctx.textAlign = 'right';
      ctx.fillText(it.val, rX + rW - 40, iy);
      ctx.textAlign = 'left';
    });
    ctx.restore();

    // Red Rubber Stamp ("DECLINED BY THE AUX")
    drawSticker(ctx, 'DECLINED BY THE AUX', CANVAS_WIDTH - 260, 670, -14, 'rgba(220, 38, 38, 0.9)', '#ffffff');

    // Dashed Line
    ctx.save();
    ctx.setLineDash([8, 8]);
    ctx.strokeStyle = '#222222';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(rX + 40, 800);
    ctx.lineTo(rX + rW - 40, 800);
    ctx.stroke();
    ctx.restore();

    // Burn Quote Callout
    ctx.save();
    ctx.fillStyle = '#111111';
    ctx.textAlign = 'center';
    ctx.font = 'italic 800 28px "Space Grotesk", sans-serif';
    const burnLines = wrapText(ctx, roastData.burnQuote || '"100% emotional avoidance."', 800);
    burnLines.forEach((line, i) => {
      ctx.fillText(line, CANVAS_WIDTH / 2, 860 + i * 38);
    });
    ctx.restore();

    // Roast Text (Thermal Print Style)
    const roastStartY = 960;
    ctx.save();
    ctx.fillStyle = '#222222';
    ctx.font = '600 24px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';

    const roastLines = [];
    const paragraphs = (roastData.roast || '').split('\n').filter(Boolean);
    paragraphs.forEach((p) => {
      const wrapped = wrapText(ctx, p, 800);
      roastLines.push(...wrapped);
    });

    const maxLines = Math.min(roastLines.length, 6);
    for (let i = 0; i < maxLines; i++) {
      ctx.fillText(roastLines[i], rX + 60, roastStartY + i * 40);
    }
    ctx.restore();

    // Receipt Total & Therapy Cost
    ctx.save();
    const totalY = 1380;
    ctx.setLineDash([]);
    ctx.strokeStyle = '#111111';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(rX + 40, totalY);
    ctx.lineTo(rX + rW - 40, totalY);
    ctx.stroke();

    ctx.fillStyle = '#111111';
    ctx.font = '900 36px "Bebas Neue", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('TOTAL ESTIMATED THERAPY COST:', rX + 40, totalY + 50);
    ctx.textAlign = 'right';
    ctx.fillText(`$${(stats.avgEnergy * 18 + stats.avgTempo * 6).toLocaleString()}.00`, rX + rW - 40, totalY + 50);
    ctx.restore();

    // Barcode & Fine Print
    drawBarcode(ctx, rX + 60, 1490, rW - 120, 60, `SONIC-REC-${stats.avgTempo}-NO-REFUNDS`);

    ctx.save();
    ctx.fillStyle = '#555555';
    ctx.textAlign = 'center';
    ctx.font = '600 16px "JetBrains Mono", monospace';
    ctx.fillText('THANK YOU FOR VISITING SONIC MIRROR', CANVAS_WIDTH / 2, 1630);
    ctx.fillText('ALL ROASTS FINAL • NO AUX PRIVILEGES GUARANTEED', CANVAS_WIDTH / 2, 1660);
    ctx.restore();
  };

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
        a.download = `${safeArchetype}-${selectedTemplate}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#1DB954', '#f59e0b', '#ec4899', '#3b82f6'],
        });

        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3000);
      },
      'image/png',
      1.0
    );
  };

  // Copy Image or Native Share
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
            text: `Look what Gemini said about my Spotify taste! #${roastData?.archetype?.replace(/\s+/g, '') || 'SonicMirror'}`,
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
    <div id="poster-section" className="flex flex-col items-center w-full max-w-5xl mx-auto py-10">
      {/* Section Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-spotify-green/10 border border-spotify-green/30 text-spotify-green text-xs font-extrabold uppercase tracking-widest mb-3">
          <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
          <span>High-Aesthetic Story Card</span>
        </div>
        <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight font-syne">
          Your Shareable <span className="text-transparent bg-clip-text bg-gradient-to-r from-spotify-green via-emerald-300 to-teal-300">Mood Board</span>
        </h2>
        <p className="text-sm sm:text-base text-spotify-subtext mt-3 max-w-lg mx-auto">
          Ultra-sharp 1080×1920 poster rendered on HTML5 Canvas, dynamically colored from your top album art.
        </p>

        {/* Template Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6 p-1.5 rounded-2xl bg-black/50 border border-white/10 max-w-md mx-auto">
          {TEMPLATES.map((t) => {
            const Icon = t.icon;
            const isSelected = selectedTemplate === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedTemplate(t.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                  isSelected
                    ? 'bg-spotify-green text-black shadow-lg shadow-spotify-green/30 scale-105'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3D Perspective Tilt Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 0.15s ease-out',
        }}
        className="relative w-full max-w-[370px] sm:max-w-[430px] aspect-[9/16] rounded-[38px] p-2 bg-gradient-to-b from-white/20 via-white/5 to-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-white/20 group"
      >
        {/* Sleek Device / Card Screen Container */}
        <div className="relative w-full h-full rounded-[30px] overflow-hidden bg-black flex items-center justify-center">
          {/* Loading Overlay */}
          {isRendering && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center z-20 text-center p-6">
              <RefreshCw className="w-8 h-8 text-spotify-green animate-spin mb-3" />
              <p className="text-sm font-bold text-white">Synthesizing {TEMPLATES.find((t) => t.id === selectedTemplate)?.name}...</p>
            </div>
          )}

          {/* Canvas Element */}
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="w-full h-full object-contain block select-none pointer-events-none"
          />

          {/* Dynamic Light Sheen overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-9 w-full max-w-md">
        {/* Download Button */}
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

        {/* Share Button */}
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

        {/* Regenerate Roast Trigger */}
        {onRegenerateRoast && (
          <button
            onClick={() => onRegenerateRoast(currentTone)}
            disabled={isRegenerating || isRendering}
            className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-full bg-white/5 hover:bg-white/10 text-spotify-subtext hover:text-white font-semibold text-xs transition-all border border-white/5"
            title="Generate a new roast tone"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>Remix Roast</span>
          </button>
        )}
      </div>

      {/* Extracted Palette Pill */}
      {extractedPalette?.swatches && (
        <div className="flex items-center gap-3 mt-6 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-spotify-subtext backdrop-blur-md">
          <Palette className="w-3.5 h-3.5 text-spotify-green" />
          <span>Extracted Album Palette:</span>
          <div className="flex items-center gap-1.5">
            {extractedPalette.swatches.map((color, i) => (
              <span
                key={i}
                className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
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
