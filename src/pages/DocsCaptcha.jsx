import DocToc from '../components/DocToc';
export default function DocsCaptcha() {
  return (
    <>
      <div className="page-header">
        <h1><i className="fa-solid fa-shield-halved" /> 验证码 API 文档</h1>
        <p>ABDL-Space Captcha API 接入指南</p>
      </div>
      <div className="page-body" style={{ maxWidth: 720 }}>
        <DocToc />

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }} id="base">基础信息</h2>
          <div className="card" style={{ fontSize: '0.85rem' }}>
            <p>Base URL: <code>https://api.abdl-space.top/api/v1/captcha</code></p>
            <p>鉴权: <code>Authorization: Bearer cv_your_key</code></p>
            <p>Content-Type: <code>application/json</code></p>
          </div>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 id="post-create" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            <span style={{ background: 'var(--primary)', color: '#fff', padding: '0.15rem 0.5rem', borderRadius: 4, fontSize: '0.7rem', fontWeight: 700, marginRight: '0.5rem' }}>POST</span>
            /create
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>创建一个新的验证码会话</p>
          <pre>{`// Request Body
{ "type": "quantum" }  // 可选，默认 "quantum"

// Response
{
  "session_id": "a1b2c3...",
  "type": "quantum",
  "challenge": {
    "nodes": [...],
    "order": ["β","α","γ","δ","ε"],
    "width": 500, "height": 260
  },
  "ttl": 300
}`}</pre>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 id="post-check" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            <span style={{ background: 'var(--primary)', color: '#fff', padding: '0.15rem 0.5rem', borderRadius: 4, fontSize: '0.7rem', fontWeight: 700, marginRight: '0.5rem' }}>POST</span>
            /check
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>提交用户操作结果，校验是否正确</p>
          <pre>{`// Request Body
{
  "session_id": "a1b2c3...",
  "answer": "β,α,γ,δ,ε"
}

// Response
{
  "verified": true,
  "token": "eyJhbG...",
  "attempts_left": 4,
  "locked": false,
  "lock_seconds": 0
}`}</pre>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 id="get-types" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            <span style={{ background: 'var(--success)', color: '#fff', padding: '0.15rem 0.5rem', borderRadius: 4, fontSize: '0.7rem', fontWeight: 700, marginRight: '0.5rem' }}>GET</span>
            /types
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>获取支持的验证类型列表</p>
          <pre>{`// Response
{ "types": ["quantum"] }`}</pre>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }} id="example">调用示例</h2>
          <pre>{`// 1. 创建验证会话
const res = await fetch(
  'https://api.abdl-space.top/api/v1/captcha/create',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer cv_your_key',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type: 'quantum' }),
  }
);
const { session_id, challenge } = await res.json();

// 2. 渲染验证 UI（使用 challenge 数据）
// challenge.order = 正确节点顺序
// challenge.nodes = 节点位置

// 3. 用户完成后，提交答案
const result = await fetch(
  'https://api.abdl-space.top/api/v1/captcha/check',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer cv_your_key',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      session_id,
      answer: userSequence.join(','),
    }),
  }
);
const { verified, token } = await result.json();`}</pre>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }} id="quantum">Quantum 验证说明</h2>
          <div className="card" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <p>Quantum 验证要求用户按高亮提示顺序点击 5 个节点（α, β, γ, δ, ε）。</p>
            <p style={{ marginTop: '0.5rem' }}>• <code>challenge.order</code> 包含正确节点顺序</p>
            <p>• 用户操作结果以逗号分隔提交（如 <code>"β,α,γ,δ,ε"</code>）</p>
            <p>• 每个 session 最多 5 次尝试，超过后锁定 5 分钟</p>
            <p>• Session 有效期 5 分钟</p>
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }} id="errors">错误码</h2>
          <table className="doc-table">
            <thead><tr><th>状态码</th><th>说明</th></tr></thead>
            <tbody>
              <tr><td><code>401</code></td><td>缺少或无效的 API Key</td></tr>
              <tr><td><code>403</code></td><td>Key 权限不足</td></tr>
              <tr><td><code>400</code></td><td>参数错误</td></tr>
              <tr><td><code>429</code></td><td>请求频率超限（限速）或验证次数超限（<code>locked=true</code>，需等待 <code>lock_seconds</code> 秒）</td></tr>
              <tr><td><code>500</code></td><td>服务器内部错误</td></tr>
            </tbody>
          </table>
        </section>
      </div>
    </>
  );
}
