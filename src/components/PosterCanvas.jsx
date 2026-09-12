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
    // Wait for custom fonts to be ready
    await document.fonts.ready;
    
    const canvas = canvasRef.current;
    if (!canvas || !roastData || !stats) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setIsRendering(true);

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

    // 1. Header
    let y = 80;
    ctx.fillStyle = cGreen;
    ctx.font = '100px "Anton", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('SONIC MIRROR', margin, y);
    
    ctx.fillStyle = cWhite;
    ctx.font = 'bold 36px "Courier Prime", monospace';
    ctx.fillText('DEPT. OF MUSICAL PATHOLOGY', margin, y + 105);

    // Case Info (Right Aligned)
    ctx.textAlign = 'right';
    const caseNum = Math.floor(Math.random() * 90000) + 10000;
    ctx.fillText('CASE #SM-', CANVAS_WIDTH - margin - 120, y);
    ctx.font = 'normal 48px "Courier Prime", monospace';
    ctx.fillText(caseNum.toString(), CANVAS_WIDTH - margin, y - 5);
    
    ctx.font = 'bold 28px "Courier Prime", monospace';
    ctx.fillStyle = cGreen;
    ctx.fillText('DATE:', CANVAS_WIDTH - margin - 220, y + 112);
    ctx.fillStyle = cWhite;
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
    ctx.fillText(today, CANVAS_WIDTH - margin, y + 112);
    
    // Header underline
    y += 180;
    ctx.fillStyle = cGreen;
    ctx.fillRect(margin, y, innerWidth, 10);

    // 2. Intake Fields
    y += 40;
    ctx.textAlign = 'left';
    ctx.fillStyle = cGreen;
    ctx.font = 'bold 24px "Courier Prime", monospace';
    ctx.fillText('PATIENT NAME:', margin, y);
    ctx.fillText('DOB / JOINED:', margin + 500, y);
    
    y += 40;
    ctx.fillStyle = cWhite;
    ctx.font = '36px "Courier Prime", monospace';
    const patientName = (user?.display_name || 'UNKNOWN PATIENT').toUpperCase();
    ctx.fillText(patientName, margin, y);
    ctx.fillText('2014-08', margin + 500, y);
    
    // Underlines
    y += 45;
    ctx.fillStyle = cWhite;
    ctx.fillRect(margin, y, 400, 4);
    ctx.fillRect(margin + 500, y, 300, 4);

    // 3. Vitals Waveform
    y += 60;
    const ecgHeight = 220;
    // ECG Background
    ctx.fillStyle = cGreen;
    ctx.beginPath();
    ctx.roundRect(margin, y, innerWidth, ecgHeight, 20);
    ctx.fill();
    // ECG Border
    ctx.lineWidth = 6;
    ctx.strokeStyle = cDark;
    ctx.stroke();
    // ECG Shadow
    ctx.fillStyle = cPink;
    ctx.beginPath();
    ctx.roundRect(margin + 16, y + 16, innerWidth, ecgHeight, 20);
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    // Grid lines inside ECG
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(margin, y, innerWidth, ecgHeight, 20);
    ctx.clip();
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.15)';
    ctx.lineWidth = 3;
    for(let i=1; i<4; i++) {
      ctx.beginPath(); ctx.moveTo(margin, y + i * (ecgHeight/4)); ctx.lineTo(margin + innerWidth, y + i * (ecgHeight/4)); ctx.stroke();
    }
    for(let i=1; i<10; i++) {
      ctx.beginPath(); ctx.moveTo(margin + i * (innerWidth/10), y); ctx.lineTo(margin + i * (innerWidth/10), y + ecgHeight); ctx.stroke();
    }
    
    // Label
    ctx.fillStyle = cDark;
    ctx.globalAlpha = 0.8;
    ctx.font = 'bold 28px "Courier Prime", monospace';
    ctx.fillText('ECG // AUDIO VALENCE', margin + 20, y + 30);
    ctx.globalAlpha = 1.0;

    // The Waveform Line
    ctx.strokeStyle = cBlue;
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(margin, y + ecgHeight/2);
    // Draw erratic zig zag
    const points = [
      [50, 0], [60, -40], [70, 60], [85, -60], [100, 0], [250, 0], 
      [260, -80], [275, 80], [290, -20], [310, 0], [450, 0], [460, -10], 
      [470, -50], [485, 90], [500, -80], [515, 20], [530, 0], [700, 0], 
      [710, -70], [730, 70], [745, -20], [760, 0], [920, 0]
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

    // 4. Diagnosis (Pink Block)
    y += ecgHeight + 80;
    // Pink block full width
    const diagHeight = 340;
    ctx.fillStyle = cPink;
    ctx.fillRect(0, y, CANVAS_WIDTH, diagHeight);
    // Borders & shadows
    ctx.fillStyle = cPurple;
    ctx.fillRect(0, y + diagHeight, CANVAS_WIDTH, 20); // bottom shadow
    ctx.lineWidth = 12;
    ctx.strokeStyle = cDark;
    ctx.beginPath();
    ctx.moveTo(0, y); ctx.lineTo(CANVAS_WIDTH, y);
    ctx.moveTo(0, y + diagHeight); ctx.lineTo(CANVAS_WIDTH, y + diagHeight);
    ctx.stroke();
    
    ctx.fillStyle = cWhite;
    ctx.font = 'bold 32px "Courier Prime", monospace';
    ctx.fillText('PRIMARY DIAGNOSIS:', margin, y + 60);
    
    ctx.fillStyle = cDark;
    ctx.font = '140px "Anton", sans-serif';
    const archetype = (roastData.archetype || 'WHIPLASH ENTHUSIAST').toUpperCase();
    const archetypeLines = wrapText(ctx, archetype, CANVAS_WIDTH - margin*2);
    archetypeLines.forEach((line, i) => {
      ctx.fillText(line, margin, y + 200 + i * 130);
    });

    // Stamp "CONFIRMED"
    ctx.save();
    ctx.translate(CANVAS_WIDTH - margin - 250, y + 160);
    ctx.rotate(-10 * Math.PI / 180);
    ctx.strokeStyle = cGreen;
    ctx.lineWidth = 16;
    ctx.beginPath();
    ctx.roundRect(-200, -80, 400, 160, 20);
    ctx.stroke();
    ctx.fillStyle = cGreen;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '120px "Anton", sans-serif';
    ctx.fillText('CONFIRMED', 0, 0);
    ctx.restore();

    // 5. Clinical Notes
    y += diagHeight + 80;
    ctx.fillStyle = cGreen;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = 'bold 32px "Courier Prime", monospace';
    ctx.fillText('CLINICAL NOTES:', margin, y);

    y += 60;
    // Notes block background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.2)'; // cDark/20
    const notesLines = wrapText(ctx, roastData.roast || 'Patient exhibits symptoms of bad taste.', innerWidth - 60);
    const notesHeight = notesLines.length * 55 + 60;
    ctx.beginPath();
    ctx.roundRect(margin, y, innerWidth, notesHeight, 20);
    ctx.fill();
    ctx.lineWidth = 12;
    ctx.strokeStyle = cGreen;
    ctx.beginPath();
    ctx.moveTo(margin + 6, y + 20);
    ctx.lineTo(margin + 6, y + notesHeight - 20);
    ctx.stroke();

    ctx.fillStyle = cWhite;
    ctx.font = 'bold 36px "Courier Prime", monospace';
    notesLines.forEach((line, i) => {
      ctx.fillText(line, margin + 40, y + 30 + i * 55);
    });

    // 6. Vital Signs Table
    y += notesHeight + 60;
    const tableHeight = 320;
    // Purple Block Full Width
    ctx.fillStyle = cPurple;
    ctx.fillRect(0, y, CANVAS_WIDTH, tableHeight);
    ctx.fillStyle = cGreen;
    ctx.fillRect(0, y + tableHeight, CANVAS_WIDTH, 16); // shadow
    ctx.strokeStyle = cDark;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(0, y); ctx.lineTo(CANVAS_WIDTH, y);
    ctx.moveTo(0, y + tableHeight); ctx.lineTo(CANVAS_WIDTH, y + tableHeight);
    ctx.stroke();

    ctx.fillStyle = cGreen;
    ctx.font = 'bold 32px "Courier Prime", monospace';
    ctx.fillText('VITAL SIGNS:', margin, y + 40);

    const tableY = y + 100;
    const tWidth = innerWidth * 0.75; // 75% width
    // Draw table background
    ctx.fillStyle = cWhite;
    ctx.fillRect(margin, tableY, tWidth, 180);
    ctx.strokeRect(margin, tableY, tWidth, 180);
    // Rows
    ctx.beginPath(); ctx.moveTo(margin, tableY + 60); ctx.lineTo(margin + tWidth, tableY + 60); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(margin, tableY + 120); ctx.lineTo(margin + tWidth, tableY + 120); ctx.stroke();
    // Cols
    ctx.beginPath(); ctx.moveTo(margin + tWidth*0.4, tableY); ctx.lineTo(margin + tWidth*0.4, tableY + 180); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(margin + tWidth*0.65, tableY); ctx.lineTo(margin + tWidth*0.65, tableY + 180); ctx.stroke();

    // Fill table data
    ctx.font = 'bold 24px "Courier Prime", monospace';
    const rows = [
      { label: 'ENERGY LEVEL', val: `${stats.avgEnergy}%`, qual: 'ELEVATED / MANIC', bg: cOrange, text: cWhite },
      { label: 'HAPPINESS (VALENCE)', val: `${stats.avgValence}%`, qual: 'CRITICALLY LOW', bg: cBlue, text: cWhite },
      { label: 'HEART RATE (TEMPO)', val: `${stats.avgTempo} BPM`, qual: 'STABLE', bg: cGreen, text: cDark },
    ];
    rows.forEach((r, i) => {
      const ry = tableY + i * 60;
      ctx.fillStyle = cDark;
      ctx.fillText(r.label, margin + 20, ry + 16);
      ctx.font = 'bold 32px "Courier Prime", monospace';
      ctx.fillText(r.val, margin + tWidth*0.4 + 20, ry + 12);
      ctx.font = 'bold 24px "Courier Prime", monospace';
      
      // Qualifier bg
      ctx.fillStyle = r.bg;
      ctx.fillRect(margin + tWidth*0.65, ry, tWidth*0.35, 60);
      ctx.fillStyle = r.text;
      ctx.font = 'italic bold 24px "Courier Prime", monospace';
      ctx.fillText(r.qual, margin + tWidth*0.65 + 20, ry + 16);
    });

    // 7. Attached Exhibits
    // Load top 2 covers
    const topTracksToUse = tracks.slice(0, 2);
    const loadedImages = (
      await Promise.all(
        topTracksToUse.map((t) => {
          const url = t.album?.images?.[1]?.url || t.album?.images?.[0]?.url;
          return loadCorsImage(url);
        })
      )
    ).filter(Boolean);

    if (loadedImages.length >= 1) {
      // Draw Exhibit Box
      const exhX = margin + tWidth + 40;
      const exhY = y - 80;
      ctx.save();
      ctx.translate(exhX + 100, exhY + 160);
      
      // Label
      ctx.rotate(4 * Math.PI / 180);
      ctx.fillStyle = cDark;
      ctx.fillRect(-100, -160, 240, 40);
      ctx.lineWidth = 4;
      ctx.strokeRect(-100, -160, 240, 40);
      ctx.fillStyle = cGreen;
      ctx.font = 'bold 24px "Courier Prime", monospace';
      ctx.fillText('ATTACHED EXHIBITS', -80, -152);
      ctx.rotate(-4 * Math.PI / 180);

      // Photo 1
      ctx.rotate(-6 * Math.PI / 180);
      ctx.fillStyle = cOrange;
      ctx.fillRect(-80, -90, 220, 250);
      ctx.lineWidth = 6;
      ctx.strokeRect(-80, -90, 220, 250);
      ctx.fillStyle = cDark; // shadow
      ctx.fillRect(-65, -75, 220, 250);
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(loadedImages[0], -65, -75, 190, 190);
      ctx.strokeRect(-65, -75, 190, 190);
      ctx.font = 'bold 20px "Courier Prime", monospace';
      ctx.fillText('EXH-A', -50, 130);
      // Tape
      ctx.fillStyle = cGreen;
      ctx.translate(30, -90);
      ctx.rotate(8 * Math.PI / 180);
      ctx.fillRect(-40, -15, 80, 30);
      ctx.strokeRect(-40, -15, 80, 30);
      ctx.rotate(-8 * Math.PI / 180);
      ctx.translate(-30, 90);
      ctx.rotate(6 * Math.PI / 180);

      // Photo 2
      if (loadedImages[1]) {
        ctx.translate(20, 140);
        ctx.rotate(3 * Math.PI / 180);
        ctx.fillStyle = cPink;
        ctx.fillRect(-80, -90, 220, 250);
        ctx.lineWidth = 6;
        ctx.strokeRect(-80, -90, 220, 250);
        ctx.fillStyle = cDark;
        ctx.fillRect(-65, -75, 220, 250);
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(loadedImages[1], -65, -75, 190, 190);
        ctx.strokeRect(-65, -75, 190, 190);
        ctx.font = 'bold 20px "Courier Prime", monospace';
        ctx.fillText('EXH-B', -50, 130);
        // Tape
        ctx.fillStyle = cGreen;
        ctx.translate(30, -90);
        ctx.rotate(-5 * Math.PI / 180);
        ctx.fillRect(-40, -15, 80, 30);
        ctx.strokeRect(-40, -15, 80, 30);
        ctx.restore();
      } else {
        ctx.restore();
      }
    }

    // 8. Footer
    const footerY = CANVAS_HEIGHT - 180;
    ctx.fillStyle = cGreen;
    ctx.fillRect(0, footerY - 16, CANVAS_WIDTH, 16);
    ctx.lineWidth = 8;
    ctx.strokeStyle = cDark;
    ctx.beginPath();
    ctx.moveTo(0, footerY); ctx.lineTo(CANVAS_WIDTH, footerY);
    ctx.stroke();

    ctx.fillStyle = cWhite;
    ctx.font = '100px "Courier Prime", monospace';
    ctx.fillText('|||| | || || | || |', margin, footerY + 60);
    ctx.fillStyle = cGreen;
    ctx.font = 'bold 28px "Courier Prime", monospace';
    ctx.letterSpacing = '6px';
    ctx.fillText('PT-ID: 8092-2244-SM', margin, footerY + 130);
    ctx.letterSpacing = '0px';

    ctx.textAlign = 'center';
    ctx.fillStyle = cWhite;
    ctx.font = 'bold 32px "Courier Prime", monospace';
    ctx.fillText('AUTHORIZING PHYSICIAN', CANVAS_WIDTH - margin - 200, footerY + 130);
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH - margin - 400, footerY + 90);
    ctx.lineTo(CANVAS_WIDTH - margin, footerY + 90);
    ctx.stroke();

    ctx.save();
    ctx.translate(CANVAS_WIDTH - margin - 220, footerY + 60);
    ctx.rotate(-6 * Math.PI / 180);
    ctx.fillStyle = cPink;
    ctx.font = '100px "Nothing You Could Do", cursive';
    // Mix blend equivalent for canvas signature
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
