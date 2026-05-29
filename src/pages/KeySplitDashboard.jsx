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
  const daily = usageStats?.daily || []
  const byKey = usageStats?.byKey || []
  const byModel = usageStats?.byModel || []
  const successRate = t.requests > 0 ? Math.round((t.success || 0) / t.requests * 100) : 0
  const maxDailyTokens = daily.length > 0 ? Math.max(...daily.map(d => d.tokens || 0)) : 1

  return (
    <>
      <div className="page-header">
        <h1><i className="fa-solid fa-chart-pie" /> Key Split 仪表盘</h1>
        <p>API Key 代理服务总览</p>
      </div>
      <div className="page-body" style={{ maxWidth: 960 }}>

        {/* ── 时间范围 ── */}
        <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1.25rem' }}>
          {[7, 30, 90].map(d => (
            <button key={d} className={`btn btn-sm ${days === d ? 'btn-primary' : ''}`} onClick={() => setDays(d)}>{d} 天</button>
          ))}
        </div>

        {/* ── 核心指标卡片 ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <StatCard icon="fa-key" color="var(--primary)" label="子 Key" value={stats?.subKeys || 0} />
          <StatCard icon="fa-link" color="#f59e0b" label="渠道" value={stats?.channels || 0} />
          <StatCard icon="fa-coins" color="#10b981" label={`${days}天 Token`} value={(t.total || 0).toLocaleString()} />
          <StatCard icon="fa-bolt" color="#8b5cf6" label={`${days}天请求`} value={(t.requests || 0).toLocaleString()} />
          <StatCard icon="fa-check-circle" color={successRate >= 95 ? '#10b981' : successRate >= 80 ? '#f59e0b' : '#ef4444'} label="成功率" value={`${successRate}%`} />
          <StatCard icon="fa-clock" color="#06b6d4" label="平均延迟" value={t.avg_latency ? `${t.avg_latency}ms` : '-'} />
        </div>

        {/* ── 每日趋势 ── */}
        {daily.length > 0 && (
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ marginBottom: '.75rem', fontSize: '.95rem' }}><i className="fa-solid fa-chart-bar" style={{ marginRight: '.4rem' }} />每日趋势</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: 120 }}>
              {daily.map((d, i) => {
                const pct = maxDailyTokens > 0 ? (d.tokens || 0) / maxDailyTokens * 100 : 0
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                    <span style={{ fontSize: '.65rem', color: 'var(--text-muted)' }}>{((d.tokens || 0) / 1000).toFixed(0)}k</span>
                    <div style={{ width: '100%', height: `${Math.max(pct, 3)}%`, background: 'var(--primary)', borderRadius: '3px 3px 0 0', minHeight: 3, transition: 'height .3s' }} />
                    <span style={{ fontSize: '.6rem', color: 'var(--text-light)' }}>{d.date?.slice(5) || ''}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── 分布表格 ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1rem' }}>
          {/* 按模型 */}
          {byModel.length > 0 && (
            <div className="card">
              <h3 style={{ marginBottom: '.75rem', fontSize: '.95rem' }}><i className="fa-solid fa-microchip" style={{ marginRight: '.4rem' }} />按模型分布</h3>
              <table className="doc-table">
                <thead><tr><th>模型</th><th>Token</th><th>请求</th></tr></thead>
                <tbody>{byModel.map((m, i) => (
                  <tr key={i}>
                    <td><code>{m.model || '-'}</code></td>
                    <td>{(m.tokens || 0).toLocaleString()}</td>
                    <td>{m.requests}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}

          {/* 按子 Key */}
          {byKey.length > 0 && (
            <div className="card">
              <h3 style={{ marginBottom: '.75rem', fontSize: '.95rem' }}><i className="fa-solid fa-key" style={{ marginRight: '.4rem' }} />按子 Key 分布</h3>
              <table className="doc-table">
                <thead><tr><th>Key</th><th>名称</th><th>Token</th><th>请求</th></tr></thead>
                <tbody>{byKey.map((k, i) => (
                  <tr key={i}>
                    <td><code>{k.key_prefix}</code></td>
                    <td>{k.name || '-'}</td>
                    <td>{(k.tokens || 0).toLocaleString()}</td>
                    <td>{k.requests}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── 空状态 ── */}
        {!usageStats && (
          <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <i className="fa-solid fa-chart-line" style={{ fontSize: '2rem', marginBottom: '.75rem', display: 'block' }} />
            暂无用量数据
          </div>
        )}
      </div>
    </>
  )
}

function StatCard({ icon, color, label, value }) {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '.75rem', padding: '1rem' }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `${color}15`, color, fontSize: '1rem', flexShrink: 0
      }}>
        <i className={`fa-solid ${icon}`} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.2 }}>{value}</div>
        <div style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>{label}</div>
      </div>
    </div>
  )
}
