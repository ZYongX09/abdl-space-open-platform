import { useState, useEffect } from 'react'
import { keySplitAPI } from '../lib/api'

export default function KeySplitKeys() {
  const [keys, setKeys] = useState([])
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({ name: '', quota_tokens: -1 })
  const [newKey, setNewKey] = useState(null)

  const load = () => keySplitAPI.listKeys().then(setKeys).catch(() => {})
  useEffect(() => { load() }, [])

  const create = async () => {
    try {
      const d = await keySplitAPI.createKey(form)
      setNewKey(d.key)
      setForm({ name: '', quota_tokens: -1 })
      load()
    } catch (e) { alert(e.message) }
  }

  const toggle = async (id, enabled) => {
    await keySplitAPI.updateKey(id, { enabled: !enabled })
    load()
  }

  const remove = async (id) => {
    if (!confirm('确定删除？')) return
    await keySplitAPI.deleteKey(id)
    load()
  }

  const reset = async (id) => {
    await keySplitAPI.resetQuota(id)
    load()
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
              <input className="form-control" placeholder="额度上限 (-1=无限)" type="number" style={{ flex: 1, minWidth: 150 }} value={form.quota_tokens} onChange={e => setForm(f => ({ ...f, quota_tokens: parseInt(e.target.value) || -1 }))} />
              <button className="btn btn-primary" onClick={create}>创建</button>
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
          <table className="doc-table">
            <thead><tr><th>Key</th><th>名称</th><th>额度</th><th>已用</th><th>状态</th><th>最后使用</th><th>操作</th></tr></thead>
            <tbody>{keys.map(k => (
              <tr key={k.id}>
                <td><code>{k.key_prefix}***</code></td>
                <td>{k.name || '-'}</td>
                <td>{k.quota_tokens < 0 ? '无限' : k.quota_tokens.toLocaleString()}</td>
                <td>{(k.used_tokens || 0).toLocaleString()}</td>
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
        </div>
      </div>
    </>
  )
}
