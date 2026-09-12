import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Download, Sparkles, Share2, RefreshCw, Check } from 'lucide-react';
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

  const applyNoiseOverlay = (ctx, opacity = 0.25) => {
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

  const renderPoster = useCallback(async () => {
    await document.fonts.ready;
    
    const canvas = canvasRef.current;
    if (!canvas || !roastData || !stats) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setIsRendering(true);

    // Spotify Wrapped Style Colors
    const cBlue = '#0047FF';
    const cPink = '#FF007F';
    const cGreen = '#CCFF00';
    const cPurple = '#5A189A';
    const cOrange = '#FF6D00';
    const cDark = '#0F172A';
    const cWhite = '#FFFFFF';

    // Base background
    ctx.fillStyle = cBlue;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    applyNoiseOverlay(ctx, 0.25);

    const margin = 80;
    const innerWidth = CANVAS_WIDTH - margin * 2;
    const rightEdge = CANVAS_WIDTH - margin;

    // ----- SECTION 1: HEADER (y: 60 -> 190) -----
    let y = 60;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    
    ctx.fillStyle = cGreen;
    ctx.font = '90px "Anton", sans-serif';
    ctx.fillText('SONIC MIRROR', margin, y);
    
    ctx.fillStyle = cWhite;
    ctx.font = 'bold 30px "Courier Prime", monospace';
    ctx.fillText('DEPT. OF MUSICAL PATHOLOGY', margin, y + 100);

    ctx.textAlign = 'right';
    const caseNum = Math.floor(Math.random() * 90000) + 10000;
    ctx.fillStyle = cWhite;
    ctx.font = 'bold 28px "Courier Prime", monospace';
    ctx.fillText(`CASE #SM-`, rightEdge - 110, y + 20);
    ctx.font = 'normal 42px "Courier Prime", monospace';
    ctx.fillText(`${caseNum}`, rightEdge, y + 10);
    
    ctx.font = 'bold 24px "Courier Prime", monospace';
    ctx.fillStyle = cGreen;
    ctx.fillText('DATE:', rightEdge - 200, y + 105);
    ctx.fillStyle = cWhite;
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
    ctx.fillText(today, rightEdge, y + 105);
    
    ctx.fillStyle = cGreen;
    ctx.fillRect(margin, y + 150, innerWidth, 8);


    // ----- SECTION 2: INTAKE FIELDS (y: 240 -> 330) -----
    y += 180;
    ctx.textAlign = 'left';
    ctx.fillStyle = cGreen;
    ctx.font = 'bold 22px "Courier Prime", monospace';
    ctx.fillText('PATIENT NAME:', margin, y);
    ctx.fillText('DOB / JOINED:', margin + 500, y);
    
    ctx.fillStyle = cWhite;
    ctx.font = '32px "Courier Prime", monospace';
    const patientName = (user?.display_name || 'UNKNOWN PATIENT').toUpperCase();
    // Truncate name if too long
    const shortName = patientName.length > 20 ? patientName.substring(0, 18) + '...' : patientName;
    ctx.fillText(shortName, margin, y + 36);
    ctx.fillText('2014-08', margin + 500, y + 36);
    
    ctx.fillStyle = cWhite;
    ctx.fillRect(margin, y + 76, 400, 3);
    ctx.fillRect(margin + 500, y + 76, 250, 3);


    // ----- SECTION 3: ECG WAVEFORM (y: 360 -> 540) -----
    y += 120;
    const ecgHeight = 180;
    
    // Panel Background
    ctx.fillStyle = cGreen;
    ctx.beginPath();
    ctx.roundRect(margin, y, innerWidth, ecgHeight, 16);
    ctx.fill();
    // Border
    ctx.lineWidth = 5;
    ctx.strokeStyle = cDark;
    ctx.stroke();
    // Shadow
    ctx.fillStyle = cPink;
    ctx.beginPath();
    ctx.roundRect(margin + 12, y + 12, innerWidth, ecgHeight, 16);
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    // Grid Lines
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(margin, y, innerWidth, ecgHeight, 16);
    ctx.clip();
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.15)';
    ctx.lineWidth = 2;
    for(let i=1; i<4; i++) {
      ctx.beginPath(); ctx.moveTo(margin, y + i * (ecgHeight/4)); ctx.lineTo(margin + innerWidth, y + i * (ecgHeight/4)); ctx.stroke();
    }
    for(let i=1; i<10; i++) {
      ctx.beginPath(); ctx.moveTo(margin + i * (innerWidth/10), y); ctx.lineTo(margin + i * (innerWidth/10), y + ecgHeight); ctx.stroke();
    }
    
    ctx.fillStyle = cDark;
    ctx.globalAlpha = 0.8;
    ctx.font = 'bold 24px "Courier Prime", monospace';
    ctx.fillText('ECG // AUDIO VALENCE', margin + 20, y + 20);
    ctx.globalAlpha = 1.0;

    // Line
    ctx.strokeStyle = cBlue;
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(margin, y + ecgHeight/2);
    const points = [
      [50, 0], [60, -30], [70, 50], [85, -50], [100, 0], [250, 0], 
      [260, -60], [275, 60], [290, -10], [310, 0], [450, 0], [460, -10], 
      [470, -40], [485, 70], [500, -60], [515, 20], [530, 0], [700, 0], 
      [710, -50], [730, 50], [745, -20], [760, 0], [920, 0]
    ];
    let cx = margin;
    let cy = y + ecgHeight/2;
    points.forEach(pt => {
      cx = margin + pt[0] * (innerWidth / 920);
      let pY = cy + pt[1];
      ctx.lineTo(cx, pY);
    });
    ctx.lineTo(margin + innerWidth, cy);
    ctx.stroke();
    ctx.restore();


    // ----- SECTION 4: DIAGNOSIS BLOCK (y: 580 -> 880) -----
    y += ecgHeight + 40;
    const diagHeight = 300;
    
    ctx.fillStyle = cPink;
    ctx.fillRect(0, y, CANVAS_WIDTH, diagHeight);
    
    // Bottom border/shadow
    ctx.fillStyle = cPurple;
    ctx.fillRect(0, y + diagHeight, CANVAS_WIDTH, 16); 
    
    ctx.lineWidth = 10;
    ctx.strokeStyle = cDark;
    ctx.beginPath();
    ctx.moveTo(0, y); ctx.lineTo(CANVAS_WIDTH, y);
    ctx.moveTo(0, y + diagHeight); ctx.lineTo(CANVAS_WIDTH, y + diagHeight);
    ctx.stroke();
    
    ctx.fillStyle = cWhite;
    ctx.font = 'bold 28px "Courier Prime", monospace';
    ctx.fillText('PRIMARY DIAGNOSIS:', margin, y + 40);
    
    // Dynamic Font Scaling for Archetype
    const archetype = (roastData.archetype || 'WHIPLASH ENTHUSIAST').toUpperCase();
    let fontSize = 130;
    ctx.font = `${fontSize}px "Anton", sans-serif`;
    let maxTextWidth = innerWidth - 100; // Leave room for stamp padding
    let archetypeLines = wrapText(ctx, archetype, maxTextWidth);
    
    while (archetypeLines.length > 2 && fontSize > 60) {
      fontSize -= 10;
      ctx.font = `${fontSize}px "Anton", sans-serif`;
      archetypeLines = wrapText(ctx, archetype, maxTextWidth);
    }
    
    ctx.fillStyle = cDark;
    const lineSpacing = fontSize * 1.05;
    archetypeLines.forEach((line, i) => {
      ctx.fillText(line, margin, y + 140 + i * lineSpacing);
    });

    // Stamp "CONFIRMED" - bounded to right edge safely
    ctx.save();
    ctx.translate(rightEdge - 160, y + 150);
    ctx.rotate(-8 * Math.PI / 180);
    ctx.strokeStyle = cGreen;
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.roundRect(-160, -60, 320, 120, 16);
    ctx.stroke();
    ctx.fillStyle = cGreen;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '80px "Anton", sans-serif';
    ctx.fillText('CONFIRMED', 0, 0);
    ctx.restore();


    // ----- SECTION 5: CLINICAL NOTES (y: 920 -> dynamic) -----
    y += diagHeight + 40;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillStyle = cGreen;
    ctx.font = 'bold 28px "Courier Prime", monospace';
    ctx.fillText('CLINICAL NOTES:', margin, y);

    y += 45;
    
    // Truncate notes to fit maximum 5 lines
    ctx.font = 'bold 30px "Courier Prime", monospace';
    const maxNoteLines = 5;
    const rawNotes = roastData.roast || 'Patient exhibits symptoms of bad taste.';
    let notesLines = wrapText(ctx, rawNotes, innerWidth - 60);
    
    if (notesLines.length > maxNoteLines) {
      notesLines = notesLines.slice(0, maxNoteLines);
      notesLines[maxNoteLines - 1] = notesLines[maxNoteLines - 1].replace(/\s+\S*$/, '...');
    }

    const notesHeight = notesLines.length * 45 + 50;
    
    // Notes Background Box
    ctx.fillStyle = 'rgba(15, 23, 42, 0.25)'; // cDark/25
    ctx.beginPath();
    ctx.roundRect(margin, y, innerWidth, notesHeight, 16);
    ctx.fill();
    ctx.lineWidth = 10;
    ctx.strokeStyle = cGreen;
    ctx.beginPath();
    ctx.moveTo(margin + 6, y + 20);
    ctx.lineTo(margin + 6, y + notesHeight - 20);
    ctx.stroke();

    ctx.fillStyle = cWhite;
    notesLines.forEach((line, i) => {
      ctx.fillText(line, margin + 35, y + 25 + i * 45);
    });


    // ----- SECTION 6 & 7: VITALS & EXHIBITS (Shared Y space) -----
    y += notesHeight + 40;
    const sharedHeight = 440; // Plenty of room for both table and exhibits
    
    // Draw Purple Block for Vitals (Full bleed)
    ctx.fillStyle = cPurple;
    ctx.fillRect(0, y, CANVAS_WIDTH, sharedHeight);
    ctx.fillStyle = cGreen;
    ctx.fillRect(0, y + sharedHeight, CANVAS_WIDTH, 12); 
    ctx.strokeStyle = cDark;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(0, y); ctx.lineTo(CANVAS_WIDTH, y);
    ctx.moveTo(0, y + sharedHeight); ctx.lineTo(CANVAS_WIDTH, y + sharedHeight);
    ctx.stroke();

    // Vitals Header
    ctx.fillStyle = cGreen;
    ctx.font = 'bold 28px "Courier Prime", monospace';
    ctx.fillText('VITAL SIGNS:', margin, y + 30);

    // Vitals Table (Takes up ~65% of width)
    const tableY = y + 80;
    const tWidth = innerWidth * 0.65;
    
    ctx.fillStyle = cWhite;
    ctx.fillRect(margin, tableY, tWidth, 240);
    ctx.strokeRect(margin, tableY, tWidth, 240);
    
    ctx.beginPath(); ctx.moveTo(margin, tableY + 80); ctx.lineTo(margin + tWidth, tableY + 80); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(margin, tableY + 160); ctx.lineTo(margin + tWidth, tableY + 160); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(margin + tWidth*0.4, tableY); ctx.lineTo(margin + tWidth*0.4, tableY + 240); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(margin + tWidth*0.65, tableY); ctx.lineTo(margin + tWidth*0.65, tableY + 240); ctx.stroke();

    const rows = [
      { label: 'ENERGY LEVEL', val: `${stats.avgEnergy}%`, qual: 'ELEVATED / MANIC', bg: cOrange, text: cWhite },
      { label: 'HAPPINESS', val: `${stats.avgValence}%`, qual: 'CRITICALLY LOW', bg: cBlue, text: cWhite },
      { label: 'TEMPO (BPM)', val: `${stats.avgTempo}`, qual: 'STABLE', bg: cGreen, text: cDark },
    ];

    rows.forEach((r, i) => {
      const ry = tableY + i * 80;
      
      ctx.fillStyle = cDark;
      ctx.font = 'bold 20px "Courier Prime", monospace';
      ctx.fillText(r.label, margin + 20, ry + 30);
      
      ctx.font = 'bold 36px "Courier Prime", monospace';
      ctx.fillText(r.val, margin + tWidth*0.4 + 20, ry + 22);
      
      ctx.fillStyle = r.bg;
      ctx.fillRect(margin + tWidth*0.65, ry, tWidth*0.35, 80);
      ctx.fillStyle = r.text;
      ctx.font = 'italic bold 20px "Courier Prime", monospace';
      // Wrap qual if needed
      const qualLines = wrapText(ctx, r.qual, tWidth*0.35 - 20);
      qualLines.forEach((ql, qi) => {
        ctx.fillText(ql, margin + tWidth*0.65 + 15, ry + (qualLines.length > 1 ? 16 : 28) + qi * 26);
      });
    });

    // Exhibits (Right aligned in the purple block)
    const topTracksToUse = tracks.slice(0, 2);
    const loadedImages = (
      await Promise.all(
        topTracksToUse.map((t) => {
          const url = t.album?.images?.[1]?.url || t.album?.images?.[0]?.url;
          return loadCorsImage(url);
        })
      )
    ).filter(Boolean);

    if (loadedImages.length > 0) {
      const exhX = rightEdge - 150;
      const exhY = y + 160;
      ctx.save();
      ctx.translate(exhX, exhY);
      
      // Label
      ctx.rotate(4 * Math.PI / 180);
      ctx.fillStyle = cDark;
      ctx.fillRect(-100, -130, 200, 36);
      ctx.lineWidth = 4;
      ctx.strokeRect(-100, -130, 200, 36);
      ctx.fillStyle = cGreen;
      ctx.font = 'bold 20px "Courier Prime", monospace';
      ctx.fillText('EXHIBITS', -85, -122);
      ctx.rotate(-4 * Math.PI / 180);

      // Photo 1
      ctx.rotate(-6 * Math.PI / 180);
      ctx.fillStyle = cOrange;
      ctx.fillRect(-100, -70, 200, 230);
      ctx.lineWidth = 6;
      ctx.strokeRect(-100, -70, 200, 230);
      
      // Shadow behind image
      ctx.fillStyle = cDark; 
      ctx.fillRect(-85, -55, 170, 170);
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(loadedImages[0], -85, -55, 170, 170);
      ctx.strokeRect(-85, -55, 170, 170);
      
      ctx.font = 'bold 20px "Courier Prime", monospace';
      ctx.fillText('EXH-A', -70, 130);
      
      // Tape
      ctx.fillStyle = cGreen;
      ctx.translate(0, -70);
      ctx.rotate(8 * Math.PI / 180);
      ctx.fillRect(-35, -12, 70, 24);
      ctx.strokeRect(-35, -12, 70, 24);
      ctx.rotate(-8 * Math.PI / 180);
      ctx.translate(0, 70);
      ctx.rotate(6 * Math.PI / 180);

      // Photo 2
      if (loadedImages[1]) {
        ctx.translate(40, 60); // overlap
        ctx.rotate(5 * Math.PI / 180);
        ctx.fillStyle = cPink;
        ctx.fillRect(-100, -70, 200, 230);
        ctx.lineWidth = 6;
        ctx.strokeRect(-100, -70, 200, 230);
        
        ctx.fillStyle = cDark;
        ctx.fillRect(-85, -55, 170, 170);
        ctx.drawImage(loadedImages[1], -85, -55, 170, 170);
        ctx.strokeRect(-85, -55, 170, 170);
        
        ctx.font = 'bold 20px "Courier Prime", monospace';
        ctx.fillText('EXH-B', -70, 130);
        
        // Tape
        ctx.fillStyle = cGreen;
        ctx.translate(0, -70);
        ctx.rotate(-5 * Math.PI / 180);
        ctx.fillRect(-35, -12, 70, 24);
        ctx.strokeRect(-35, -12, 70, 24);
      }
      ctx.restore();
    }


    // ----- SECTION 8: FOOTER (y: 1740) -----
    // Fixed firmly at bottom to avoid overlap
    const footerY = 1720;
    
    ctx.fillStyle = cGreen;
    ctx.fillRect(0, footerY - 12, CANVAS_WIDTH, 12);
    ctx.lineWidth = 8;
    ctx.strokeStyle = cDark;
    ctx.beginPath();
    ctx.moveTo(0, footerY); ctx.lineTo(CANVAS_WIDTH, footerY);
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillStyle = cWhite;
    
    // Barcode 
    ctx.save();
    ctx.translate(margin, footerY + 40);
    ctx.scale(1, 1.8);
    ctx.font = '80px "Courier Prime", monospace';
    ctx.fillText('|||| | || || |', 0, 0);
    ctx.restore();
    
    ctx.fillStyle = cGreen;
    ctx.font = 'bold 24px "Courier Prime", monospace';
    ctx.letterSpacing = '4px';
    ctx.fillText('PT-ID: 8092-2244-SM', margin, footerY + 130);
    ctx.letterSpacing = '0px';

    // Signature 
    ctx.textAlign = 'center';
    ctx.fillStyle = cWhite;
    ctx.font = 'bold 26px "Courier Prime", monospace';
    ctx.fillText('AUTHORIZING PHYSICIAN', rightEdge - 180, footerY + 130);
    ctx.beginPath();
    ctx.moveTo(rightEdge - 360, footerY + 110);
    ctx.lineTo(rightEdge, footerY + 110);
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.save();
    ctx.translate(rightEdge - 180, footerY + 80);
    ctx.rotate(-8 * Math.PI / 180);
    ctx.fillStyle = cPink;
    ctx.font = '100px "Nothing You Could Do", cursive';
    ctx.globalCompositeOperation = 'screen';
    ctx.fillText('Dr. S. Mirror', 0, 0);
    ctx.restore();

    setIsRendering(false);
  }, [user, tracks, stats, roastData]);

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
        a.download = `${safeArchetype}-poster.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#0047FF', '#FF007F', '#CCFF00'],
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
      <div className="text-center mb-12">
        <h2 className="text-4xl sm:text-6xl font-display text-white tracking-tight">
          YOUR <span className="text-studio-glow">DIAGNOSTIC CHART</span>
        </h2>
        <p className="text-sm text-static-grey mt-4 max-w-lg mx-auto uppercase tracking-widest">
          Spotify Wrapped Aesthetics × Medical Intake Form
        </p>
      </div>

      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 0.15s ease-out',
        }}
        className="relative w-full max-w-[380px] sm:max-w-[440px] aspect-[9/16] p-2 bg-void shadow-2xl border border-static-grey group"
      >
        <div className="relative w-full h-full overflow-hidden bg-black flex items-center justify-center">
          {isRendering && (
            <div className="absolute inset-0 bg-void/80 backdrop-blur-md flex flex-col items-center justify-center z-20 text-center p-6">
              <RefreshCw className="w-8 h-8 text-studio-glow animate-spin mb-3" />
              <p className="text-sm font-bold text-white font-body uppercase tracking-wider">Rendering Diagnostics...</p>
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

      <div className="flex flex-wrap items-center justify-center gap-4 mt-12 w-full max-w-md">
        <button
          onClick={handleDownload}
          disabled={isRendering}
          className="flex-1 inline-flex items-center justify-center gap-2.5 px-7 py-4 border-2 border-studio-glow bg-studio-glow text-void font-display text-2xl uppercase tracking-wider hover:bg-void hover:text-studio-glow transition-all disabled:opacity-50"
        >
          {downloadSuccess ? (
            <>
              <Check className="w-6 h-6" />
              <span>DOWNLOADED</span>
            </>
          ) : (
            <>
              <Download className="w-6 h-6" />
              <span>EXPORT CHART</span>
            </>
          )}
        </button>

        <button
          onClick={handleShare}
          disabled={isRendering}
          className="inline-flex items-center justify-center gap-2 px-5 py-4 border-2 border-static-grey text-sleeve-white font-display text-2xl uppercase tracking-wider hover:border-sleeve-white transition-all disabled:opacity-50"
          title="Share or copy poster"
        >
          {copiedSuccess ? (
            <>
              <Check className="w-6 h-6 text-studio-glow" />
              <span>COPIED</span>
            </>
          ) : (
            <>
              <Share2 className="w-5 h-5" />
              <span>SHARE</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
