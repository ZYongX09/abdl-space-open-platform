import { Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

const CARDS = [
  { to: '/captcha-keys', icon: 'fa-key', title: '验证码 API Key', desc: '创建和管理 Captcha API Key，接入人机验证服务', color: '#4361ee' },
  { to: '/content-keys', icon: 'fa-code', title: '内容 API Key', desc: '管理内容 API Key，接入帖子和排行榜数据', color: '#06d6a0' },
  { to: '/oauth-clients', icon: 'fa-puzzle-piece', title: 'OAuth 应用', desc: '注册 OAuth 应用，实现第三方登录接入', color: '#7209b7' },
  { to: '/docs/basic-concepts', icon: 'fa-lightbulb', title: '基础概念', desc: '了解开放平台的核心概念和开发流程', color: '#ffd166' },
  { to: '/docs/captcha', icon: 'fa-shield-halved', title: '验证码文档', desc: '查看 Captcha API 接入文档和示例代码', color: '#06d6a0' },
  { to: '/docs/content', icon: 'fa-book', title: '内容 API 文档', desc: '查看帖子、排行榜、纸尿裤数据 API 文档', color: '#ef476f' },
  { to: '/docs/oauth', icon: 'fa-book-open', title: 'OAuth 文档', desc: '查看 OAuth 2.0 授权流程和 API 参考', color: '#ef476f' },
];

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <>
      <div className="page-header">
        <h1><i className="fa-solid fa-gauge" /> 仪表盘</h1>
        <p>欢迎回来，{user?.username}</p>
      </div>
      <div className="page-body">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {CARDS.map(card => (
            <Link key={card.to} to={card.to} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ height: '100%', transition: 'all 0.15s', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = card.color; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}>
                <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: 10, background: `${card.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                  <i className={`fa-solid ${card.icon}`} style={{ color: card.color, fontSize: '1.1rem' }} />
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>{card.title}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{card.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
