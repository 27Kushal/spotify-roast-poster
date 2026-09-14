# Sonic Mirror 🪞🎶

> **An AI-powered psychoacoustic laboratory that diagnoses your Spotify listening habits, roasts your music taste, and outputs high-res Risograph diagnostic posters.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-spotify--roast--poster.vercel.app-0047FF?style=for-the-badge&logo=vercel)](https://spotify-roast-poster.vercel.app)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-3D%20Visuals-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-Neo--Brutalist-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Gemini](https://img.shields.io/badge/Google%20Gemini-AI%20Roasts-8E75B2?style=for-the-badge&logo=google)](https://ai.google.dev/)

---

## 🌐 Live Website

**Experience it live here:** 👉 **[https://spotify-roast-poster.vercel.app](https://spotify-roast-poster.vercel.app)**

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

### 4. 🖨️ Two-Column Diagnostic Poster Studio (1080×1920)
- **Interactive Layer Toggles**:
  - [x] Paper Texture Grain (Aged photocopy effect)
  - [x] "Certified Unhinged" Red Rubber Stamp
  - [x] 4-Stem Audio Spectrum Analyzer
  - [x] Case Barcode & Authorized Signature (`Dr. Sonic Mirror`)
- **Instagram-Story Ready**: Exports a high-resolution 1080×1920 PNG natively rendered via the HTML5 `<canvas>` API, complete with confetti celebrations.

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
MIT License. Built for fun & entertainment. Not medical or psychiatric advice.
