import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Download, Sparkles, Share2, RefreshCw, Check, Sliders, CheckSquare, Square, Palette, Disc, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';

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
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Theme Selector: 'wrapped2024' (Spotify Wrapped 2024 geometric neon) vs 'zinelab' (Risograph clinical specimen)
  const [posterTheme, setPosterTheme] = useState('wrapped2024');

  // Wrapped 2024 Theme Colorway: 'dark' (Obsidian), 'red' (Cadmium Coral), 'yellow' (Canary)
  const [wrappedColorway, setWrappedColorway] = useState('dark');

  // Zine Lab Customizer Toggles
  const [showGrain, setShowGrain] = useState(true);
  const [showStamp, setShowStamp] = useState(true);
  const [showSpectrum, setShowSpectrum] = useState(true);
  const [showBarcode, setShowBarcode] = useState(true);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const tiltX = (y - rect.height / 2) / 32;
    const tiltY = (rect.width / 2 - x) / 32;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

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

  const applyNoiseOverlay = (ctx, opacity = 0.2) => {
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
    ctx.globalCompositeOperation = 'multiply';
    const pattern = ctx.createPattern(noiseCanvas, 'repeat');
    if (pattern) {
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
    ctx.restore();
  };

  // =========================================================================
  // MAIN RENDER ENGINE (Supports both Wrapped 2024 and Zine Lab themes)
  // =========================================================================
  const renderPoster = useCallback(async () => {
    await document.fonts.ready;
    
    const canvas = canvasRef.current;
    if (!canvas || !roastData || !stats) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setIsRendering(true);

    const topTracksToUse = tracks.slice(0, 5);
    const loadedImages = await Promise.all(
      topTracksToUse.map((t) => {
        const url = t.album?.images?.[1]?.url || t.album?.images?.[0]?.url;
        return loadCorsImage(url);
      })
    );

    // =========================================================================
    // THEME 1: SPOTIFY WRAPPED 2024 (GEOMETRIC NEON ACCORDION CHEVRONS)
    // =========================================================================
    if (posterTheme === 'wrapped2024') {
      let bgBase = '#09090D'; // Obsidian
      let textPrimary = '#FFFFFF';
      let textSecondary = '#A1A1AA';
      let accentRibbonPrimary = '#FF007F'; // Hot Magenta
      let accentRibbonSecondary = '#FF5722'; // Tangerine Coral

      if (wrappedColorway === 'red') {
        bgBase = '#E11D48'; // Cadmium Coral Red
        textPrimary = '#FFFFFF';
        textSecondary = '#FFE4E6';
        accentRibbonPrimary = '#CCFF00'; // Lime
        accentRibbonSecondary = '#00F0FF'; // Cyan
      } else if (wrappedColorway === 'yellow') {
        bgBase = '#FFE600'; // Canary Yellow
        textPrimary = '#09090D';
        textSecondary = '#3F3F46';
        accentRibbonPrimary = '#0047FF'; // Electric Blue
        accentRibbonSecondary = '#9D4EDD'; // Purple
      }

      // Base Canvas
      ctx.fillStyle = bgBase;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // -------------------------------------------------------------
      // 1. Procedural 2024 Wrapped 3D Stepped Chevrons (Left & Right)
      // -------------------------------------------------------------
      const drawChevrons = (side = 'left') => {
        const isLeft = side === 'left';
        ctx.save();
        const numLayers = 6;
        const startY = 320;
        const totalHeight = 560;

        for (let i = 0; i < numLayers; i++) {
          const depth = (numLayers - i) / numLayers;
          ctx.beginPath();
          const w = isLeft ? 140 * depth + 40 : CANVAS_WIDTH - (140 * depth + 40);
          const apexX = isLeft ? 160 * depth + 60 : CANVAS_WIDTH - (160 * depth + 60);

          if (isLeft) {
            ctx.moveTo(0, startY - i * 20);
            ctx.lineTo(apexX, startY + totalHeight / 2);
            ctx.lineTo(0, startY + totalHeight + i * 20);
          } else {
            ctx.moveTo(CANVAS_WIDTH, startY - i * 20);
            ctx.lineTo(apexX, startY + totalHeight / 2);
            ctx.lineTo(CANVAS_WIDTH, startY + totalHeight + i * 20);
          }
          ctx.closePath();

          // Gradient fill
          const grad = ctx.createLinearGradient(
            isLeft ? 0 : CANVAS_WIDTH,
            startY,
            apexX,
            startY + totalHeight
          );
          if (i % 2 === 0) {
            grad.addColorStop(0, accentRibbonPrimary);
            grad.addColorStop(1, accentRibbonSecondary);
          } else {
            grad.addColorStop(0, '#7928CA');
            grad.addColorStop(1, '#000000');
          }
          ctx.fillStyle = grad;
          ctx.fill();

          ctx.lineWidth = 3;
          ctx.strokeStyle = bgBase;
          ctx.stroke();

          // Geometric depth lines inside chevron
          ctx.beginPath();
          for (let s = 1; s <= 4; s++) {
            const stepY = startY + (totalHeight / 5) * s;
            if (isLeft) {
              ctx.moveTo(0, stepY);
              ctx.lineTo(apexX * 0.7, startY + totalHeight / 2);
            } else {
              ctx.moveTo(CANVAS_WIDTH, stepY);
              ctx.lineTo(CANVAS_WIDTH - (CANVAS_WIDTH - apexX) * 0.7, startY + totalHeight / 2);
            }
          }
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
        ctx.restore();
      };

      drawChevrons('left');
      drawChevrons('right');

      // Top-Right 3D Geometric Accordion Spiral/Slat
      ctx.save();
      ctx.translate(CANVAS_WIDTH - 60, 40);
      const slatCount = 14;
      for (let s = 0; s < slatCount; s++) {
        const angle = (s / slatCount) * Math.PI * 0.6;
        const rad = 140 - s * 5;
        const sx = Math.cos(angle) * rad;
        const sy = Math.sin(angle) * rad;

        ctx.fillStyle = s % 2 === 0 ? accentRibbonPrimary : '#FFFFFF';
        ctx.fillRect(-sx - 60, sy, 80, 8);
      }
      ctx.restore();

      // Bottom-Left 3D Stepped Pixel Stair
      ctx.save();
      for (let st = 0; st < 8; st++) {
        ctx.fillStyle = st % 2 === 0 ? accentRibbonSecondary : '#00F0FF';
        ctx.fillRect(20 + st * 12, CANVAS_HEIGHT - 180 + st * 12, 50, 50);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeRect(20 + st * 12, CANVAS_HEIGHT - 180 + st * 12, 50, 50);
      }
      ctx.restore();

      // -------------------------------------------------------------
      // 2. HERO HEADER (2024 Spotify Wrapped)
      // -------------------------------------------------------------
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      // Year
      ctx.fillStyle = textPrimary;
      ctx.font = '900 170px "Archivo Black", sans-serif';
      ctx.fillText('2024', CANVAS_WIDTH / 2, 80);

      // Spotify Wrapped Eyebrow
      ctx.font = '700 48px "Space Grotesk", sans-serif';
      ctx.fillStyle = textPrimary;
      ctx.fillText('Spotify Wrapped', CANVAS_WIDTH / 2, 255);

      // Subhead pill: Sonic Mirror Diagnosis
      ctx.save();
      const subheadText = 'SONIC MIRROR // PSYCHIATRIC EVALUATION';
      ctx.font = 'bold 18px "Space Mono", monospace';
      const subW = ctx.measureText(subheadText).width + 36;
      ctx.fillStyle = accentRibbonPrimary;
      ctx.fillRect(CANVAS_WIDTH / 2 - subW / 2, 325, subW, 36);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(subheadText, CANVAS_WIDTH / 2, 333);
      ctx.restore();

      // -------------------------------------------------------------
      // 3. ARCHETYPE DIAGNOSIS BANNER
      // -------------------------------------------------------------
      const archY = 390;
      const archetype = (roastData.archetype || 'EXISTENTIAL AUX MENACE').toUpperCase();

      // Outer Archetype Card
      ctx.save();
      ctx.fillStyle = '#18181B';
      ctx.strokeStyle = accentRibbonPrimary;
      ctx.lineWidth = 4;
      ctx.fillRect(100, archY, CANVAS_WIDTH - 200, 150);
      ctx.strokeRect(100, archY, CANVAS_WIDTH - 200, 150);

      ctx.textAlign = 'left';
      ctx.font = 'bold 16px "Space Mono", monospace';
      ctx.fillStyle = accentRibbonSecondary;
      ctx.fillText('LISTENER ARCHETYPE DIAGNOSIS:', 130, archY + 22);

      let archFontSize = 48;
      ctx.font = `900 ${archFontSize}px "Archivo Black", sans-serif`;
      while (ctx.measureText(archetype).width > CANVAS_WIDTH - 280 && archFontSize > 28) {
        archFontSize -= 4;
        ctx.font = `900 ${archFontSize}px "Archivo Black", sans-serif`;
      }
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(archetype, 130, archY + 54);

      // Burn Quote
      if (roastData.burnQuote) {
        ctx.font = 'italic 20px "Space Grotesk", sans-serif';
        ctx.fillStyle = '#A1A1AA';
        const truncatedQuote = roastData.burnQuote.length > 58 ? roastData.burnQuote.substring(0, 56) + '..."' : roastData.burnQuote;
        ctx.fillText(`"${truncatedQuote}"`, 130, archY + 108);
      }
      ctx.restore();

      // -------------------------------------------------------------
      // 4. CLEAN NUMBERED TOP TRACKS LIST (From 2024 Reference Image)
      // -------------------------------------------------------------
      let listY = 580;
      ctx.textAlign = 'left';
      ctx.font = '900 36px "Archivo Black", sans-serif';
      ctx.fillStyle = textPrimary;
      ctx.fillText('Top Tracks on Heavy Rotation', 100, listY);

      listY += 60;
      const rowHeight = 120;

      topTracksToUse.forEach((track, idx) => {
        const yPos = listY + idx * rowHeight;
        const img = loadedImages[idx];

        // Row Container
        ctx.fillStyle = idx % 2 === 0 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)';
        ctx.fillRect(100, yPos, CANVAS_WIDTH - 200, rowHeight - 12);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(100, yPos, CANVAS_WIDTH - 200, rowHeight - 12);

        // Huge Number
        ctx.font = '900 48px "Archivo Black", sans-serif';
        ctx.fillStyle = idx === 0 ? '#FFE600' : idx === 1 ? '#00F0FF' : idx === 2 ? '#FF007F' : '#FFFFFF';
        ctx.fillText(`${idx + 1}`, 130, yPos + 30);

        // Album Art Thumbnail
        if (img) {
          ctx.save();
          const imgSize = 80;
          const imgX = 200;
          const imgY = yPos + 14;

          ctx.beginPath();
          ctx.rect(imgX, imgY, imgSize, imgSize);
          ctx.clip();
          ctx.drawImage(img, imgX, imgY, imgSize, imgSize);
          ctx.restore();

          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 2;
          ctx.strokeRect(imgX, imgY, imgSize, imgSize);
        }

        // Track Name & Artist
        const textX = 305;
        ctx.font = '900 28px "Archivo Black", sans-serif';
        ctx.fillStyle = '#FFFFFF';
        const rawTitle = track.name || 'Unknown Track';
        const title = rawTitle.length > 28 ? rawTitle.substring(0, 26) + '...' : rawTitle;
        ctx.fillText(title, textX, yPos + 24);

        ctx.font = '600 20px "Space Grotesk", sans-serif';
        ctx.fillStyle = '#A1A1AA';
        const artist = track.artists?.map((a) => a.name).join(', ') || 'Unknown Artist';
        const shortArtist = artist.length > 34 ? artist.substring(0, 32) + '...' : artist;
        ctx.fillText(shortArtist, textX, yPos + 62);
      });

      // -------------------------------------------------------------
      // 5. AUDIO VITALS STATS PILLS (Grid at Bottom)
      // -------------------------------------------------------------
      const statsY = 1270;
      ctx.textAlign = 'left';
      ctx.font = '900 32px "Archivo Black", sans-serif';
      ctx.fillStyle = textPrimary;
      ctx.fillText('Psychoacoustic Vibe Metrics', 100, statsY);

      const vitalsList = [
        { label: 'ENERGY LEVEL', val: `${stats.avgEnergy}%`, color: '#CCFF00', sub: 'Auditory Intensity' },
        { label: 'VALENCE (HAPPINESS)', val: `${stats.avgValence}%`, color: '#00F0FF', sub: 'Emotional Balance' },
        { label: 'AVERAGE TEMPO', val: `${stats.avgTempo} BPM`, color: '#FF6D00', sub: 'Heartbeat Rhythm' },
        { label: 'TOP GENRE', val: `${stats.dominantGenre || 'Indie'}`, color: '#FF007F', sub: 'Dominant Sound' },
      ];

      const gridW = (CANVAS_WIDTH - 230) / 2;
      vitalsList.forEach((v, vi) => {
        const col = vi % 2;
        const row = Math.floor(vi / 2);
        const bx = 100 + col * (gridW + 30);
        const by = statsY + 55 + row * 110;

        ctx.fillStyle = '#18181B';
        ctx.fillRect(bx, by, gridW, 95);
        ctx.strokeStyle = v.color;
        ctx.lineWidth = 3;
        ctx.strokeRect(bx, by, gridW, 95);

        // Accent top stripe
        ctx.fillStyle = v.color;
        ctx.fillRect(bx, by, gridW, 6);

        ctx.fillStyle = '#A1A1AA';
        ctx.font = 'bold 14px "Space Mono", monospace';
        ctx.fillText(v.label, bx + 18, by + 18);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '900 36px "Archivo Black", sans-serif';
        const valText = v.val.length > 15 ? v.val.substring(0, 13) + '...' : v.val;
        ctx.fillText(valText, bx + 18, by + 46);
      });

      // -------------------------------------------------------------
      // 6. CLINICAL ROAST SUMMARY BOX
      // -------------------------------------------------------------
      const notesY = 1530;
      ctx.fillStyle = '#18181B';
      ctx.fillRect(100, notesY, CANVAS_WIDTH - 200, 190);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.strokeRect(100, notesY, CANVAS_WIDTH - 200, 190);

      ctx.fillStyle = accentRibbonPrimary;
      ctx.fillRect(100, notesY, 12, 190);

      ctx.fillStyle = textPrimary;
      ctx.font = 'bold 18px "Space Mono", monospace';
      ctx.fillText('CLINICAL AUTOPSY STATEMENT:', 130, notesY + 22);

      ctx.font = '500 20px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#E4E4E7';
      const maxNoteLines = 3;
      const rawNotes = roastData.roast || 'Patient exhibits symptoms of acute sonic coping mechanisms.';
      let noteLines = wrapText(ctx, rawNotes, CANVAS_WIDTH - 280);
      if (noteLines.length > maxNoteLines) {
        noteLines = noteLines.slice(0, maxNoteLines);
        noteLines[maxNoteLines - 1] = noteLines[maxNoteLines - 1].replace(/\s+\S*$/, '...');
      }
      noteLines.forEach((line, i) => {
        ctx.fillText(line, 130, notesY + 60 + i * 36);
      });

      // -------------------------------------------------------------
      // 7. FOOTER & VERTICAL BRANDING (Like EaTemp in screenshot)
      // -------------------------------------------------------------
      const footY = 1770;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fillRect(100, footY, CANVAS_WIDTH - 200, 2);

      ctx.fillStyle = '#A1A1AA';
      ctx.font = 'bold 20px "Space Mono", monospace';
      ctx.fillText(`LISTENER: ${(user?.display_name || 'AUTHENTICATED').toUpperCase()}`, 100, footY + 25);
      ctx.fillText('GENERATED VIA SONIC MIRROR 2024', 100, footY + 60);

      // Vertical Badge on Right Edge (Signature EaTemp style in reference image)
      ctx.save();
      ctx.translate(CANVAS_WIDTH - 45, 1200);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 16px "Space Mono", monospace';
      ctx.fillText('SONIC MIRROR // SPOTIFY WRAPPED 2024', 0, 0);
      ctx.restore();

      setIsRendering(false);
      return;
    }

    // =========================================================================
    // THEME 2: ZINE LAB (RISOGRAPH CLINICAL SPECIMEN CHART)
    // =========================================================================
    const cCream = '#F4F4F0';
    const cLime = '#CCFF00';
    const cPink = '#FF007F';
    const cCyan = '#00F0FF';
    const cDark = '#111111';
    const cWhite = '#FFFFFF';

    // Base background: Cream Zine Paper
    ctx.fillStyle = cCream;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (showGrain) {
      applyNoiseOverlay(ctx, 0.18);
    }

    const margin = 70;
    const innerWidth = CANVAS_WIDTH - margin * 2;
    const rightEdge = CANVAS_WIDTH - margin;

    // Helper for Exhibits
    const drawExhibit = (exhX, exhY, img, label, rotDeg, bgColor, tapeColor, scale = 1) => {
      if (!img) return;
      ctx.save();
      ctx.translate(exhX, exhY);
      ctx.scale(scale, scale);
      ctx.rotate((rotDeg * Math.PI) / 180);
      
      // Polaroid backing
      ctx.fillStyle = bgColor;
      ctx.fillRect(-95, -75, 190, 230);
      ctx.lineWidth = 5;
      ctx.strokeStyle = cDark;
      ctx.strokeRect(-95, -75, 190, 230);
      
      // Image shadow
      ctx.fillStyle = cDark;
      ctx.fillRect(-80, -60, 160, 160);
      ctx.drawImage(img, -80, -60, 160, 160);
      ctx.strokeRect(-80, -60, 160, 160);
      
      ctx.fillStyle = cDark;
      ctx.font = 'bold 20px "Courier Prime", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(label, -75, 135);
      
      // Washi Tape graphic
      ctx.fillStyle = tapeColor;
      ctx.translate(0, -75);
      ctx.rotate((8 * Math.PI) / 180);
      ctx.fillRect(-40, -14, 80, 28);
      ctx.strokeRect(-40, -14, 80, 28);
      
      ctx.restore();
    };

    // ----- SECTION 1: HEADER (y: 60) -----
    let y = 65;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    // Top box badge
    ctx.fillStyle = cWhite;
    ctx.fillRect(margin, y, 320, 60);
    ctx.lineWidth = 5;
    ctx.strokeStyle = cDark;
    ctx.strokeRect(margin, y, 320, 60);

    ctx.fillStyle = cLime;
    ctx.fillRect(margin + 6, y + 6, 308, 48);
    ctx.strokeRect(margin + 6, y + 6, 308, 48);

    ctx.fillStyle = cDark;
    ctx.font = '900 36px "Archivo Black", sans-serif';
    ctx.fillText('SONIC MIRROR', margin + 20, y + 12);

    ctx.fillStyle = cDark;
    ctx.font = 'bold 22px "Courier Prime", monospace';
    ctx.fillText('DEPT. OF PSYCHOACOUSTIC PATHOLOGY', margin, y + 80);

    // Right Metadata
    ctx.textAlign = 'right';
    const caseNum = Math.floor(Math.random() * 90000) + 10000;
    ctx.fillStyle = cDark;
    ctx.font = 'bold 24px "Courier Prime", monospace';
    ctx.fillText(`CASE: #SM-${caseNum}`, rightEdge, y + 10);

    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
    ctx.fillText(`DATE: ${today}`, rightEdge, y + 46);

    ctx.font = 'bold 20px "Courier Prime", monospace';
    ctx.fillStyle = cPink;
    ctx.fillText('STATUS: EVALUATED // SPECIMEN', rightEdge, y + 80);

    // Dividing rule
    y += 130;
    ctx.fillStyle = cDark;
    ctx.fillRect(margin, y, innerWidth, 6);

    // ----- SECTION 2: PATIENT INTAKE ROW -----
    y += 24;
    ctx.textAlign = 'left';
    ctx.fillStyle = cDark;
    ctx.font = 'bold 22px "Courier Prime", monospace';
    ctx.fillText('PATIENT:', margin, y);
    ctx.fillText('DOB / JOINED:', margin + 460, y);

    y += 34;
    ctx.fillStyle = cPink;
    ctx.font = 'bold 36px "Courier Prime", monospace';
    const patientName = (user?.display_name || 'AUTHENTICATED LISTENER').toUpperCase();
    const shortName = patientName.length > 18 ? patientName.substring(0, 16) + '...' : patientName;
    ctx.fillText(shortName, margin, y);
    ctx.fillStyle = cDark;
    ctx.fillText('2014-08', margin + 460, y);

    ctx.fillRect(margin, y + 42, 380, 4);
    ctx.fillRect(margin + 460, y + 42, 220, 4);

    // ----- SECTION 3: SPECTRUM ANALYZER (Optional toggle) -----
    y += 70;
    const eqY = y;
    const eqHeight = showSpectrum ? 170 : 30;

    if (showSpectrum) {
      ctx.fillStyle = cWhite;
      ctx.fillRect(margin, y, innerWidth, eqHeight);
      ctx.lineWidth = 5;
      ctx.strokeStyle = cDark;
      ctx.strokeRect(margin, y, innerWidth, eqHeight);

      // Shadow block
      ctx.fillStyle = cLime;
      ctx.fillRect(margin + 10, y + 10, innerWidth, eqHeight);
      ctx.globalCompositeOperation = 'destination-over';
      ctx.fillRect(margin + 10, y + 10, innerWidth, eqHeight);
      ctx.globalCompositeOperation = 'source-over';

      ctx.save();
      ctx.beginPath();
      ctx.rect(margin, y, innerWidth, eqHeight);
      ctx.clip();

      // Bars
      const numBars = 36;
      const barWidth = (innerWidth - 40) / numBars;
      for (let i = 0; i < numBars; i++) {
        const energyFactor = (stats.avgEnergy || 50) / 100;
        const valenceFactor = (stats.avgValence || 50) / 100;
        const baseH = Math.sin(i * 0.4) * 45 + Math.cos(i * 0.7) * 25 + 40;
        const randomNoise = Math.random() * 25;
        let h = baseH * energyFactor + randomNoise * valenceFactor + 20;
        if (h > eqHeight - 40) h = eqHeight - 40;
        if (h < 12) h = 12;

        const bx = margin + 20 + i * barWidth;
        const by = y + eqHeight - 20 - h;

        ctx.fillStyle = i % 2 === 0 ? cPink : cCyan;
        ctx.fillRect(bx + 2, by, barWidth - 5, h);
        ctx.fillStyle = cDark;
        ctx.fillRect(bx + 2, by, barWidth - 5, 6);
      }

      ctx.fillStyle = cDark;
      ctx.font = 'bold 22px "Courier Prime", monospace';
      ctx.fillText('AUDIO SPECTRUM // 4-STEM VIBE RESONATOR', margin + 20, y + 20);
      ctx.restore();
    }

    // ----- SECTION 4: PRIMARY DIAGNOSIS (Pink Box) -----
    y += eqHeight + 35;
    const diagY = y;

    const zineArchetype = (roastData.archetype || 'WHIPLASH ENTHUSIAST').toUpperCase();
    let fontSize = 115;
    ctx.font = `900 ${fontSize}px "Archivo Black", sans-serif`;
    let maxTextWidth = innerWidth - 80;
    let archetypeLines = wrapText(ctx, zineArchetype, maxTextWidth);

    while (archetypeLines.length > 2 && fontSize > 60) {
      fontSize -= 8;
      ctx.font = `900 ${fontSize}px "Archivo Black", sans-serif`;
      archetypeLines = wrapText(ctx, zineArchetype, maxTextWidth);
    }

    const lineSpacing = fontSize * 1.05;
    const diagHeight = 150 + archetypeLines.length * lineSpacing;

    // Pink box
    ctx.fillStyle = cPink;
    ctx.fillRect(0, y, CANVAS_WIDTH, diagHeight);

    // Black bottom shadow line
    ctx.fillStyle = cDark;
    ctx.fillRect(0, y + diagHeight, CANVAS_WIDTH, 14);

    ctx.lineWidth = 8;
    ctx.strokeStyle = cDark;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(CANVAS_WIDTH, y);
    ctx.stroke();

    ctx.fillStyle = cWhite;
    ctx.font = 'bold 26px "Courier Prime", monospace';
    ctx.fillText('PRIMARY DIAGNOSIS:', margin, y + 36);

    ctx.fillStyle = cWhite;
    ctx.font = `900 ${fontSize}px "Archivo Black", sans-serif`;
    archetypeLines.forEach((line, i) => {
      ctx.fillText(line, margin, y + 110 + i * lineSpacing);
    });

    // Stamp "CERTIFIED UNHINGED"
    if (showStamp) {
      ctx.save();
      ctx.translate(rightEdge - 150, y + diagHeight / 2);
      ctx.rotate((-10 * Math.PI) / 180);

      ctx.fillStyle = cWhite;
      ctx.fillRect(-175, -55, 350, 110);

      ctx.strokeStyle = '#DC2626'; // Deep Stamp Red
      ctx.lineWidth = 10;
      ctx.strokeRect(-175, -55, 350, 110);

      ctx.strokeStyle = '#DC2626';
      ctx.lineWidth = 3;
      ctx.strokeRect(-165, -45, 330, 90);

      ctx.fillStyle = '#DC2626';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '900 48px "Archivo Black", sans-serif';
      ctx.fillText('CERTIFIED', 0, -16);
      ctx.font = '900 38px "Archivo Black", sans-serif';
      ctx.fillText('UNHINGED', 0, 22);
      ctx.restore();
    }

    // ----- SECTION 5: CLINICAL NOTES (Typewriter Box) -----
    y += diagHeight + 35;
    const notesY = y;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillStyle = cDark;
    ctx.font = 'bold 26px "Courier Prime", monospace';
    ctx.fillText('CLINICAL OBSERVATION NOTES:', margin, y);

    y += 40;
    ctx.font = 'bold 28px "Courier Prime", monospace';
    const maxNoteLines = 5;
    const rawNotes = roastData.roast || 'Patient exhibits symptoms of acute sonic coping mechanisms.';
    let notesLines = wrapText(ctx, rawNotes, innerWidth - 260);

    if (notesLines.length > maxNoteLines) {
      notesLines = notesLines.slice(0, maxNoteLines);
      notesLines[maxNoteLines - 1] = notesLines[maxNoteLines - 1].replace(/\s+\S*$/, '...');
    }

    const notesHeight = notesLines.length * 44 + 48;

    ctx.fillStyle = cWhite;
    ctx.fillRect(margin, y, innerWidth, notesHeight);
    ctx.lineWidth = 5;
    ctx.strokeStyle = cDark;
    ctx.strokeRect(margin, y, innerWidth, notesHeight);

    // Left green accent border
    ctx.fillStyle = cLime;
    ctx.fillRect(margin, y, 12, notesHeight);

    ctx.fillStyle = cDark;
    notesLines.forEach((line, i) => {
      ctx.fillText(line, margin + 35, y + 24 + i * 44);
    });

    // ----- SECTION 6: 3 COLOR-BLOCKED VITALS BADGES -----
    y += notesHeight + 35;
    const vitalsY = y;
    const badgeWidth = (innerWidth * 0.68 - 20) / 3;

    ctx.fillStyle = cDark;
    ctx.font = 'bold 24px "Courier Prime", monospace';
    ctx.fillText('VITAL SIGNS (LAB TELEMETRY):', margin, y);

    y += 35;
    const vitalsCards = [
      { label: 'VALENCE', val: `${stats.avgValence}%`, bg: cCyan, qual: 'LOW / DEPRESSED' },
      { label: 'ENERGY', val: `${stats.avgEnergy}%`, bg: cLime, qual: 'ELEVATED' },
      { label: 'DISSONANCE', val: `${Math.max(10, 100 - stats.avgValence)}%`, bg: cPink, qual: 'TERMINAL' },
    ];

    vitalsCards.forEach((vc, idx) => {
      const bx = margin + idx * (badgeWidth + 12);
      ctx.fillStyle = vc.bg;
      ctx.fillRect(bx, y, badgeWidth, 180);
      ctx.lineWidth = 5;
      ctx.strokeStyle = cDark;
      ctx.strokeRect(bx, y, badgeWidth, 180);

      ctx.fillStyle = cDark;
      ctx.font = 'bold 18px "Courier Prime", monospace';
      ctx.fillText(vc.label, bx + 12, y + 16);

      ctx.font = '900 60px "Archivo Black", sans-serif';
      ctx.fillText(vc.val, bx + 12, y + 54);

      ctx.fillStyle = cDark;
      ctx.fillRect(bx + 8, y + 124, badgeWidth - 16, 40);
      ctx.fillStyle = cWhite;
      ctx.font = 'bold 16px "Courier Prime", monospace';
      ctx.fillText(vc.qual, bx + 16, y + 134);
    });

    // ----- SECTION 7: SCATTERED ALBUM EXHIBITS -----
    if (loadedImages[2]) {
      drawExhibit(rightEdge - 110, eqY + 80, loadedImages[2], 'EXH-C', 12, cCyan, cPink, 0.72);
    }
    if (loadedImages[3]) {
      drawExhibit(rightEdge - 120, notesY + 90, loadedImages[3], 'EXH-D', -9, cLime, cDark, 0.78);
    }
    if (loadedImages[0]) {
      drawExhibit(rightEdge - 130, vitalsY + 110, loadedImages[0], 'EXH-A', -5, cPink, cLime, 0.92);
    }
    if (loadedImages[1]) {
      drawExhibit(rightEdge - 70, vitalsY + 230, loadedImages[1], 'EXH-B', 7, cWhite, cPink, 0.95);
    }

    // ----- SECTION 8: FOOTER & SIGN-OFF (y: 1720) -----
    const footerY = 1730;

    ctx.fillStyle = cDark;
    ctx.fillRect(margin, footerY, innerWidth, 4);

    if (showBarcode) {
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';

      // Barcode
      ctx.save();
      ctx.translate(margin, footerY + 30);
      ctx.scale(1, 1.6);
      ctx.font = '76px "Courier Prime", monospace';
      ctx.fillStyle = cDark;
      ctx.fillText('|||| | || || | || |', 0, 0);
      ctx.restore();

      ctx.font = 'bold 22px "Courier Prime", monospace';
      ctx.fillText('PT-ID: 9214-B-SM // OFFICIAL RISOGRAPH AUTOPSY', margin, footerY + 125);
    }

    // Authorized Physician Signature
    ctx.textAlign = 'center';
    ctx.fillStyle = cDark;
    ctx.font = 'bold 24px "Courier Prime", monospace';
    ctx.fillText('AUTHORIZING PSYCHIATRIST', rightEdge - 180, footerY + 125);

    ctx.beginPath();
    ctx.moveTo(rightEdge - 360, footerY + 105);
    ctx.lineTo(rightEdge, footerY + 105);
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.save();
    ctx.translate(rightEdge - 180, footerY + 70);
    ctx.rotate((-7 * Math.PI) / 180);
    ctx.fillStyle = cPink;
    ctx.font = '96px "Nothing You Could Do", cursive';
    ctx.fillText('Dr. Sonic Mirror', 0, 0);
    ctx.restore();

    setIsRendering(false);
  }, [user, tracks, stats, roastData, posterTheme, wrappedColorway, showGrain, showStamp, showSpectrum, showBarcode]);

  useEffect(() => {
    renderPoster();
  }, [renderPoster]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const safeArchetype = (roastData?.archetype || 'sonic-mirror-roast').toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const filePrefix = posterTheme === 'wrapped2024' ? 'wrapped-2024' : 'diagnostic-chart';
        a.download = `${safeArchetype}-${filePrefix}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        confetti({
          particleCount: 110,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#0047FF', '#FF007F', '#CCFF00', '#FF6D00'],
        });
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3000);
      },
      'image/png',
      1.0
    );
  };

  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], 'sonic-mirror-wrapped.png', { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'My Sonic Mirror Spotify Wrapped',
            text: `My Spotify 2024 Wrapped diagnosis: ${roastData?.archetype || 'Certified Unhinged'}! #${roastData?.archetype?.replace(/\s+/g, '') || 'SonicMirror'}`,
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
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: CUSTOMIZATION & THEME SELECTOR */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_#000]">
            
            {/* Header */}
            <div className="flex items-center gap-2 border-b-3 border-black pb-3 mb-5 font-mono text-xs font-bold uppercase tracking-wider">
              <Sliders className="w-4 h-4 text-[#FF007F]" />
              <span>POSTER STUDIO: 1080 x 1920 (9:16 STORY)</span>
            </div>

            {/* 1. THEME SELECTOR (Wrapped 2024 vs Zine Lab) */}
            <div className="mb-6">
              <label className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2.5 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#0047FF]" />
                <span>CHOOSE POSTER THEME:</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Button 1: Wrapped 2024 */}
                <button
                  type="button"
                  onClick={() => setPosterTheme('wrapped2024')}
                  className={`p-3.5 border-3 border-black font-headline text-sm uppercase tracking-wider transition-all text-left flex flex-col gap-1 ${
                    posterTheme === 'wrapped2024'
                      ? 'bg-[#CCFF00] text-black shadow-[4px_4px_0px_#000] -translate-y-0.5 font-bold'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base">⚡ WRAPPED 2024</span>
                    {posterTheme === 'wrapped2024' && <span className="w-2 h-2 rounded-full bg-black animate-ping" />}
                  </div>
                  <span className="font-mono text-[10px] text-zinc-600 font-normal">
                    Geometric 3D Neon Chevrons
                  </span>
                </button>

                {/* Button 2: Zine Lab */}
                <button
                  type="button"
                  onClick={() => setPosterTheme('zinelab')}
                  className={`p-3.5 border-3 border-black font-headline text-sm uppercase tracking-wider transition-all text-left flex flex-col gap-1 ${
                    posterTheme === 'zinelab'
                      ? 'bg-[#FF007F] text-white shadow-[4px_4px_0px_#000] -translate-y-0.5 font-bold'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base">📋 ZINE LAB</span>
                    {posterTheme === 'zinelab' && <span className="w-2 h-2 rounded-full bg-white animate-ping" />}
                  </div>
                  <span className="font-mono text-[10px] opacity-90 font-normal">
                    Risograph Clinical Specimen
                  </span>
                </button>

              </div>
            </div>

            {/* 2. SUB-OPTIONS ACCORDING TO THEME */}
            {posterTheme === 'wrapped2024' ? (
              <div className="mb-6 p-4 border-2 border-black bg-zinc-50">
                <label className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2.5 flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-[#FF5722]" />
                  <span>WRAPPED COLORWAY:</span>
                </label>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setWrappedColorway('dark')}
                    className={`py-2 px-3 border-2 border-black font-headline text-xs uppercase tracking-wider ${
                      wrappedColorway === 'dark' ? 'bg-black text-white shadow-[2px_2px_0px_#000] font-bold' : 'bg-white text-black'
                    }`}
                  >
                    Obsidian
                  </button>

                  <button
                    type="button"
                    onClick={() => setWrappedColorway('red')}
                    className={`py-2 px-3 border-2 border-black font-headline text-xs uppercase tracking-wider ${
                      wrappedColorway === 'red' ? 'bg-[#E11D48] text-white shadow-[2px_2px_0px_#000] font-bold' : 'bg-white text-black'
                    }`}
                  >
                    Cadmium
                  </button>

                  <button
                    type="button"
                    onClick={() => setWrappedColorway('yellow')}
                    className={`py-2 px-3 border-2 border-black font-headline text-xs uppercase tracking-wider ${
                      wrappedColorway === 'yellow' ? 'bg-[#FFE600] text-black shadow-[2px_2px_0px_#000] font-bold' : 'bg-white text-black'
                    }`}
                  >
                    Canary
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5 mb-6 p-4 border-2 border-black bg-zinc-50">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                  SPECIMEN LAYERS:
                </span>
                
                <button
                  type="button"
                  onClick={() => setShowGrain(!showGrain)}
                  className="flex items-center gap-2.5 p-2 border border-black bg-white text-left text-xs font-mono font-bold uppercase"
                >
                  {showGrain ? <CheckSquare className="w-4 h-4 text-[#FF007F] shrink-0" /> : <Square className="w-4 h-4 text-zinc-400 shrink-0" />}
                  <span>Paper Texture Grain</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowStamp(!showStamp)}
                  className="flex items-center gap-2.5 p-2 border border-black bg-white text-left text-xs font-mono font-bold uppercase"
                >
                  {showStamp ? <CheckSquare className="w-4 h-4 text-[#FF007F] shrink-0" /> : <Square className="w-4 h-4 text-zinc-400 shrink-0" />}
                  <span>"Certified Unhinged" Stamp</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowSpectrum(!showSpectrum)}
                  className="flex items-center gap-2.5 p-2 border border-black bg-white text-left text-xs font-mono font-bold uppercase"
                >
                  {showSpectrum ? <CheckSquare className="w-4 h-4 text-[#FF007F] shrink-0" /> : <Square className="w-4 h-4 text-zinc-400 shrink-0" />}
                  <span>4-Stem Audio Spectrum</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowBarcode(!showBarcode)}
                  className="flex items-center gap-2.5 p-2 border border-black bg-white text-left text-xs font-mono font-bold uppercase"
                >
                  {showBarcode ? <CheckSquare className="w-4 h-4 text-[#FF007F] shrink-0" /> : <Square className="w-4 h-4 text-zinc-400 shrink-0" />}
                  <span>Barcode & Signature</span>
                </button>
              </div>
            )}

            {/* Export Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDownload}
                disabled={isRendering}
                className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 border-4 border-black bg-[#CCFF00] text-black font-headline text-xl uppercase tracking-wider hover:bg-black hover:text-[#CCFF00] transition-all shadow-[6px_6px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 disabled:opacity-50"
              >
                {downloadSuccess ? (
                  <>
                    <Check className="w-6 h-6 text-black" />
                    <span>DOWNLOADED (1080x1920 PNG)!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-6 h-6" />
                    <span>DOWNLOAD HIGH-RES POSTER</span>
                  </>
                )}
              </button>

              <button
                onClick={handleShare}
                disabled={isRendering}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 border-3 border-black bg-[#FF007F] text-white font-headline text-lg uppercase tracking-wider hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_#000] disabled:opacity-50"
              >
                {copiedSuccess ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>COPIED IMAGE TO CLIPBOARD!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-5 h-5" />
                    <span>SHARE STORY DIRECTLY</span>
                  </>
                )}
              </button>

              {onRegenerateRoast && (
                <button
                  onClick={() => onRegenerateRoast(currentTone)}
                  disabled={isRegenerating || isRendering}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-black bg-white hover:bg-zinc-100 font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[3px_3px_0px_#000]"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                  <span>RE-ROLL DIAGNOSIS CONTENT</span>
                </button>
              )}
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: 3D PERSPECTIVE POSTER PREVIEW */}
        <div className="lg:col-span-7 flex justify-center">
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transition: 'transform 0.15s ease-out',
            }}
            className="relative w-full max-w-[440px] aspect-[9/16] border-4 border-black bg-black shadow-[10px_10px_0px_#000] p-2"
          >
            <div className="relative w-full h-full overflow-hidden bg-black flex items-center justify-center">
              {isRendering && (
                <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center z-20 text-center p-6">
                  <RefreshCw className="w-8 h-8 text-[#CCFF00] animate-spin mb-3" />
                  <p className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                    RENDERING {posterTheme === 'wrapped2024' ? 'WRAPPED 2024' : 'ZINE LAB'} CANVAS...
                  </p>
                </div>
              )}
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="w-full h-full object-contain block select-none pointer-events-none"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
