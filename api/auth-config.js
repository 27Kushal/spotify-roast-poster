export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID || '';
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:5173/callback';

  return res.status(200).json({
    clientId,
    redirectUri,
    isConfigured: Boolean(clientId && process.env.SPOTIFY_CLIENT_SECRET),
  });
}
