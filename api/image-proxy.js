export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', ['GET', 'HEAD']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { url } = req.query || {};

  if (!url) {
    return res.status(400).json({ error: 'Missing "url" query parameter.' });
  }

  try {
    const parsedUrl = new URL(url);
    // Security check: Only proxy Spotify CDN images
    if (!parsedUrl.hostname.endsWith('scdn.co') && !parsedUrl.hostname.endsWith('spotifycdn.com')) {
      return res.status(403).json({ error: 'Proxy only allowed for Spotify CDN images.' });
    }

    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch image from CDN' });
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = await response.arrayBuffer();

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400, immutable');
    res.setHeader('Access-Control-Allow-Origin', '*');

    return res.status(200).send(Buffer.from(buffer));
  } catch (err) {
    console.error('[Image Proxy Error]:', err);
    return res.status(500).json({ error: 'Error proxying image', message: err.message });
  }
}
