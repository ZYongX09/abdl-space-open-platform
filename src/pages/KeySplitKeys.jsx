import { useState, useEffect } from 'react'
import { keySplitAPI } from '../lib/api'

export default function KeySplitKeys() {
  const [keys, setKeys] = useState([])
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', quota_tokens: -1, rate_limit: 60 })
  const [newKey, setNewKey] = useState(null)

  const load = () => keySplitAPI.listKeys().then(setKeys).catch(() => {})
  useEffect(() => { load() }, [])

  const create = async () => {
    try {
      setLoading(true)
      const d = await keySplitAPI.createKey(form)
      setNewKey(d.key)
      setForm({ name: '', quota_tokens: -1, rate_limit: 60 })
      load()
    } catch (e) { alert(e.message) } finally { setLoading(false) }
  }

  const toggle = async (id, enabled) => {
    try {
      await keySplitAPI.updateKey(id, { enabled: !enabled })
      load()
    } catch (e) { alert(e.message) }
  }

  const remove = async (id) => {
    if (!confirm('确定删除？')) return
    try {
      await keySplitAPI.deleteKey(id)
      load()
    } catch (e) { alert(e.message) }
  }

  const reset = async (id) => {
    try {
      await keySplitAPI.resetQuota(id)
      load()
    } catch (e) { alert(e.message) }
  }

  return (
    <>
      <div className="page-header">
        <h1><i className="fa-solid fa-key" /> 子 Key 管理</h1>
        <p>生成和管理分发给他人使用的 API Key</p>
      </div>
      <div className="page-body" style={{ maxWidth: 960 }}>
        <button className="btn btn-primary" onClick={() => setShow(!show)} style={{ marginBottom: '1rem' }}>
          {show ? '取消' : '+ 创建子 Key'}
        </button>
        {show && (
          <div className="card" style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
              <input className="form-control" placeholder="备注名" style={{ flex: 1, minWidth: 150 }} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              <input className="form-control" placeholder="额度上限 (-1=无限)" type="number" style={{ flex: 1, minWidth: 150 }} value={form.quota_tokens} onChange={e => setForm(f => ({ ...f, quota_tokens: e.target.value === '' ? -1 : parseInt(e.target.value) }))} />
              <input className="form-control" placeholder="速率限制/分钟 (-1=无限)" type="number" style={{ flex: 1, minWidth: 150 }} value={form.rate_limit} onChange={e => setForm(f => ({ ...f, rate_limit: e.target.value === '' ? 60 : parseInt(e.target.value) }))} />
              <button className="btn btn-primary" onClick={create} disabled={loading}>{loading ? '创建中...' : '创建'}</button>
            </div>
          </div>
        )}
        {newKey && (
          <div className="card" style={{ background: 'rgba(6,214,160,0.08)', border: '1px solid rgba(6,214,160,0.3)', marginBottom: '1rem' }}>
            <p style={{ fontSize: '.85rem', marginBottom: '.5rem' }}>✅ 子 Key 已创建，请复制保存（仅显示一次）：</p>
            <code style={{ fontSize: '.9rem', wordBreak: 'break-all', color: 'var(--success)' }}>{newKey}</code>
            <button className="btn btn-sm" style={{ marginLeft: '.5rem' }} onClick={() => { navigator.clipboard.writeText(newKey); alert('已复制') }}>复制</button>
            <button className="btn btn-sm" style={{ marginLeft: '.5rem' }} onClick={() => setNewKey(null)}>关闭</button>
          </div>
        )}
        <div className="card">
          {keys.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>暂无子 Key</p>
          ) : (
            <table className="doc-table">
              <thead><tr><th>Key</th><th>名称</th><th>额度</th><th>已用</th><th>速率限制</th><th>状态</th><th>最后使用</th><th>操作</th></tr></thead>
              <tbody>{keys.map(k => (
                <tr key={k.id}>
                  <td><code>{k.key_prefix}***</code></td>
                  <td>{k.name || '-'}</td>
                  <td>{k.quota_tokens < 0 ? '无限' : k.quota_tokens.toLocaleString()}</td>
                  <td>{(k.used_tokens || 0).toLocaleString()}</td>
                  <td>{(k.rate_limit ?? 60) < 0 ? '无限' : `${k.rate_limit ?? 60}/min`}</td>
                  <td><span className={`badge ${k.enabled ? 'badge-success' : 'badge-danger'}`}>{k.enabled ? '启用' : '禁用'}</span></td>
                  <td>{k.last_used_at ? new Date(k.last_used_at * 1000).toLocaleString('zh-CN') : '-'}</td>
                  <td>
                    <button className="btn btn-sm" onClick={() => toggle(k.id, k.enabled)}>{k.enabled ? '禁用' : '启用'}</button>
                    <button className="btn btn-sm" onClick={() => reset(k.id)} style={{ marginLeft: '.25rem' }}>重置额度</button>
                    <button className="btn btn-sm btn-danger" onClick={() => remove(k.id)} style={{ marginLeft: '.25rem' }}>删除</button>
                  </td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </div>
      </div>
    </>
  )
}
