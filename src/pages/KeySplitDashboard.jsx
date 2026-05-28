import { useState, useEffect } from 'react'
import { keySplitAPI } from '../lib/api'

export default function KeySplitDashboard() {
  const [stats, setStats] = useState(null)
  const [usageStats, setUsageStats] = useState(null)
  const [days, setDays] = useState(7)

  useEffect(() => {
    keySplitAPI.getDashboard().then(setStats).catch(() => {})
    keySplitAPI.getStats(days).then(setUsageStats).catch(() => {})
  }, [days])

  const t = usageStats?.total || {}

  return (
    <>
      <div className="page-header">
        <h1><i className="fa-solid fa-key" /> Key Split</h1>
        <p>API Key 代理与 Token 用量统计</p>
      </div>
      <div className="page-body" style={{ maxWidth: 960 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats?.subKeys || 0}</div>
            <div style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>子 Key 数</div>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats?.channels || 0}</div>
            <div style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>渠道数</div>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{(t.total || 0).toLocaleString()}</div>
            <div style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>{days}天 Token 用量</div>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{(t.requests || 0).toLocaleString()}</div>
            <div style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>{days}天请求数</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1rem' }}>
          {[7, 30, 90].map(d => (
            <button key={d} className={`btn btn-sm ${days === d ? 'btn-primary' : ''}`} onClick={() => setDays(d)}>{d} 天</button>
          ))}
        </div>
        {usageStats?.byKey?.length > 0 && (
          <div className="card">
            <h3 style={{ marginBottom: '.75rem', fontSize: '.95rem' }}>按子 Key 分布</h3>
            <table className="doc-table">
              <thead><tr><th>Key</th><th>名称</th><th>Token</th><th>请求</th></tr></thead>
              <tbody>{usageStats.byKey.map((k, i) => (
                <tr key={i}><td><code>{k.key_prefix}</code></td><td>{k.name || '-'}</td><td>{(k.tokens||0).toLocaleString()}</td><td>{k.requests}</td></tr>
              ))}</tbody>
            </table>
          </div>
        )}
        {usageStats?.byModel?.length > 0 && (
          <div className="card" style={{ marginTop: '1rem' }}>
            <h3 style={{ marginBottom: '.75rem', fontSize: '.95rem' }}>按模型分布</h3>
            <table className="doc-table">
              <thead><tr><th>模型</th><th>Token</th><th>请求</th></tr></thead>
              <tbody>{usageStats.byModel.map((m, i) => (
                <tr key={i}><td>{m.model || '-'}</td><td>{(m.tokens||0).toLocaleString()}</td><td>{m.requests}</td></tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
