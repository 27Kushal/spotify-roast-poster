import { computeAggregateStats } from './spotify';

export const DEMO_USER = {
  id: 'demo-listener-01',
  display_name: 'NEO-NOIR PROTOCOL',
  images: [
    {
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    },
  ],
};

export const DEMO_TRACKS = [
  {
    id: 'demo-t1',
    name: 'Midnight City',
    popularity: 88,
    duration_ms: 243000,
    artists: [{ id: 'demo-a1', name: 'M83' }],
    album: {
      name: "Hurry Up, We're Dreaming",
      images: [
        { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80' },
      ],
    },
  },
  {
    id: 'demo-t2',
    name: 'After Hours',
    popularity: 92,
    duration_ms: 361000,
    artists: [{ id: 'demo-a2', name: 'The Weeknd' }],
    album: {
      name: 'After Hours',
      images: [
        { url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80' },
      ],
    },
  },
  {
    id: 'demo-t3',
    name: 'Genesis',
    popularity: 76,
    duration_ms: 255000,
    artists: [{ id: 'demo-a3', name: 'Grimes' }],
    album: {
      name: 'Visions',
      images: [
        { url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&auto=format&fit=crop&q=80' },
      ],
    },
  },
  {
    id: 'demo-t4',
    name: 'Resonance',
    popularity: 82,
    duration_ms: 212000,
    artists: [{ id: 'demo-a4', name: 'HOME' }],
    album: {
      name: 'Odyssey',
      images: [
        { url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80' },
      ],
    },
  },
  {
    id: 'demo-t5',
    name: 'Space Song',
    popularity: 89,
    duration_ms: 320000,
    artists: [{ id: 'demo-a5', name: 'Beach House' }],
    album: {
      name: 'Depression Cherry',
      images: [
        { url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80' },
      ],
    },
  },
];

export const DEMO_ARTISTS = [
  {
    id: 'demo-a1',
    name: 'M83',
    genres: ['synthpop', 'shoegaze', 'indie rock'],
    popularity: 82,
    images: [{ url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80' }],
  },
  {
    id: 'demo-a2',
    name: 'The Weeknd',
    genres: ['canadian contemporary r&b', 'pop', 'synthpop'],
    popularity: 98,
    images: [{ url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80' }],
  },
  {
    id: 'demo-a3',
    name: 'Grimes',
    genres: ['art pop', 'electropop', 'indietronica'],
    popularity: 75,
    images: [{ url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&auto=format&fit=crop&q=80' }],
  },
  {
    id: 'demo-a4',
    name: 'HOME',
    genres: ['chillwave', 'synthwave', 'vaporwave'],
    popularity: 78,
    images: [{ url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80' }],
  },
  {
    id: 'demo-a5',
    name: 'Beach House',
    genres: ['dream pop', 'indie rock', 'shoegaze'],
    popularity: 84,
    images: [{ url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80' }],
  },
];

export const DEMO_ROAST = {
  archetype: 'DISSOCIATIVE NIGHT-DRIVE ENTHUSIAST',
  burnQuote: "You treat 2 AM highway reflections like a cinematic epiphany, but you're really just avoiding answering your unread messages.",
  tone: 'brutal',
  vibeSummary: 'Heavy doses of reverb and synth arpeggios mask a crippling fear of silence. Your heart rate is calibrated entirely in 105 BPM nostalgia.',
  clinicalNotes: [
    'Patient demonstrates severe attachment to 80s analog synthesizers despite being born in 2003.',
    'Dopamine receptors only trigger when accompanied by minor-key arpeggios.',
    'Observed staring at rain on glass windows for 45 consecutive minutes.',
  ],
  trackAnalysis: [
    {
      title: 'Midnight City',
      diagnosis: 'Thinks standing on a pedestrian overpass makes them the protagonist of an unreleased A24 film.',
    },
    {
      title: 'After Hours',
      diagnosis: 'Has made three separate playlists with the exact same emotional trajectory.',
    },
    {
      title: 'Space Song',
      diagnosis: 'Used exclusively to manufacture nostalgia for memories that never actually occurred.',
    },
  ],
};

export function getDemoSession() {
  const audioData = {
    features: [
      { id: 'demo-t1', energy: 0.78, valence: 0.42, danceability: 0.52, tempo: 105, acousticness: 0.05, instrumentalness: 0.12 },
      { id: 'demo-t2', energy: 0.65, valence: 0.31, danceability: 0.58, tempo: 110, acousticness: 0.08, instrumentalness: 0.02 },
      { id: 'demo-t3', energy: 0.72, valence: 0.45, danceability: 0.64, tempo: 120, acousticness: 0.15, instrumentalness: 0.35 },
      { id: 'demo-t4', energy: 0.55, valence: 0.38, danceability: 0.68, tempo: 100, acousticness: 0.02, instrumentalness: 0.85 },
      { id: 'demo-t5', energy: 0.45, valence: 0.28, danceability: 0.38, tempo: 147, acousticness: 0.22, instrumentalness: 0.40 },
    ],
    isFallback: false,
  };

  const stats = computeAggregateStats(DEMO_TRACKS, DEMO_ARTISTS, audioData);

  return {
    user: DEMO_USER,
    tracks: DEMO_TRACKS,
    artists: DEMO_ARTISTS,
    stats,
    roastData: DEMO_ROAST,
  };
}
