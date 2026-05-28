import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

const NAV_ITEMS = [
  { to: '/', icon: 'fa-gauge', label: '仪表盘' },
  { section: 'API 管理' },
  { to: '/captcha-keys', icon: 'fa-key', label: '验证码 Key' },
  { to: '/content-keys', icon: 'fa-code', label: '内容 API Key' },
  { to: '/oauth-clients', icon: 'fa-puzzle-piece', label: 'OAuth 应用' },
  { section: '开发文档' },
  { to: '/docs/basic-concepts', icon: 'fa-lightbulb', label: '基础概念' },
  { to: '/docs/captcha', icon: 'fa-shield-halved', label: '验证码 API' },
  { to: '/docs/content', icon: 'fa-book', label: '内容 API' },
  { to: '/docs/oauth', icon: 'fa-book-open', label: 'OAuth 2.0' },
  { section: 'Key Split' },
  { to: '/key-split', icon: 'fa-chart-pie', label: '仪表盘' },
  { to: '/key-split/keys', icon: 'fa-key', label: '子 Key 管理' },
  { to: '/key-split/channels', icon: 'fa-link', label: '渠道管理' },
  { to: '/key-split/logs', icon: 'fa-list', label: '用量日志' },
];

export default function Layout() {
  const { user, loading, login, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg)' }}>
        <div className="card" style={{ maxWidth: 400, width: '90%', textAlign: 'center', padding: '2.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary)' }}><i className="fa-solid fa-rocket" /></div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>ABDL-Space 开放平台</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            管理你的验证码 API Key、OAuth 应用，查阅开发文档
          </p>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => login('/')}>
            <i className="fa-solid fa-right-to-bracket" /> 使用 ABDL-Space 账号登录
          </button>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '1rem' }}>
            将跳转到 ABDL-Space 进行授权
          </p>
        </div>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg)' }}>
        <div className="card" style={{ maxWidth: 400, width: '90%', textAlign: 'center', padding: '2.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--danger)' }}><i className="fa-solid fa-lock" /></div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>权限不足</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            开放平台仅管理员可访问
          </p>
          <button className="btn btn-outline" style={{ width: '100%' }} onClick={logout}>
            <i className="fa-solid fa-right-from-bracket" /> 退出登录
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <i className="fa-solid fa-rocket" />
          <span>开放平台</span>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item, i) => {
            if (item.section) {
              return (
                <div key={i} className="nav-section">
                  <div className="nav-section-title">{item.section}</div>
                </div>
              );
            }
            return (
              <div key={item.to} className="nav-section">
                <NavLink to={item.to} end={item.to === '/'}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                  <i className={`fa-solid ${item.icon}`} />
                  <span>{item.label}</span>
                </NavLink>
              </div>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              {user.avatar ? (
                <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                user.username?.[0]?.toUpperCase() || '?'
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="sidebar-username">{user.username}</div>
              <div className="sidebar-role">{user.role || 'developer'}</div>
            </div>
            <button onClick={logout} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '0.9rem' }}
              title="退出登录">
              <i className="fa-solid fa-right-from-bracket" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
