import DocToc from '../components/DocToc';
export default function DocsOAuth() {
  return (
    <>
      <div className="page-header">
        <h1><i className="fa-solid fa-book-open" /> OAuth 2.0 文档</h1>
        <p>ABDL-Space OAuth 2.0 授权接入指南</p>
      </div>
      <div className="page-body" style={{ maxWidth: 720 }}>
        <DocToc />

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }} id="overview">概述</h2>
          <div className="card" style={{ fontSize: '0.85rem' }}>
            <p>ABDL-Space OAuth 2.0 支持 <strong>Authorization Code Grant</strong> 流程，并推荐使用 <strong>PKCE</strong> 增强安全性。</p>
            <p style={{ marginTop: '0.5rem' }}>适用于 Web 应用、移动应用、SPA 等场景的第三方登录接入。</p>
          </div>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }} id="flow">授权流程</h2>
          <ol style={{ fontSize: '0.85rem', paddingLeft: '1.5rem', lineHeight: 2 }}>
            <li>用户点击"使用 ABDL Space 登录"</li>
            <li>跳转到 <code>/oauth/authorize</code>，用户确认授权</li>
            <li>回调到你的 <code>redirect_uri</code>，携带 <code>code</code> 和 <code>state</code></li>
            <li>后端用 <code>code</code> 换取 <code>access_token</code></li>
            <li>用 <code>access_token</code> 调用 API</li>
          </ol>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }} id="step1">Step 1: 引导用户授权</h2>
          <pre>{`GET https://api.abdl-space.top/api/oauth/authorize
  ?client_id=oc_your_client_id
  &redirect_uri=https://your-app.com/callback
  &scope=profile email
  &state=random_csrf_token
  &response_type=code
  &code_challenge=E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM
  &code_challenge_method=S256`}</pre>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }} id="step2">Step 2: 用 code 换 token</h2>
          <pre>{`POST https://api.abdl-space.top/api/oauth/token
Content-Type: application/json

{
  "grant_type": "authorization_code",
  "code": "授权码",
  "redirect_uri": "https://your-app.com/callback",
  "client_id": "oc_your_client_id",
  "client_secret": "ocs_your_client_secret",
  "code_verifier": "原始随机字符串"
}

// Response:
{
  "access_token": "...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "...",
  "scope": "profile email"
}`}</pre>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }} id="step3">Step 3: 刷新 Token</h2>
          <pre>{`POST https://api.abdl-space.top/api/oauth/token
{
  "grant_type": "refresh_token",
  "refresh_token": "...",
  "client_id": "oc_your_client_id",
  "client_secret": "ocs_your_client_secret"
}`}</pre>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }} id="endpoints">API 端点</h2>
          <table className="doc-table">
            <thead><tr><th>端点</th><th>方法</th><th>说明</th></tr></thead>
            <tbody>
              <tr><td><code>/api/oauth/authorize</code></td><td>GET/POST</td><td>授权端点（前端渲染同意页）</td></tr>
              <tr><td><code>/api/oauth/token</code></td><td>POST</td><td>令牌端点（换 token / 刷新）</td></tr>
              <tr><td><code>/api/oauth/revoke</code></td><td>POST</td><td>吊销令牌</td></tr>
              <tr><td><code>/api/oauth/introspect</code></td><td>POST</td><td>令牌自省</td></tr>
              <tr><td><code>/api/oauth/userinfo</code></td><td>GET</td><td>获取用户信息（Bearer token）</td></tr>
              <tr><td><code>/api/oauth/scopes</code></td><td>GET</td><td>可用 scope 列表</td></tr>
            </tbody>
          </table>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }} id="scopes">可用 Scopes</h2>
          <table className="doc-table">
            <thead><tr><th>Scope</th><th>说明</th></tr></thead>
            <tbody>
              <tr><td><code>profile</code></td><td>用户名、头像、简介、角色</td></tr>
              <tr><td><code>email</code></td><td>邮箱地址</td></tr>
              <tr><td><code>read</code></td><td>读取用户数据</td></tr>
              <tr><td><code>write</code></td><td>写入用户数据</td></tr>
              <tr><td><code>admin</code></td><td>管理操作（需特别授权，普通应用不可申请）</td></tr>
            </tbody>
          </table>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }} id="pkce">PKCE (推荐)</h2>
          <div className="card" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <p>公开客户端（SPA、移动应用）强烈推荐使用 PKCE 增强安全性：</p>
            <p style={{ marginTop: '0.5rem' }}>1. 生成 43-128 字符随机 <code>code_verifier</code></p>
            <p>2. 计算 <code>code_challenge = BASE64URL(SHA256(code_verifier))</code></p>
            <p>3. 授权请求传 <code>code_challenge</code> + <code>code_challenge_method=S256</code></p>
            <p>4. 换 token 时传 <code>code_verifier</code></p>
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }} id="errors">错误码</h2>
          <table className="doc-table">
            <thead><tr><th>错误</th><th>说明</th></tr></thead>
            <tbody>
              <tr><td><code>invalid_client</code></td><td>客户端不存在或已禁用</td></tr>
              <tr><td><code>invalid_grant</code></td><td>授权码无效/过期/已使用</td></tr>
              <tr><td><code>invalid_redirect_uri</code></td><td>回调地址不匹配</td></tr>
              <tr><td><code>invalid_scope</code></td><td>请求的 scope 无效</td></tr>
              <tr><td><code>unsupported_grant_type</code></td><td>不支持的 grant_type</td></tr>
              <tr><td><code>access_denied</code></td><td>用户拒绝授权</td></tr>
            </tbody>
          </table>
        </section>
      </div>
    </>
  );
}
