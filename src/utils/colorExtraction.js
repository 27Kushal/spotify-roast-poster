// Color extraction utility to derive dominant palettes from album covers

/**
 * Converts RGB to hex string
 */
export function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map((x) => Math.round(x).toString(16).padStart(2, '0')).join('');
}

/**
 * Calculates RGB luminance
 */
function getLuminance(r, g, b) {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

/**
 * Calculates color saturation
 */
function getSaturation(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max === 0) return 0;
  return (max - min) / max;
}

/**
 * Extracts dominant and accent colors from an array of loaded HTMLImageElements
 */
export function extractPaletteFromImages(imageElements = []) {
  const defaultPalette = {
    backgroundDark: '#0d0c11',
    accentPrimary: '#1DB954',
    accentSecondary: '#3b82f6',
    glowColor: 'rgba(29, 185, 84, 0.25)',
    swatches: ['#1DB954', '#3b82f6', '#ec4899', '#f59e0b'],
  };

  if (!imageElements || imageElements.length === 0) {
    return defaultPalette;
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return defaultPalette;

  canvas.width = 20;
  canvas.height = 20;

  const colorBuckets = [];

  for (const img of imageElements) {
    try {
      ctx.clearRect(0, 0, 20, 20);
      ctx.drawImage(img, 0, 0, 20, 20);
      const imgData = ctx.getImageData(0, 0, 20, 20).data;

      for (let i = 0; i < imgData.length; i += 16) {
        const r = imgData[i];
        const g = imgData[i + 1];
        const b = imgData[i + 2];
        const a = imgData[i + 3];

        if (a > 128) {
          const lum = getLuminance(r, g, b);
          const sat = getSaturation(r, g, b);
          // Avoid pure blacks and pure whites for accents
          if (lum > 25 && lum < 230 && sat > 0.2) {
            colorBuckets.push({ r, g, b, lum, sat });
          }
        }
      }
    } catch {
      // If canvas is tainted or image failed, continue
    }
  }

  if (colorBuckets.length === 0) {
    return defaultPalette;
  }

  // Sort by highest saturation
  colorBuckets.sort((a, b) => b.sat - a.sat);

  const primary = colorBuckets[0];
  // Pick secondary with distinct color distance from primary
  const secondary =
    colorBuckets.find((c) => {
      const diff = Math.abs(c.r - primary.r) + Math.abs(c.g - primary.g) + Math.abs(c.b - primary.b);
      return diff > 80;
    }) || colorBuckets[Math.min(5, colorBuckets.length - 1)];

  const tertiary =
    colorBuckets.find((c) => {
      const diff1 = Math.abs(c.r - primary.r) + Math.abs(c.g - primary.g) + Math.abs(c.b - primary.b);
      const diff2 = Math.abs(c.r - secondary.r) + Math.abs(c.g - secondary.g) + Math.abs(c.b - secondary.b);
      return diff1 > 60 && diff2 > 60;
    }) || colorBuckets[Math.floor(colorBuckets.length / 2)];

  const primaryHex = rgbToHex(primary.r, primary.g, primary.b);
  const secondaryHex = rgbToHex(secondary.r, secondary.g, secondary.b);
  const tertiaryHex = rgbToHex(tertiary.r, tertiary.g, tertiary.b);

  // Dark background derived from primary tone with 90% darkening
  const bgR = Math.max(8, Math.round(primary.r * 0.08));
  const bgG = Math.max(8, Math.round(primary.g * 0.08));
  const bgB = Math.max(12, Math.round(primary.b * 0.10));
  const backgroundDark = rgbToHex(bgR, bgG, bgB);

  return {
    backgroundDark,
    accentPrimary: primaryHex,
    accentSecondary: secondaryHex,
    accentTertiary: tertiaryHex,
    glowColor: `rgba(${primary.r}, ${primary.g}, ${primary.b}, 0.25)`,
    swatches: [primaryHex, secondaryHex, tertiaryHex, '#1DB954'],
  };
}
