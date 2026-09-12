export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  body = body || {};

  const { stats, topTracks, topArtists, tone = 'brutal' } = body;

  if (!stats || !topTracks) {
    return res.status(400).json({ error: 'Missing stats or topTracks in request body.' });
  }

  // Format top tracks & artists into concise bullet points
  const formattedTracks = (topTracks || [])
    .slice(0, 8)
    .map((t) => (typeof t === 'string' ? t : `${t.name} by ${(t.artists || []).map((a) => a.name).join(', ')}`))
    .join('\n- ');

  const formattedArtists = (topArtists || [])
    .slice(0, 6)
    .map((a) => (typeof a === 'string' ? a : a.name))
    .join(', ');

  const tonePrompts = {
    brutal: 'sharp, sarcastic, and delightfully ruthless roast',
    therapist: 'concerned armchair psychologist diagnosing their emotional coping mechanisms through music',
    indie_snob: 'pretentious, gatekeeping vinyl-obsessed record store snob judging their taste',
    existential: 'deeply philosophical yet funny breakdown of their existential dread and dopamine chasing',
  };

  const selectedTone = tonePrompts[tone] || tonePrompts.brutal;

  // Fallback mock generator if GEMINI_API_KEY is not configured yet
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return res.status(200).json({
      archetype: `${stats.dominantGenre || 'Overthinking'} Aux Menace`,
      roast: `With an average energy of ${stats.avgEnergy || 60}% and a valence score hovering at a fragile ${stats.avgValence || 45}%, your Spotify history reads like a desperate cry for dopamine wrapped in ${stats.dominantGenre || 'indie'} aesthetic.\n\nBlasting ${topTracks[0]?.name || 'these tracks'} on repeat won't solve whatever crisis prompted this playlist, but at least your emotional turbulence has a steady BPM of ${stats.avgTempo || 120}.\n\nYour top rotation of ${formattedArtists || 'questionable artists'} screams: 'I want people to think I have enigmatic depth, but I actually just need eight hours of sleep and a hug.'`,
      burnQuote: `"${stats.avgValence || 45}% happiness, 100% emotional avoidance."`,
      vibeTags: [stats.dominantGenre || 'Indie', `${stats.avgEnergy}% Energy`, `${stats.avgTempo} BPM`],
      isMock: true,
      message: 'Generated via fallback template. Add your GEMINI_API_KEY to .env to unlock live Gemini Flash AI roasts!',
    });
  }

  const systemInstruction = `You are "Sonic Mirror" — a critically acclaimed, hilariously unfiltered music roast master and cultural critic.
Your goal is to provide a punchy, comedic, painfully accurate 3-5 line roast and personality diagnosis of the listener based on their actual Spotify stats and top songs.

CRITICAL RULES:
1. Ground the roast in the listener's REAL NUMBERS:
   - Dominant Genre: ${stats.dominantGenre}
   - Energy Level: ${stats.avgEnergy}%
   - Mood / Valence (Happiness): ${stats.avgValence}%
   - Danceability: ${stats.avgDanceability}%
   - Average Tempo: ${stats.avgTempo} BPM
   - Mainstream Rating: ${stats.avgPopularity}/100
2. Explicitly name 1 to 2 specific songs or artists from their rotation to make the roast uncomfortably personal.
3. Keep the roast between 3 to 5 punchy sentences/lines. Zero generic filler like "you like music".
4. Adopt a ${selectedTone} tone.
5. Return strictly valid JSON adhering to this exact schema:
{
  "archetype": "A witty 2-4 word personality title (e.g. 'Caffeinated Existentialist', 'Main Character Syndrome Patient Zero')",
  "roast": "The 3-5 sentence comedic roast referencing their real metrics and track names.",
  "burnQuote": "A one-liner punchline in quotes summarizing their taste (e.g. '42% happy, 100% dissociated').",
  "vibeTags": ["3 concise 1-2 word descriptors"]
}`;

  const userPrompt = `Analyze and roast this listener's music taste:
- Dominant Genre: ${stats.dominantGenre}
- Energy: ${stats.avgEnergy}%
- Happiness/Valence: ${stats.avgValence}%
- Danceability: ${stats.avgDanceability}%
- Average Tempo: ${stats.avgTempo} BPM
- Popularity: ${stats.avgPopularity}/100
- Explicit Tracks: ${stats.explicitPercentage || 0}%
- Top Artists: ${formattedArtists}
- Top Tracks on Heavy Rotation:
- ${formattedTracks}`;

  try {
    // Call Gemini 1.5 Flash API (compatible with Google AI Studio free tier)
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemInstruction}\n\n${userPrompt}` }],
          },
        ],
        generationConfig: {
          temperature: 0.9,
          topP: 0.95,
          maxOutputTokens: 600,
          responseMimeType: 'application/json',
        },
      }),
    });

    const data = await geminiResponse.json();

    if (!geminiResponse.ok) {
      console.error('Gemini API Error details:', data);
      return res.status(geminiResponse.status).json({
        error: data.error?.message || 'Gemini API call failed',
        details: data,
      });
    }

    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error('No text generated by Gemini.');
    }

    let parsedRoast;
    try {
      parsedRoast = JSON.parse(candidateText);
    } catch {
      // Clean possible markdown code fences if present
      const cleaned = candidateText.replace(/```json\n?|\n?```/g, '').trim();
      parsedRoast = JSON.parse(cleaned);
    }

    return res.status(200).json({
      ...parsedRoast,
      isMock: false,
    });
  } catch (err) {
    console.error('Error generating roast:', err);
    return res.status(500).json({
      error: 'Failed to generate roast from Gemini',
      message: err.message,
    });
  }
}
