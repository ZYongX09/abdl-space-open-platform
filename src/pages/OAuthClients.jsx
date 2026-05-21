import { useState, useEffect, useCallback } from 'react';
import { oauthClientsAPI } from '../lib/api';

export default function OAuthClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showSecret, setShowSecret] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', logo_url: '', homepage_url: '', redirect_uris: '', scopes: ['profile'] });
  const [msg, setMsg] = useState(null);

  const ALL_SCOPES = ['profile', 'email', 'read', 'write'];

  const loadClients = useCallback(async () => {
    try { setLoading(true); const res = await oauthClientsAPI.list(); setClients(res.clients || []); }
    catch (err) { setMsg({ type: 'error', text: err.message }); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadClients(); }, [loadClients]);

  const resetForm = () => { setForm({ name: '', description: '', logo_url: '', homepage_url: '', redirect_uris: '', scopes: ['profile'] }); setEditing(null); setShowCreate(false); };

  const handleCreate = async () => {
    const uris = form.redirect_uris.split('\n').map(u => u.trim()).filter(Boolean);
    if (!form.name || uris.length === 0) { setMsg({ type: 'error', text: '请填写名称和回调地址' }); return; }
    try {
      const res = await oauthClientsAPI.create({ name: form.name, description: form.description || undefined, logo_url: form.logo_url || undefined, homepage_url: form.homepage_url || undefined, redirect_uris: uris, scopes: form.scopes });
      setShowSecret({ client_id: res.client.client_id, secret: res.raw_secret });
      resetForm(); loadClients(); setMsg({ type: 'success', text: '应用创建成功' });
    } catch (err) { setMsg({ type: 'error', text: err.message }); }
  };

  const handleUpdate = async () => {
    const uris = form.redirect_uris.split('\n').map(u => u.trim()).filter(Boolean);
    try {
      await oauthClientsAPI.update(editing, { name: form.name, description: form.description, logo_url: form.logo_url, homepage_url: form.homepage_url, redirect_uris: uris, scopes: form.scopes });
      resetForm(); loadClients(); setMsg({ type: 'success', text: '已更新' });
    } catch (err) { setMsg({ type: 'error', text: err.message }); }
  };

  const handleDelete = async (cid) => {
    if (!confirm('确定删除？所有已授权 token 将被吊销。')) return;
    try { await oauthClientsAPI.delete(cid); loadClients(); setMsg({ type: 'success', text: '已删除' }); }
    catch (err) { setMsg({ type: 'error', text: err.message }); }
  };

  const startEdit = (cl) => {
    setEditing(cl.client_id);
    setForm({ name: cl.name, description: cl.description || '', logo_url: cl.logo_url || '', homepage_url: cl.homepage_url || '', redirect_uris: cl.redirect_uris.join('\n'), scopes: cl.scopes });
    setShowCreate(true);
  };

  const copy = (t) => navigator.clipboard.writeText(t).then(() => setMsg({ type: 'success', text: '已复制' }));

  return (
    <>
      <div className="page-header">
        <h1><i className="fa-solid fa-puzzle-piece" /> OAuth 应用</h1>
        <p>管理你的 OAuth 2.0 应用，实现第三方登录接入</p>
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
          <button className="btn btn-primary btn-sm" onClick={() => { resetForm(); setShowCreate(true); }}>
            <i className="fa-solid fa-plus" /> 创建应用
          </button>
        </div>

        {showSecret && (
          <div className="card" style={{ border: '1.5px solid var(--success)', marginBottom: '1rem' }}>
            <p style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              <i className="fa-solid fa-circle-check" style={{ color: 'var(--success)', marginRight: '0.4rem' }} />应用已创建
            </p>
            <div style={{ marginBottom: '0.5rem' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Client ID:</p>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <code style={{ flex: 1, fontSize: '0.8rem', wordBreak: 'break-all', padding: '0.4rem' }}>{showSecret.client_id}</code>
                <button className="btn btn-outline btn-sm" onClick={() => copy(showSecret.client_id)}><i className="fa-solid fa-copy" /></button>
              </div>
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--danger)', marginBottom: '0.25rem' }}>Client Secret（仅显示一次）:</p>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <code style={{ flex: 1, fontSize: '0.8rem', wordBreak: 'break-all', padding: '0.4rem' }}>{showSecret.secret}</code>
                <button className="btn btn-outline btn-sm" onClick={() => copy(showSecret.secret)}><i className="fa-solid fa-copy" /></button>
              </div>
            </div>
            <button onClick={() => setShowSecret(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}>我已保存，关闭</button>
          </div>
        )}

        {showCreate && (
          <div className="card" style={{ marginBottom: '1rem', border: '1.5px solid var(--primary)' }}>
            <h3 style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.75rem' }}>{editing ? '编辑应用' : '创建新应用'}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>应用名称 *</label>
                <input className="form-control" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="My App" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>描述</label>
                <input className="form-control" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Logo URL</label>
                  <input className="form-control" value={form.logo_url} onChange={e => setForm(f => ({ ...f, logo_url: e.target.value }))} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>主页 URL</label>
                  <input className="form-control" value={form.homepage_url} onChange={e => setForm(f => ({ ...f, homepage_url: e.target.value }))} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>回调地址 * (每行一个)</label>
                <textarea className="form-control" rows={2} value={form.redirect_uris} onChange={e => setForm(f => ({ ...f, redirect_uris: e.target.value }))} placeholder="https://your-app.com/callback" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>权限</label>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {ALL_SCOPES.map(s => (
                    <button key={s} type="button" className="btn btn-sm"
                      style={{ background: form.scopes.includes(s) ? 'var(--primary)' : 'var(--input-bg)', color: form.scopes.includes(s) ? '#fff' : 'var(--text)', border: '1px solid var(--border)' }}
                      onClick={() => setForm(f => ({ ...f, scopes: f.scopes.includes(s) ? f.scopes.filter(x => x !== s) : [...f.scopes, s] }))}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-primary btn-sm" onClick={editing ? handleUpdate : handleCreate}>{editing ? '保存' : '创建'}</button>
                <button className="btn btn-outline btn-sm" onClick={resetForm}>取消</button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}><div className="spinner" /></div>
        ) : clients.length === 0 ? (
          <div className="empty-state"><i className="fa-solid fa-puzzle-piece" /><p>还没有 OAuth 应用</p></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {clients.map(cl => (
              <div key={cl.client_id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{cl.name}</span>
                      {!cl.active && <span className="badge badge-danger">已禁用</span>}
                    </div>
                    {cl.description && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{cl.description}</p>}
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <span>Client ID: <code>{cl.client_id}</code></span>
                      <span>权限: {cl.scopes.join(', ')}</span>
                      <span>回调: {cl.redirect_uris[0]}{cl.redirect_uris.length > 1 ? ` +${cl.redirect_uris.length - 1}` : ''}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0, marginLeft: '0.75rem' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => startEdit(cl)}><i className="fa-solid fa-pen" /></button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(cl.client_id)}><i className="fa-solid fa-trash" /></button>
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
