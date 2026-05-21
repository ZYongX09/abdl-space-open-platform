import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

export default function Callback() {
  const { handleCallback } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state') || '/';
    const oauthError = params.get('error');

    if (oauthError) {
      setError(`授权被拒绝: ${params.get('error_description') || oauthError}`);
      return;
    }

    if (!code) {
      setError('回调缺少授权码 (code)');
      return;
    }

    handleCallback(code)
      .then(() => navigate(state))
      .catch(err => {
        console.error('OAuth callback error:', err);
        setError(err.message || '授权失败');
      });
  }, [handleCallback, navigate]);

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg)' }}>
        <div className="card" style={{ maxWidth: 400, width: '90%', textAlign: 'center', padding: '2rem' }}>
          <i className="fa-solid fa-circle-xmark" style={{ fontSize: '2.5rem', color: 'var(--danger)', marginBottom: '1rem' }} />
          <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>授权失败</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error}</p>
          <button className="btn btn-primary" onClick={() => navigate('/login')}>
            <i className="fa-solid fa-rotate-left" /> 返回重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="spinner" style={{ width: '2rem', height: '2rem' }} />
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>正在完成授权...</p>
      </div>
    </div>
  );
}
