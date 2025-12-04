import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OAuthCallback() {
  const nav = useNavigate();

  useEffect(() => {
    try {
      // location.hash like "#token=xxxxx"
      const hash = window.location.hash || '';
      const match = hash.match(/token=([^&]+)/);
      const token = match ? decodeURIComponent(match[1]) : null;
      if (token) {
        localStorage.setItem('token', token);
        window.history.replaceState({}, document.title, window.location.pathname);
        nav('/dashboard'); // <-- was '/profile'
      } else {
        nav('/login');
      }
    } catch (err) {
      console.error('OAuth callback parse error', err);
      nav('/login');
    }
  }, [nav]);

  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h2>Signing you in…</h2>
      <p>If you are not redirected automatically, click <a href="/login">Login</a>.</p>
    </div>
  );
}