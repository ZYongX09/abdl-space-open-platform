import { useState, useEffect, useCallback } from 'react';
import { captchaKeysAPI } from '../lib/api';

export default function CaptchaKeys() {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [revealedKey, setRevealedKey] = useState(null);
  const [form, setForm] = useState({ label: '', rate_limit: 100 });
  const [creating, setCreating] = useState(false);
  const [msg, setMsg] = useState(null);

  const loadKeys = useCallback(async () => {
    try { setLoading(true); const res = await captchaKeysAPI.list(); setKeys(res.keys || []); }
    catch (err) { setMsg({ type: 'error', text: err.message }); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadKeys(); }, [loadKeys]);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const res = await captchaKeysAPI.create({ label: form.label || undefined, rate_limit: form.rate_limit });
      setRevealedKey({ key: res.key, prefix: res.key_prefix });
      setShowCreate(false);
      setForm({ label: '', rate_limit: 100 });
      loadKeys();
      setMsg({ type: 'success', text: 'API Key 创建成功' });
    } catch (err) { setMsg({ type: 'error', text: err.message }); }
    finally { setCreating(false); }
  };

  const toggleActive = async (id, active) => {
    try { await captchaKeysAPI.update(id, { active: !active }); loadKeys(); }
    catch (err) { setMsg({ type: 'error', text: err.message }); }
  };

  const deleteKey = async (id) => {
    if (!confirm('确定删除此 Key？')) return;
    try { await captchaKeysAPI.delete(id); loadKeys(); setMsg({ type: 'success', text: '已删除' }); }
    catch (err) { setMsg({ type: 'error', text: err.message }); }
  };

  const copy = (t) => navigator.clipboard.writeText(t).then(() => setMsg({ type: 'success', text: '已复制' }));

  return (
    <>
      <div className="page-header">
        <h1><i className="fa-solid fa-key" /> 验证码 API Key</h1>
        <p>管理你的 Captcha API Key，用于服务端调用验证码接口</p>
      </div>
      <div className="page-body" style={{ maxWidth: 720 }}>

        {msg && (
          <div style={{ padding: '0.6rem 1rem', borderRadius: 8, marginBottom: '1rem', fontSize: '0.8rem',
            background: msg.type === 'success' ? 'rgba(6,214,160,0.1)' : 'rgba(239,71,111,0.1)',
            color: msg.type === 'success' ? 'var(--success)' : 'var(--danger)' }}>
            {msg.text}
            <button onClick={() => setMsg(null)} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>×</button>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <button className="btn btn-primary btn-sm" onClick={() => setShowCreate(true)}>
            <i className="fa-solid fa-plus" /> 创建 Key
          </button>
        </div>

        {revealedKey && (
          <div className="card" style={{ border: '1.5px solid var(--success)', marginBottom: '1rem' }}>
            <p style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              <i className="fa-solid fa-circle-check" style={{ color: 'var(--success)', marginRight: '0.4rem' }} />
              API Key 已创建
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--danger)', marginBottom: '0.5rem' }}><i className="fa-solid fa-triangle-exclamation mr-1" />请立即复制保存，仅显示一次</p>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <code style={{ flex: 1, wordBreak: 'break-all', padding: '0.5rem', fontSize: '0.8rem' }}>{revealedKey.key}</code>
              <button className="btn btn-outline btn-sm" onClick={() => copy(revealedKey.key)}><i className="fa-solid fa-copy" /></button>
            </div>
            <button onClick={() => setRevealedKey(null)} style={{ marginTop: '0.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}>
              我已保存，关闭
            </button>
          </div>
        )}

        {showCreate && (
          <div className="card" style={{ marginBottom: '1rem', border: '1.5px solid var(--primary)' }}>
            <h3 style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.75rem' }}>创建新 Key</h3>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>备注</label>
              <input className="form-control" value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} placeholder="如: 我的网站" />
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>每小时请求上限</label>
              <input type="number" className="form-control" value={form.rate_limit} onChange={e => setForm(f => ({ ...f, rate_limit: Number(e.target.value) }))} min={1} max={10000} />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-primary btn-sm" onClick={handleCreate} disabled={creating}>{creating ? '创建中...' : '确认创建'}</button>
              <button className="btn btn-outline btn-sm" onClick={() => setShowCreate(false)}>取消</button>
            </div>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}><div className="spinner" /></div>
        ) : keys.length === 0 ? (
          <div className="empty-state"><i className="fa-solid fa-key" /><p>还没有 API Key</p></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {keys.map(k => (
              <div key={k.id} className="card" style={{ opacity: k.active ? 1 : 0.5 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <code style={{ fontWeight: 700, fontSize: '0.8rem' }}>{k.key_prefix}...</code>
                      {k.label && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{k.label}</span>}
                      <span className={`badge ${k.active ? 'badge-success' : 'badge-danger'}`}>{k.active ? '启用' : '禁用'}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <span>限速 {k.rate_limit}/h</span>
                      <span>调用 {k.use_count} 次</span>
                      {k.last_used && <span>最后使用 {new Date(k.last_used * 1000).toLocaleString('zh-CN')}</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => toggleActive(k.id, k.active)}>{k.active ? '禁用' : '启用'}</button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteKey(k.id)}>删除</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
