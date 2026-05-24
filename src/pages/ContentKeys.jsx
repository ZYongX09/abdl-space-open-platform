import { useState, useEffect, useCallback } from 'react';
import { contentKeysAPI } from '../lib/api';

const ALL_PERMS = [
  { key: 'read_posts', label: '读取帖子', desc: '帖子列表、详情、评论' },
  { key: 'read_rankings', label: '读取排行榜', desc: '纸尿裤排行榜数据' },
  { key: 'read_diapers', label: '读取纸尿裤', desc: '纸尿裤列表与详情' },
];

export default function ContentKeys() {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newKey, setNewKey] = useState(null);
  const [form, setForm] = useState({ label: '', permissions: ALL_PERMS.map(p => p.key), rate_limit: 200 });
  const [msg, setMsg] = useState(null);

  const loadKeys = useCallback(async () => {
    try { setLoading(true); const res = await contentKeysAPI.list(); setKeys(res.keys || []); }
    catch (err) { setMsg({ type: 'error', text: err.message }); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadKeys(); }, [loadKeys]);

  const handleCreate = async () => {
    try {
      const data = await contentKeysAPI.create(form);
      setNewKey(data);
      setShowCreate(false);
      setForm({ label: '', permissions: ALL_PERMS.map(p => p.key), rate_limit: 200 });
      loadKeys();
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    }
  };

  const handleToggle = async (id, active) => {
    try {
      await contentKeysAPI.update(id, { active: !active });
      loadKeys();
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('确定删除此 API Key？删除后无法恢复。')) return;
    try {
      await contentKeysAPI.delete(id);
      setMsg({ type: 'success', text: '已删除' });
      loadKeys();
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    }
  };

  const copyKey = (key) => {
    navigator.clipboard.writeText(key);
    setMsg({ type: 'success', text: '已复制到剪贴板' });
  };

  return (
    <>
      <div className="page-header">
        <h1><i className="fa-solid fa-code" /> 内容 API Key</h1>
        <p>管理内容 API Key，接入帖子和排行榜数据</p>
      </div>
      <div className="page-body">
        {/* 提示信息 */}
        {msg && (
          <div className="card" style={{
            marginBottom: '1rem',
            border: `1px solid ${msg.type === 'error' ? '#e63946' : '#06d6a0'}`,
            background: msg.type === 'error' ? 'rgba(230,57,70,0.08)' : 'rgba(6,214,160,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: '0.85rem' }}>{msg.text}</span>
            <button onClick={() => setMsg(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
        )}
        {/* 创建后显示完整 key */}
        {newKey && (
          <div className="card" style={{ marginBottom: '1.5rem', border: '2px solid var(--success, #06d6a0)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <i className="fa-solid fa-circle-check" style={{ color: '#06d6a0' }} />
              <span style={{ fontWeight: 700 }}>API Key 已创建</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              请立即复制保存，此 Key <strong>仅显示一次</strong>，关闭后无法再次查看。
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <code style={{
                flex: 1, padding: '0.5rem 0.75rem', borderRadius: 8,
                background: 'var(--input-bg)', fontSize: '0.8rem', wordBreak: 'break-all',
                border: '1px solid var(--border)',
              }}>
                {newKey.key}
              </code>
              <button className="btn btn-primary" style={{ flexShrink: 0 }} onClick={() => copyKey(newKey.key)}>
                <i className="fa-solid fa-copy" /> 复制
              </button>
            </div>
            <button
              style={{ marginTop: '0.75rem', background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem' }}
              onClick={() => setNewKey(null)}
            >
              我已保存，关闭提示
            </button>
          </div>
        )}

        {/* 创建按钮 */}
        <div style={{ marginBottom: '1rem' }}>
          <button className="btn btn-primary" onClick={() => setShowCreate(!showCreate)}>
            <i className="fa-solid fa-plus" /> 创建 API Key
          </button>
        </div>

        {/* 创建表单 */}
        {showCreate && (
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>创建新 Key</h3>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>名称（可选）</label>
              <input
                className="form-control"
                placeholder="如：我的应用"
                value={form.label}
                onChange={e => setForm({ ...form, label: e.target.value })}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>权限</label>
              {ALL_PERMS.map(perm => (
                <label key={perm.key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.permissions.includes(perm.key)}
                    onChange={e => {
                      setForm({
                        ...form,
                        permissions: e.target.checked
                          ? [...form.permissions, perm.key]
                          : form.permissions.filter(p => p !== perm.key),
                      });
                    }}
                  />
                  <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{perm.label}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>— {perm.desc}</span>
                </label>
              ))}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>速率限制（次/分钟）</label>
              <input
                className="form-control"
                type="number"
                min={1}
                max={10000}
                value={form.rate_limit}
                onChange={e => setForm({ ...form, rate_limit: parseInt(e.target.value) || 200 })}
                style={{ width: 160 }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-primary" onClick={handleCreate}>
                <i className="fa-solid fa-check" /> 确认创建
              </button>
              <button className="btn" onClick={() => setShowCreate(false)} style={{ background: 'var(--input-bg)' }}>
                取消
              </button>
            </div>
          </div>
        )}

        {/* Key 列表 */}
        {loading ? (
          <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            <i className="fa-solid fa-spinner fa-spin" /> 加载中...
          </div>
        ) : keys.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            <i className="fa-solid fa-key" style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'block' }} />
            还没有 API Key，点击上方按钮创建一个
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {keys.map(k => (
              <div key={k.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 700 }}>{k.label || '未命名 Key'}</span>
                    <span style={{
                      fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: 4,
                      background: k.active ? 'rgba(6,214,160,0.15)' : 'rgba(255,0,0,0.1)',
                      color: k.active ? '#06d6a0' : '#e63946',
                    }}>
                      {k.active ? '启用' : '禁用'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <code style={{ background: 'var(--input-bg)', padding: '0.1rem 0.3rem', borderRadius: 4 }}>{k.key_prefix}...</code>
                    <span style={{ marginLeft: '0.75rem' }}>
                      权限: {k.permissions.join(', ')}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    调用 {k.use_count} 次 · 限速 {k.rate_limit}/min
                    {k.last_used && ` · 最后使用 ${new Date(k.last_used * 1000).toLocaleString('zh-CN')}`}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn"
                    style={{ background: 'var(--input-bg)', fontSize: '0.8rem' }}
                    onClick={() => handleToggle(k.id, k.active)}
                    title={k.active ? '禁用' : '启用'}
                  >
                    <i className={`fa-solid fa-${k.active ? 'pause' : 'play'}`} />
                  </button>
                  <button
                    className="btn"
                    style={{ background: 'rgba(255,0,0,0.08)', color: '#e63946', fontSize: '0.8rem' }}
                    onClick={() => handleDelete(k.id)}
                    title="删除"
                  >
                    <i className="fa-solid fa-trash" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
