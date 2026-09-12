import { useState, useEffect, useCallback } from 'react';
import { buildAuthUrl, exchangeCodeForToken } from '../utils/spotify';

const STORAGE_KEY_TOKEN = 'sonic_mirror_spotify_token';
const STORAGE_KEY_REFRESH = 'sonic_mirror_spotify_refresh';
const STORAGE_KEY_EXPIRES = 'sonic_mirror_spotify_expires_at';

export function useSpotifyAuth() {
  const [token, setToken] = useState(() => sessionStorage.getItem(STORAGE_KEY_TOKEN) || null);
  const [authConfig, setAuthConfig] = useState({ clientId: '', redirectUri: '', isConfigured: false });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load public client config on mount
  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch('/api/auth-config');
        if (res.ok) {
          const config = await res.json();
          setAuthConfig(config);
        }
      } catch (err) {
        console.error('Failed to load auth config:', err);
      }
    }
    loadConfig();
  }, []);

  // Save or clear tokens
  const saveTokens = useCallback((data) => {
    if (data.access_token) {
      sessionStorage.setItem(STORAGE_KEY_TOKEN, data.access_token);
      setToken(data.access_token);

      if (data.refresh_token) {
        sessionStorage.setItem(STORAGE_KEY_REFRESH, data.refresh_token);
      }
      if (data.expires_in) {
        const expiresAt = Date.now() + data.expires_in * 1000;
        sessionStorage.setItem(STORAGE_KEY_EXPIRES, expiresAt.toString());
      }
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY_TOKEN);
    sessionStorage.removeItem(STORAGE_KEY_REFRESH);
    sessionStorage.removeItem(STORAGE_KEY_EXPIRES);
    setToken(null);
    setError(null);
  }, []);

  // Handle OAuth code exchange callback
  const handleCallback = useCallback(
    async (code) => {
      setIsLoading(true);
      setError(null);
      try {
        const redirectUri = authConfig.redirectUri || window.location.origin + '/callback';
        const data = await exchangeCodeForToken(code, redirectUri);
        saveTokens(data);
        return data.access_token;
      } catch (err) {
        console.error('Callback error:', err);
        setError(err.message || 'Authentication failed');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [authConfig.redirectUri, saveTokens]
  );

  const redirectUri = authConfig.redirectUri || (typeof window !== 'undefined' ? `${window.location.origin}/callback` : '');
  const loginUrl = buildAuthUrl(authConfig.clientId, redirectUri);

  return {
    token,
    isAuthenticated: Boolean(token),
    isLoading,
    error,
    loginUrl,
    authConfig,
    handleCallback,
    logout,
  };
}
