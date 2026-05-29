import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { captchaKeysAPI, contentKeysAPI, oauthClientsAPI, keySplitAPI } from '../lib/api'

export default function Dashboard() {
  const { user } = useAuth()
  const [counts, setCounts] = useState({
    captchaKeys: 0, captchaCalls: 0,
    contentKeys: 0, contentCalls: 0,
    oauthClients: 0,
    ksKeys: 0, ksChannels: 0, ksTokens: 0, ksCalls: 0,
  })

  useEffect(() => {
    Promise.allSettled([
      captchaKeysAPI.list(),
      contentKeysAPI.list(),
      oauthClientsAPI.list(),
      keySplitAPI.getDashboard(),
    ]).then(([captcha, content, oauth, ks]) => {
      const captchaKeys = captcha.status === 'fulfilled' ? (captcha.value?.keys || []) : []
      const contentKeys = content.status === 'fulfilled' ? (content.value?.keys || []) : []
      const oauthClients = oauth.status === 'fulfilled' ? (oauth.value?.clients || []) : []
      const ksData = ks.status === 'fulfilled' ? ks.value : {}

      setCounts({
        captchaKeys: captchaKeys.length,
        captchaCalls: captchaKeys.reduce((sum, k) => sum + (k.use_count || 0), 0),
        contentKeys: contentKeys.length,
        contentCalls: contentKeys.reduce((sum, k) => sum + (k.use_count || 0), 0),
        oauthClients: oauthClients.length,
        ksKeys: ksData.subKeys || 0,
        ksChannels: ksData.channels || 0,
        ksTokens: ksData.totalTokens || 0,
        ksCalls: ksData.totalRequests || 0,
      })
    })
  }, [])

  return (
    <>
      <div className="page-header">
        <h1><i className="fa-solid fa-gauge" /> 仪表盘</h1>
        <p>欢迎回来，{user?.username}</p>
      </div>
      <div className="page-body">

        {/* ── 统计卡片 ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <StatCard icon="fa-shield-halved" color="#4361ee" label="验证码 Key" value={counts.captchaKeys} sub={`${counts.captchaCalls.toLocaleString()} 次调用`} to="/captcha-keys" />
          <StatCard icon="fa-code" color="#06d6a0" label="内容 Key" value={counts.contentKeys} sub={`${counts.contentCalls.toLocaleString()} 次调用`} to="/content-keys" />
          <StatCard icon="fa-puzzle-piece" color="#7209b7" label="OAuth 应用" value={counts.oauthClients} to="/oauth-clients" />
          <StatCard icon="fa-key" color="var(--primary)" label="KS 子 Key" value={counts.ksKeys} to="/key-split" />
          <StatCard icon="fa-link" color="#f59e0b" label="KS 渠道" value={counts.ksChannels} to="/key-split" />
          <StatCard icon="fa-bolt" color="#8b5cf6" label="KS 调用" value={counts.ksCalls.toLocaleString()} sub={`${counts.ksTokens.toLocaleString()} Token`} to="/key-split" />
        </div>

        {/* ── 快捷入口 ── */}
        <h2 style={{ fontSize: '.95rem', fontWeight: 700, marginBottom: '.75rem' }}>快捷入口</h2>
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
  )
}

function StatCard({ icon, color, label, value, sub, to }) {
  const content = (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '.75rem', padding: '.9rem', cursor: to ? 'pointer' : 'default', transition: 'all 0.15s' }}>
      <div style={{
        width: 36, height: 36, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `${color}15`, color, fontSize: '.9rem', flexShrink: 0
      }}>
        <i className={`fa-solid ${icon}`} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: '1.15rem', fontWeight: 700, lineHeight: 1.2 }}>{value}</div>
        <div style={{ fontSize: '.7rem', color: 'var(--text-muted)' }}>{label}</div>
        {sub && <div style={{ fontSize: '.65rem', color: 'var(--text-light)', marginTop: '1px' }}>{sub}</div>}
      </div>
    </div>
  )

  if (to) {
    return <Link to={to} style={{ textDecoration: 'none', color: 'inherit' }}>{content}</Link>
  }
  return content
}

const CARDS = [
  { to: '/captcha-keys', icon: 'fa-key', title: '验证码 API Key', desc: '创建和管理 Captcha API Key，接入人机验证服务', color: '#4361ee' },
  { to: '/content-keys', icon: 'fa-code', title: '内容 API Key', desc: '管理内容 API Key，接入帖子和排行榜数据', color: '#06d6a0' },
  { to: '/oauth-clients', icon: 'fa-puzzle-piece', title: 'OAuth 应用', desc: '注册 OAuth 应用，实现第三方登录接入', color: '#7209b7' },
  { to: '/key-split', icon: 'fa-chart-pie', title: 'Key Split', desc: 'API Key 代理服务，管理子 Key 和用量统计', color: 'var(--primary)' },
  { to: '/docs/basic-concepts', icon: 'fa-lightbulb', title: '基础概念', desc: '了解开放平台的核心概念和开发流程', color: '#ffd166' },
  { to: '/docs/key-split', icon: 'fa-book', title: 'Key Split 文档', desc: '查看 Key Split API 接入文档和示例代码', color: '#ef476f' },
  { to: '/docs/captcha', icon: 'fa-shield-halved', title: '验证码文档', desc: '查看 Captcha API 接入文档和示例代码', color: '#06d6a0' },
  { to: '/docs/content', icon: 'fa-book', title: '内容 API 文档', desc: '查看帖子、排行榜、纸尿裤数据 API 文档', color: '#ef476f' },
  { to: '/docs/oauth', icon: 'fa-book-open', title: 'OAuth 文档', desc: '查看 OAuth 2.0 授权流程和 API 参考', color: '#ef476f' },
]
