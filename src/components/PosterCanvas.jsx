import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Download, Sparkles, Share2, RefreshCw, Check, Sliders, CheckSquare, Square } from 'lucide-react';
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

  // Customizer Toggles from Stitch Artboard 4
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

  const applyNoiseOverlay = (ctx, opacity = 0.22) => {
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

  const renderPoster = useCallback(async () => {
    await document.fonts.ready;
    
    const canvas = canvasRef.current;
    if (!canvas || !roastData || !stats) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setIsRendering(true);

    // Stitch Risograph Zine Palette
    const cCream = '#F4F4F0';
    const cLime = '#D4FF00';
    const cPink = '#FF007A';
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

    // Load top 4 album images
    const topTracksToUse = tracks.slice(0, 4);
    const loadedImages = (
      await Promise.all(
        topTracksToUse.map((t) => {
          const url = t.album?.images?.[1]?.url || t.album?.images?.[0]?.url;
          return loadCorsImage(url);
        })
      )
    );

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

    const archetype = (roastData.archetype || 'WHIPLASH ENTHUSIAST').toUpperCase();
    let fontSize = 115;
    ctx.font = `900 ${fontSize}px "Archivo Black", sans-serif`;
    let maxTextWidth = innerWidth - 80;
    let archetypeLines = wrapText(ctx, archetype, maxTextWidth);

    while (archetypeLines.length > 2 && fontSize > 60) {
      fontSize -= 8;
      ctx.font = `900 ${fontSize}px "Archivo Black", sans-serif`;
      archetypeLines = wrapText(ctx, archetype, maxTextWidth);
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
  }, [user, tracks, stats, roastData, showGrain, showStamp, showSpectrum, showBarcode]);

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
        a.download = `${safeArchetype}-diagnostic-poster.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        confetti({
          particleCount: 100,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#D4FF00', '#FF007A', '#00F0FF', '#111111'],
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
      const file = new File([blob], 'sonic-mirror-diagnostic.png', { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'My Sonic Mirror Diagnosis',
            text: `My Spotify diagnosis: ${roastData?.archetype || 'Certified Unhinged'}! #${roastData?.archetype?.replace(/\s+/g, '') || 'SonicMirror'}`,
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
        
        {/* LEFT COLUMN: CUSTOMIZATION & EXPORT CONTROLS (From Stitch Artboard 4) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          <div className="border-3 border-zine-black bg-white p-6 shadow-brutal">
            <div className="flex items-center gap-2 border-b-2 border-zine-black pb-3 mb-4 font-mono text-xs font-bold uppercase tracking-wider">
              <Sliders className="w-4 h-4 text-zine-pink" />
              <span>POSTER SPECS: 1080 x 1920 (9:16 STORY)</span>
            </div>

            <p className="text-sm font-body text-zinc-700 mb-6">
              Customize the Risograph visual layers before downloading your high-res diagnosis chart.
            </p>

            {/* Checkbox Toggles */}
            <div className="flex flex-col gap-3 mb-6">
              
              <button
                type="button"
                onClick={() => setShowGrain(!showGrain)}
                className="flex items-center gap-3 p-3 border-2 border-zine-black bg-zinc-50 hover:bg-white text-left transition-colors"
              >
                {showGrain ? <CheckSquare className="w-5 h-5 text-zine-pink shrink-0" /> : <Square className="w-5 h-5 text-zinc-400 shrink-0" />}
                <span className="font-mono text-xs font-bold uppercase text-black">
                  Paper Texture Grain (Aged Photocopy)
                </span>
              </button>

              <button
                type="button"
                onClick={() => setShowStamp(!showStamp)}
                className="flex items-center gap-3 p-3 border-2 border-zine-black bg-zinc-50 hover:bg-white text-left transition-colors"
              >
                {showStamp ? <CheckSquare className="w-5 h-5 text-zine-pink shrink-0" /> : <Square className="w-5 h-5 text-zinc-400 shrink-0" />}
                <span className="font-mono text-xs font-bold uppercase text-black">
                  "Certified Unhinged" Rubber Stamp
                </span>
              </button>

              <button
                type="button"
                onClick={() => setShowSpectrum(!showSpectrum)}
                className="flex items-center gap-3 p-3 border-2 border-zine-black bg-zinc-50 hover:bg-white text-left transition-colors"
              >
                {showSpectrum ? <CheckSquare className="w-5 h-5 text-zine-pink shrink-0" /> : <Square className="w-5 h-5 text-zinc-400 shrink-0" />}
                <span className="font-mono text-xs font-bold uppercase text-black">
                  4-Stem Audio Spectrum Analyzer
                </span>
              </button>

              <button
                type="button"
                onClick={() => setShowBarcode(!showBarcode)}
                className="flex items-center gap-3 p-3 border-2 border-zine-black bg-zinc-50 hover:bg-white text-left transition-colors"
              >
                {showBarcode ? <CheckSquare className="w-5 h-5 text-zine-pink shrink-0" /> : <Square className="w-5 h-5 text-zinc-400 shrink-0" />}
                <span className="font-mono text-xs font-bold uppercase text-black">
                  Case Barcode & Authorizing Signature
                </span>
              </button>

            </div>

            {/* Export Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDownload}
                disabled={isRendering}
                className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 border-3 border-zine-black bg-zine-lime text-black font-headline text-xl uppercase tracking-wider hover:bg-black hover:text-zine-lime transition-all shadow-brutal hover:translate-x-0.5 hover:translate-y-0.5 disabled:opacity-50"
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
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 border-3 border-zine-black bg-zine-pink text-white font-headline text-lg uppercase tracking-wider hover:bg-black hover:text-white transition-all shadow-brutal-sm disabled:opacity-50"
              >
                {copiedSuccess ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>COPIED IMAGE TO CLIPBOARD!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-5 h-5" />
                    <span>SHARE DIRECTLY</span>
                  </>
                )}
              </button>

              {onRegenerateRoast && (
                <button
                  onClick={() => onRegenerateRoast(currentTone)}
                  disabled={isRegenerating || isRendering}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-zine-black bg-white hover:bg-zinc-100 font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-brutal-sm"
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
            className="relative w-full max-w-[420px] aspect-[9/16] border-4 border-zine-black bg-white shadow-brutal-lg p-2"
          >
            <div className="relative w-full h-full overflow-hidden bg-white flex items-center justify-center">
              {isRendering && (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center z-20 text-center p-6">
                  <RefreshCw className="w-8 h-8 text-zine-pink animate-spin mb-3" />
                  <p className="text-xs font-bold text-black font-mono uppercase tracking-wider">
                    SYNTHESIZING RISOGRAPH PLATES...
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
