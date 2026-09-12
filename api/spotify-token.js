export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const defaultRedirectUri = process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:5173/callback';

  if (!clientId || !clientSecret) {
    return res.status(500).json({
      error: 'Missing Spotify API credentials. Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env.',
    });
  }

  try {
    // In Vercel or local middleware, body may be parsed or string
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }
    body = body || {};

    const { code, redirect_uri, refresh_token } = body;
    const redirectUri = redirect_uri || defaultRedirectUri;

    const params = new URLSearchParams();

    if (refresh_token) {
      params.append('grant_type', 'refresh_token');
      params.append('refresh_token', refresh_token);
    } else if (code) {
      params.append('grant_type', 'authorization_code');
      params.append('code', code);
      params.append('redirect_uri', redirectUri);
    } else {
      return res.status(400).json({
        error: 'Missing required parameter: either "code" or "refresh_token" is required.',
      });
    }

    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${basicAuth}`,
      },
      body: params.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error_description || data.error || 'Failed to exchange Spotify token',
        details: data,
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Spotify token exchange error:', err);
    return res.status(500).json({
      error: 'Internal server error during Spotify token exchange',
      details: err.message,
    });
  }
}
