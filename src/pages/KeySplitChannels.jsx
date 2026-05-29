import { useState, useEffect } from 'react'
import { keySplitAPI } from '../lib/api'

export default function KeySplitChannels() {
  const [channels, setChannels] = useState([])
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({ name: '', base_url: '', api_key: '', models: '' })

  const load = () => keySplitAPI.listChannels().then(setChannels).catch(() => {})
  useEffect(() => { load() }, [])

  const create = async () => {
    try {
      const models = form.models.split(',').map(s => s.trim()).filter(Boolean)
      await keySplitAPI.createChannel({ ...form, models })
      setForm({ name: '', base_url: '', api_key: '', models: '' })
      setShow(false)
      load()
    } catch (e) { alert(e.message) }
  }

  const test = async (id) => {
    try {
      const r = await keySplitAPI.testChannel(id)
      alert(r.ok ? '✅ 连接成功' : `❌ 连接失败 (${r.status})`)
    } catch (e) { alert(e.message) }
  }

  const remove = async (id) => {
    if (!confirm('确定删除？')) return
    try {
      await keySplitAPI.deleteChannel(id)
      load()
    } catch (e) { alert(e.message) }
  }

  return (
    <>
      <div className="page-header">
        <h1><i className="fa-solid fa-link" /> 渠道管理</h1>
        <p>配置上游 API 服务商</p>
      </div>
      <div className="page-body" style={{ maxWidth: 960 }}>
        <button className="btn btn-primary" onClick={() => setShow(!show)} style={{ marginBottom: '1rem' }}>
          {show ? '取消' : '+ 添加渠道'}
        </button>
        {show && (
          <div className="card" style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
              <input className="form-control" placeholder="名称 (如 OpenAI)" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              <input className="form-control" placeholder="Base URL (如 https://api.openai.com)" value={form.base_url} onChange={e => setForm(f => ({ ...f, base_url: e.target.value }))} />
              <input className="form-control" placeholder="API Key" type="password" value={form.api_key} onChange={e => setForm(f => ({ ...f, api_key: e.target.value }))} />
              <input className="form-control" placeholder="支持的模型 (逗号分隔，留空=全部)" value={form.models} onChange={e => setForm(f => ({ ...f, models: e.target.value }))} />
              <button className="btn btn-primary" onClick={create}>添加</button>
            </div>
          </div>
        )}
        <div className="card">
          <table className="doc-table">
            <thead><tr><th>名称</th><th>Base URL</th><th>状态</th><th>操作</th></tr></thead>
            <tbody>{channels.map(ch => (
              <tr key={ch.id}>
                <td>{ch.name}</td>
                <td><code>{ch.base_url}</code></td>
                <td><span className={`badge ${ch.enabled ? 'badge-success' : 'badge-danger'}`}>{ch.enabled ? '启用' : '禁用'}</span></td>
                <td>
                  <button className="btn btn-sm" onClick={() => test(ch.id)}>测试</button>
                  <button className="btn btn-sm btn-danger" onClick={() => remove(ch.id)} style={{ marginLeft: '.25rem' }}>删除</button>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </>
  )
}
