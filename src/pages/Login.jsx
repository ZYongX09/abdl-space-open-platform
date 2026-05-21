import { useAuth } from '../lib/AuthContext';

export default function Login() {
  const { login } = useAuth();

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg)' }}>
      <div className="card" style={{ maxWidth: 400, width: '90%', textAlign: 'center', padding: '2.5rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary)' }}><i className="fa-solid fa-rocket" /></div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>ABDL-Space 开放平台</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          使用你的 ABDL-Space 账号登录
        </p>
        <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => login('/')}>
          <i className="fa-solid fa-right-to-bracket" /> 登录
        </button>
      </div>
    </div>
  );
}
