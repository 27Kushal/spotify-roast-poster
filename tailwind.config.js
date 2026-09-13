/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#0D0D0E",
        "studio-glow": "#FF3366",
        "amber-tube": "#FFB800",
        "cyan-noise": "#00E5FF",
        "sleeve-white": "#EFEFEF",
        "static-grey": "#4A4A52",
        // Stitch Neo-Brutalist Y2K Zine Colors
        zine: {
          cream: "#F4F4F0",
          lime: "#D4FF00",
          pink: "#FF007A",
          cyan: "#00F0FF",
          purple: "#9D4EDD",
          orange: "#FF6B00",
          blue: "#2563EB",
          yellow: "#FFD600",
          black: "#111111",
          card: "#FFFFFF",
          muted: "#71717A",
          darkgreen: "#0B3818",
        },
        // Exact Wrapped-Style Poster Color System
        poster: {
          blue: "#0047FF",
          pink: "#FF007F",
          green: "#CCFF00",
          purple: "#5A189A",
          orange: "#FF6D00",
          dark: "#0F172A",
          white: "#FFFFFF",
        },
        spotify: {
          green: "#1DB954",
        },
      },
      boxShadow: {
        brutal: "4px 4px 0px #111111",
        "brutal-sm": "2px 2px 0px #111111",
        "brutal-lg": "8px 8px 0px #111111",
        "brutal-lime": "4px 4px 0px #D4FF00",
        "brutal-pink": "4px 4px 0px #FF007A",
        "brutal-cyan": "4px 4px 0px #00F0FF",
        "brutal-purple": "4px 4px 0px #9D4EDD",
        "brutal-orange": "4px 4px 0px #FF6B00",
        "brutal-yellow": "4px 4px 0px #FFD600",
      },
      fontFamily: {
        headline: ['"Archivo Black"', '"Space Grotesk"', 'sans-serif'],
        display: ['"Archivo Black"', '"League Gothic"', 'sans-serif'],
        body: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"Space Mono"', '"Courier Prime"', 'monospace'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(1deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        tuningIn: {
          '0%': { opacity: '0', transform: 'scale(1.02) translateX(10px)', filter: 'drop-shadow(10px 0 0 rgba(255,51,102,0.8)) drop-shadow(-10px 0 0 rgba(0,229,255,0.8)) blur(2px)' },
          '20%': { opacity: '0.5', transform: 'scale(1) translateX(-5px)', filter: 'drop-shadow(-5px 0 0 rgba(255,51,102,0.6)) drop-shadow(5px 0 0 rgba(0,229,255,0.6)) blur(1px)' },
          '40%': { opacity: '1', transform: 'scale(1) translateX(2px)', filter: 'drop-shadow(2px 0 0 rgba(255,51,102,0.4)) drop-shadow(-2px 0 0 rgba(0,229,255,0.4)) blur(0.5px)' },
          '60%': { opacity: '0.8', transform: 'scale(1) translateX(-1px)', filter: 'drop-shadow(0px 0 0 rgba(255,51,102,0)) drop-shadow(0px 0 0 rgba(0,229,255,0)) blur(0px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateX(0)', filter: 'none' },
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        pulseGlow: 'pulseGlow 4s ease-in-out infinite',
        marquee: 'marquee 28s linear infinite',
        'tuning-in': 'tuningIn 0.25s ease-out forwards',
      },
    },
  },
  plugins: [],
}

