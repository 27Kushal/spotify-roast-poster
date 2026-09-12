import React, { useEffect, useState, useRef } from 'react';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import LoadingState from './LoadingState';

export default function Callback({ onAuthSuccess, handleCallback }) {
  const [error, setError] = useState(null);
  const executionRef = useRef(false);

  useEffect(() => {
    // Avoid double execution in React StrictMode
    if (executionRef.current) return;
    executionRef.current = true;

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const authError = urlParams.get('error');

    if (authError) {
      setError(`Spotify authorization was denied or cancelled (${authError}).`);
      return;
    }

    if (!code) {
      setError('No authorization code found in the callback URL.');
      return;
    }

    async function processCode() {
      try {
        const token = await handleCallback(code);
        // Clean URL to avoid code re-submission
        window.history.replaceState({}, document.title, window.location.pathname);
        if (onAuthSuccess) {
          onAuthSuccess(token);
        }
      } catch (err) {
        setError(err.message || 'Failed to exchange authorization code for token.');
      }
    }

    processCode();
  }, [handleCallback, onAuthSuccess]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-spotify-black text-white">
        <div className="max-w-md w-full p-8 rounded-2xl bg-spotify-dark border border-red-500/30 text-center">
          <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold mb-2">Authentication Failed</h2>
          <p className="text-sm text-spotify-subtext mb-6">{error}</p>
          <button
            onClick={() => {
              window.location.href = '/';
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Landing Page</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-spotify-black text-white">
      <LoadingState customMessage="Exchanging credentials with Spotify..." />
    </div>
  );
}
