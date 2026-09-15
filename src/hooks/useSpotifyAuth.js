import { useState, useEffect, useCallback } from 'react';
import { buildAuthUrl, exchangeCodeForToken, refreshAccessToken } from '../utils/spotify';

const STORAGE_KEY_TOKEN = 'sonic_mirror_spotify_token';
const STORAGE_KEY_REFRESH = 'sonic_mirror_spotify_refresh';
const STORAGE_KEY_EXPIRES = 'sonic_mirror_spotify_expires_at';

function getStored(key) {
  try {
    return localStorage.getItem(key) || sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function setStored(key, val) {
  try {
    localStorage.setItem(key, val);
  } catch {
    // ignore
  }
  try {
    sessionStorage.setItem(key, val);
  } catch {
    // ignore
  }
}

function removeStored(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
  try {
    sessionStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function useSpotifyAuth() {
  const [token, setToken] = useState(() => {
    const existing = getStored(STORAGE_KEY_TOKEN);
    const expiresAt = Number(getStored(STORAGE_KEY_EXPIRES) || 0);
    // If expired, will be refreshed
    if (existing && expiresAt && Date.now() > expiresAt) {
      return null;
    }
    return existing || null;
  });

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

  // Save tokens to both localStorage and sessionStorage
  const saveTokens = useCallback((data) => {
    if (data.access_token) {
      setStored(STORAGE_KEY_TOKEN, data.access_token);
      setToken(data.access_token);

      if (data.refresh_token) {
        setStored(STORAGE_KEY_REFRESH, data.refresh_token);
      }
      if (data.expires_in) {
        const expiresAt = Date.now() + data.expires_in * 1000;
        setStored(STORAGE_KEY_EXPIRES, expiresAt.toString());
      }
    }
  }, []);

  const logout = useCallback(() => {
    removeStored(STORAGE_KEY_TOKEN);
    removeStored(STORAGE_KEY_REFRESH);
    removeStored(STORAGE_KEY_EXPIRES);
    setToken(null);
    setError(null);
  }, []);

  // Proactive token refresh
  const refreshAuthToken = useCallback(async () => {
    const refreshToken = getStored(STORAGE_KEY_REFRESH);
    if (!refreshToken) {
      logout();
      return null;
    }
    try {
      const data = await refreshAccessToken(refreshToken);
      saveTokens(data);
      return data.access_token;
    } catch (err) {
      console.warn('Failed to refresh token:', err);
      logout();
      return null;
    }
  }, [logout, saveTokens]);

  // Attempt auto-refresh on mount if access token expired but refresh token exists
  useEffect(() => {
    const existingToken = getStored(STORAGE_KEY_TOKEN);
    const expiresAt = Number(getStored(STORAGE_KEY_EXPIRES) || 0);
    const refreshToken = getStored(STORAGE_KEY_REFRESH);

    if (refreshToken && (!existingToken || (expiresAt && Date.now() > expiresAt - 60000))) {
      refreshAuthToken();
    }
  }, [refreshAuthToken]);

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
    refreshAuthToken,
    logout,
  };
}
