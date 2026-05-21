import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

export default function Callback() {
  const { handleCallback } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state') || '/';

    if (!code) {
      navigate('/login');
      return;
    }

    handleCallback(code)
      .then(() => navigate(state))
      .catch(err => {
        console.error('OAuth callback error:', err);
        navigate('/login');
      });
  }, [handleCallback, navigate]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="spinner" style={{ width: '2rem', height: '2rem' }} />
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>正在完成授权...</p>
      </div>
    </div>
  );
}
