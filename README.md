# Sonic Mirror 🪞🎶

**An AI-powered "unlicensed therapist" that diagnoses your Spotify listening habits.**

Sonic Mirror connects to your Spotify account, analyzes the audio features (energy, valence, tempo) of your top tracks, and uses Google's Gemini AI to deliver a contextual, comedic roast of your music taste. It then generates a highly shareable, Spotify-Wrapped-style **Medical Diagnostic Chart** poster using the HTML5 Canvas API.

## ✨ Features

- **Spotify Integration:** Securely authenticates via Spotify OAuth to fetch your top 50 tracks and their granular audio features.
- **AI Roasts (Gemini):** Feeds your listening data into the Gemini API to generate a personalized "Archetype" (e.g., *Lukewarm Whiplash Enthusiast*) and a comedic clinical note about your vibe.
- **Tone Switcher:** Let's you choose how aggressive you want the AI to be (Mild, Medium, Roast Me).
- **Physical Media UI:** A bespoke, editorial interface featuring a "Tuning-In" analog chromatic aberration animation, massive `League Gothic` typography, and a fluid aurora noise background.
- **Diagnostic Chart Export:** Dynamically draws a 1080x1920 Instagram-ready poster natively on an HTML5 `<canvas>`. Features include:
  - Spotify-Wrapped style bold color blocking.
  - Dynamic font scaling to ensure text never overlaps.
  - A generative DAW Spectrum Analyzer based on your actual energy/valence stats.
  - Scattered album art exhibits with tape graphics.

## 🛠 Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Lucide React
- **Typography:** `League Gothic`, `Space Grotesk`, `Anton`, `Courier Prime`
- **APIs:** Spotify Web API, Google Gemini API
- **Rendering:** Native HTML5 Canvas API (for poster export)

## 🚀 Local Development

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file in the root directory and add your API keys:
   ```env
   VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
   VITE_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```
   *(Note: The Spotify Redirect URI must be set to `http://127.0.0.1:5173/callback` in your Spotify Developer Dashboard).*

3. **Start the dev server:**
   ```bash
   npm run dev
   ```
   Open `http://127.0.0.1:5173/` in your browser.

## 🎨 Design Philosophy
Sonic Mirror deliberately avoids the standard "glassmorphism dashboard" look. Instead, it leans into a late-night studio aesthetic with sharp 1px grid lines and a strict color hierarchy:
- **Void & Static Grey** for structure.
- **Studio Glow (Pink)** for interactive elements.
- **Amber Tube** for warnings.
- **Cyan Noise** for ambient background mesh.
