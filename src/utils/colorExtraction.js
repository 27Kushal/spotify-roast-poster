import { getPaletteSync } from 'colorthief';

/**
 * Converts RGB array or values to hex string
 */
export function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map((x) => Math.round(Math.min(255, Math.max(0, x))).toString(16).padStart(2, '0')).join('');
}

/**
 * Calculates saturation (0 to 1)
 */
function getSaturation(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max === 0) return 0;
  return (max - min) / max;
}

/**
 * Calculates relative luminance
 */
function getLuminance(r, g, b) {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

/**
 * Extracts 2-3 vibrant, saturated dominant colors from album cover images
 */
export function extractVibrantPalette(images = []) {
  const fallbackPalette = {
    color1: '#ff3366', // Vibrant energetic pink
    color2: '#7928ca', // Deep purple
    color3: '#00dfd8', // Electric cyan
    darkBase: '#08060c',
    blobs: [
      { color: 'rgba(255, 51, 102, 0.65)', x: 180, y: 350, r: 520 },
      { color: 'rgba(121, 40, 202, 0.60)', x: 920, y: 750, r: 600 },
      { color: 'rgba(0, 223, 216, 0.50)', x: 300, y: 1450, r: 550 },
      { color: 'rgba(255, 90, 0, 0.45)', x: 800, y: 1650, r: 480 },
    ],
  };

  if (!images || images.length === 0) return fallbackPalette;

  const collectedColors = [];

  for (const img of images) {
    try {
      if (img.complete && img.naturalWidth > 0) {
        const palette = getPaletteSync(img, 5);
        if (palette && palette.length > 0) {
          palette.forEach(([r, g, b]) => {
            const sat = getSaturation(r, g, b);
            const lum = getLuminance(r, g, b);
            // Prioritize vibrant colors with good saturation and visible luminance
            if (sat > 0.25 && lum > 0.18 && lum < 0.85) {
              collectedColors.push({ r, g, b, sat, lum });
            }
          });
        }
      }
    } catch (e) {
      // Fallback to manual canvas sampling if colorthief throws
    }
  }

  // Fallback to canvas sampling if ColorThief couldn't inspect
  if (collectedColors.length < 2) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 16;
    canvas.height = 16;

    for (const img of images) {
      try {
        ctx.drawImage(img, 0, 0, 16, 16);
        const data = ctx.getImageData(0, 0, 16, 16).data;
        for (let i = 0; i < data.length; i += 16) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const sat = getSaturation(r, g, b);
          const lum = getLuminance(r, g, b);
          if (sat > 0.2 && lum > 0.15 && lum < 0.85) {
            collectedColors.push({ r, g, b, sat, lum });
          }
        }
      } catch (e) {}
    }
  }

  if (collectedColors.length === 0) {
    return fallbackPalette;
  }

  // Sort by saturation descending
  collectedColors.sort((a, b) => b.sat - a.sat);

  const c1 = collectedColors[0];

  // Pick c2 with highest color distance from c1
  let c2 = collectedColors.find((c) => {
    const dist = Math.hypot(c.r - c1.r, c.g - c1.g, c.b - c1.b);
    return dist > 90;
  }) || collectedColors[1] || c1;

  // Pick c3 with highest distance from both c1 and c2
  let c3 = collectedColors.find((c) => {
    const d1 = Math.hypot(c.r - c1.r, c.g - c1.g, c.b - c1.b);
    const d2 = Math.hypot(c.r - c2.r, c.g - c2.g, c.b - c2.b);
    return d1 > 70 && d2 > 70;
  }) || collectedColors[2] || { r: 0, g: 223, b: 216 };

  const hex1 = rgbToHex(c1.r, c1.g, c1.b);
  const hex2 = rgbToHex(c2.r, c2.g, c2.b);
  const hex3 = rgbToHex(c3.r, c3.g, c3.b);

  // Very dark tinted base background
  const darkR = Math.max(6, Math.round(c1.r * 0.05));
  const darkG = Math.max(6, Math.round(c1.g * 0.05));
  const darkB = Math.max(10, Math.round(c1.b * 0.08));
  const darkBase = rgbToHex(darkR, darkG, darkB);

  // Asymmetrical organic blurred blobs for Spotify Wrapped mesh effect
  const blobs = [
    { color: `rgba(${c1.r}, ${c1.g}, ${c1.b}, 0.65)`, x: 160, y: 380, r: 560 },
    { color: `rgba(${c2.r}, ${c2.g}, ${c2.b}, 0.58)`, x: 920, y: 780, r: 620 },
    { color: `rgba(${c3.r}, ${c3.g}, ${c3.b}, 0.52)`, x: 260, y: 1420, r: 580 },
    { color: `rgba(${c1.r}, ${c1.g}, ${c1.b}, 0.45)`, x: 880, y: 1680, r: 520 },
  ];

  return {
    color1: hex1,
    color2: hex2,
    color3: hex3,
    rgb1: c1,
    rgb2: c2,
    rgb3: c3,
    darkBase,
    blobs,
  };
}
