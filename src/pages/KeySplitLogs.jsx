import { useState, useEffect } from 'react'
import { keySplitAPI } from '../lib/api'

export default function KeySplitLogs() {
  const [logs, setLogs] = useState([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 50

  useEffect(() => {
    keySplitAPI.getLogs(page, limit).then(d => { setLogs(d.logs); setTotal(d.total) }).catch(() => {})
  }, [page])

  const pages = Math.ceil(total / limit)

  return (
    <>
      <div className="page-header">
        <h1><i className="fa-solid fa-list" /> 用量日志</h1>
        <p>共 {total.toLocaleString()} 条记录</p>
      </div>
      <div className="page-body" style={{ maxWidth: 960 }}>
        <div className="card">
          <table className="doc-table">
            <thead><tr><th>时间</th><th>Key</th><th>渠道</th><th>模型</th><th>输入</th><th>输出</th><th>总计</th><th>延迟</th><th>状态</th></tr></thead>
            <tbody>{logs.map(l => (
              <tr key={l.id}>
                <td>{new Date(l.request_at * 1000).toLocaleString('zh-CN')}</td>
                <td><code>{l.key_prefix}***</code></td>
                <td>{l.channel_name}</td>
                <td>{l.model || '-'}</td>
                <td>{l.prompt_tokens}</td>
                <td>{l.completion_tokens}</td>
                <td><strong>{l.total_tokens}</strong></td>
                <td>{l.latency_ms}ms</td>
                <td>{l.status === 200 ? '✅' : `❌ ${l.status}`}</td>
              </tr>
            ))}</tbody>
          </table>
          {pages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '.5rem', marginTop: '1rem' }}>
              <button className="btn btn-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>上一页</button>
              <span style={{ fontSize: '.85rem', lineHeight: '2rem' }}>{page} / {pages}</span>
              <button className="btn btn-sm" disabled={page >= pages} onClick={() => setPage(p => p + 1)}>下一页</button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
