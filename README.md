# Sonic Mirror 🪞🎶

> **An AI-powered psychoacoustic laboratory that diagnoses your Spotify listening habits, roasts your music taste, and outputs high-res 1080×1920 diagnostic posters.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-spotify--roast--poster.vercel.app-0047FF?style=for-the-badge&logo=vercel)](https://spotify-roast-poster.vercel.app)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-3D%20Visuals-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-Neo--Brutalist-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Gemini](https://img.shields.io/badge/Google%20Gemini-AI%20Roasts-8E75B2?style=for-the-badge&logo=google)](https://ai.google.dev/)

---

## 🌐 Live Website

**Experience it live:** 👉 **[https://spotify-roast-poster.vercel.app](https://spotify-roast-poster.vercel.app)**

*(Includes a zero-login **Demo Mode** for instant preview without Spotify authentication!)*

---

## ✨ Features & Architecture

### 1. 🎨 Neo-Brutalist Y2K Zine Visual Identity
- **High-Voltage Wrapped Palette**: Full-bleed section-based color blocking inspired by Spotify Wrapped and experimental Japanese zines:
  - **Electric Cobalt Blue (`#0047FF`)**: Hero & dashboard base canvas.
  - **Neon Acid Lime (`#CCFF00`)**: Primary actions, marquee banners, and telemetry tags.
  - **Hot Magenta Pink (`#FF007F`)**: Diagnosis stamps, marquee ribbons, and brutalist highlights.
  - **Deep Royal Purple (`#5A189A`)**: Telemetry vitals container and methodology section.
  - **Solar Tangerine Orange (`#FF6D00`)**: Burn quote callout boxes and metric preview cards.
  - **Midnight Dark (`#0F172A`)**: High-contrast navigation and CRT terminal console.
- **Neo-Brutalist Framing**: Heavy 3–4px solid black borders, hard drop shadows (`shadow-[6px_6px_0px_#000]`), and tactile Y2K sticker accents (`★ 100% UNFILTERED ★`, `NO SKIP DETECTED`, `CERTIFIED UNHINGED`).
- **Typography Stack**: `Archivo Black`, `Space Grotesk`, `Space Mono`, `Courier Prime`, and handwriting signatures.

### 2. 🧊 Interactive Three.js 3D Visualizer
- **Hero 3D Specimen (`ThreeVisualizer.jsx`)**:
  - A floating, interactive 3D retro holographic audio cassette featuring dual multi-colored spinning tape spools (Cyber Cyan & Solar Orange).
  - Triple intersecting gyroscopic orbiting rings rotating across 3 distinct 3D axes.
  - Interactive mouse tracking and perspective tilt that smoothly tracks cursor movement.
  - 180-particle acoustic starfield drifting in the background.
- **Resonator 3D Wave Terrain**:
  - Placed inside `SCOPE 01: REAL-TIME 3D AUDIO RESONATOR` on the analysis dashboard.
  - Undulating wireframe wave plane with vertex color gradients, paired with dual oscillating ribbons (Hot Pink & Sunny Yellow).
  - Reacts in real-time to your actual Spotify metrics: wave amplitude scales with `energy`, pulse speed with `tempo`, and frequency mix with `valence`.

### 3. 🧠 4 Selectable AI Psycho-Tones (Google Gemini)
Choose the clinical psychologist persona assigned to dissect your musical sins:
- **Clinical Brutal** (Hot Magenta) — Detached, scathing diagnostic autopsy.
- **3AM Bestie** (Cyber Cyan) — Traumatized, overly concerned friend witnessing your late-night spiraling.
- **Unlicensed Therapist** (Solar Orange) — Pseudo-spiritual psychological analysis.
- **Pitchfork Elitist** (Electric Purple) — Pretentious indie snob dissecting your mainstream hypocrisies.

*Backed by a 5-tier zero-downtime model cascade (`gemini-2.5-flash` → `gemini-2.0-flash` → `gemini-1.5-flash` → `gemini-1.5-pro` → offline heuristic generator).*

### 4. 🖨️ Dual-Theme Poster Studio (1080×1920 9:16 Story Export)
Toggle between two completely distinct procedural poster themes with one click:
- **⚡ Theme 1: Spotify Roast [Current Year] (Geometric Neon)**:
  - Directly inspired by the official Spotify Wrapped 2024 design system.
  - Procedural 3D layered chevrons and accordion ribbons (`#FF007F`, `#FF5722`, `#7928CA`) with wireframe depth hatch lines.
  - Dynamic current year display (170px bold sans-serif) + `Spotify Roast` wordmark.
  - Formatted numbered Top 5 Tracks list with album art thumbnails and artist tags.
  - 4 Vibe Metrics badges (Energy, Valence, Tempo, Dominant Genre).
  - Vertical right-edge rotated branding badge (`SONIC MIRROR // SPOTIFY ROAST [YEAR]`).
  - 3 Selectable Colorways: **Obsidian Black**, **Cadmium Red**, and **Canary Yellow**.
- **📋 Theme 2: Zine Lab (Risograph Clinical Specimen)**:
  - Clinical observation report printed on cream paper with simulated photocopy noise grain.
  - 4-stem DAW audio spectrum analyzer.
  - Rotated `CERTIFIED UNHINGED` red rubber stamp.
  - Barcode and authorized physician signature (`Dr. Sonic Mirror`).
  - Interactive layer toggles for paper grain, stamps, analyzers, and barcodes.
- **High-Res Export**: Direct HTML5 `<canvas>` rendering to 1080×1920 PNG with celebration confetti.

### 5. 🎭 Zero-Login Demo Mode
- Allows anyone (including visitors not on your Spotify whitelist) to explore the entire application with one click.
- Pre-loaded with an authentic neo-noir indie music profile (M83, The Weeknd, Grimes, Beach House, HOME).
- Powers the full 3D visualizer, audio telemetry gauges, Gemini AI diagnosis, and both poster themes.

### 6. 🛡️ Resilient Telemetry & Auto-Refresh Architecture
- **Automatic Token Refresh**: Automatically renews expiring Spotify access tokens (1-hour lifespan) via `/api/spotify-token` without interrupting active sessions.
- **Artist Fallback Engine**: If Spotify's `/me/top/artists` endpoint fails or returns empty, the app automatically extracts unique artists from `/me/top/tracks`, preventing crashes.
- **Cross-Device Storage Synchronization**: Synchronizes tokens across both `localStorage` and `sessionStorage`, ensuring sessions persist across mobile Safari/Chrome tab suspensions and OAuth redirects.

---

## 🔐 Spotify Developer Mode & Adding Test Users

> [!IMPORTANT]
> **Why do other devices see a 403 error?**
> Spotify has restricted **Extended Quota / Production Mode** exclusively to registered corporate entities with 250,000+ MAU and removed the public quota extension button for personal/hobby apps.
> 
> As a result, all personal projects run in **Development Mode**, where Spotify limits access to authorized accounts.

### How to allow friends or other devices to log in:
1. Go to the **[Spotify Developer Dashboard](https://developer.spotify.com/dashboard)**.
2. Click your app card.
3. Click **Settings** (top right) → **User Management** tab.
4. Click **Add User**:
   - Enter their name.
   - Enter the **Spotify account email address** used on that device.
5. Click **Save**.
6. The user can now tap **LOGOUT & RECONNECT** on the website and authenticate immediately!

*(For visitors whose email hasn't been added, they can simply tap **`🎭 PREVIEW WITH DEMO DATA`** to try the full experience).*

---

## 🛠 Tech Stack

- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS (Custom Neo-Brutalist design tokens and hard box shadows)
- **3D Graphics**: Three.js
- **AI Engine**: Google Gemini API (`@google/genai` / REST)
- **Audio Intelligence**: Spotify Web API (OAuth 2.0 PKCE + Audio Features Heuristics)
- **Export Engine**: HTML5 Canvas API + `canvas-confetti`
- **Hosting & Backend**: Vercel Serverless Functions (`/api`)

---

## 🚀 Getting Started Locally

### 1. Clone & Install
```bash
git clone https://github.com/27Kushal/spotify-roast-poster.git
cd spotify-roast-poster
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
GEMINI_API_KEY=your_gemini_api_key
SPOTIFY_REDIRECT_URI=http://127.0.0.1:5173/callback
```

> **Note for Local Spotify Setup**:
> In your [Spotify Developer Dashboard](https://developer.spotify.com/dashboard), open your app settings and add `http://127.0.0.1:5173/callback` under **Redirect URIs**.

### 3. Run the Development Server
```bash
npm run dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** (or `http://127.0.0.1:5173/`) in your browser.

---

## ☁️ Free Vercel Deployment Guide

This project is pre-configured with [`vercel.json`](./vercel.json) to automatically deploy frontend routes and serverless functions in `/api`:

1. Import your GitHub repository into **[Vercel](https://vercel.com/)**.
2. Under **Environment Variables**, add:
   - `SPOTIFY_CLIENT_ID`: Your Spotify App Client ID
   - `SPOTIFY_CLIENT_SECRET`: Your Spotify App Client Secret
   - `GEMINI_API_KEY`: Your Google AI Studio API key
   - `SPOTIFY_REDIRECT_URI`: `https://spotify-roast-poster.vercel.app/callback`
3. Click **Deploy**.
4. In your **[Spotify Developer Dashboard](https://developer.spotify.com/dashboard)** under **Redirect URIs**, add your production callback:
   ```text
   https://spotify-roast-poster.vercel.app/callback
   ```

---

## 📄 License

MIT License — free for educational, personal, and experimental use.
