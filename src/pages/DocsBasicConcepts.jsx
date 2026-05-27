export default function DocsBasicConcepts() {
  return (
    <>
      <div className="page-header">
        <h1><i className="fa-solid fa-lightbulb" /> 基础概念</h1>
        <p>ABDL-Space 开放平台接入前的核心概念与开发流程总览</p>
      </div>
      <div className="page-body" style={{ maxWidth: 720 }}>

        {/* 概述 */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>概述</h2>
          <div className="card" style={{ fontSize: '0.85rem' }}>
            <p>本文档介绍通过 ABDL-Space 开放平台接入服务的完整流程。在正式开发前，建议先了解以下核心概念和操作流程。</p>
            <p style={{ marginTop: '0.5rem' }}>ABDL-Space 开放平台提供三类 API 服务：</p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', lineHeight: 2 }}>
              <li><strong>验证码 API</strong> — 人机验证服务，保护你的应用免受机器人攻击</li>
              <li><strong>内容 API</strong> — 只读数据接口，获取帖子、排行榜、纸尿裤等公开数据</li>
              <li><strong>OAuth 2.0</strong> — 第三方登录授权，让用户使用 ABDL-Space 账号登录你的应用</li>
            </ul>
          </div>
        </section>

        {/* 基本概念 */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>基本概念</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            开发过程中涉及的核心概念如下：
          </p>

          <table className="doc-table">
            <thead>
              <tr><th style={{ width: '22%' }}>概念</th><th>说明</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><code>API Key</code></td>
                <td>
                  调用 API 的凭证密钥。ABDL-Space 提供两种类型的 API Key：
                  <br />• <strong>验证码 API Key</strong>（<code>cv_</code> 前缀）— 用于调用验证码服务
                  <br />• <strong>内容 API Key</strong>（<code>ak_</code> 前缀）— 用于调用内容数据接口
                  <br />每个 Key 有独立的权限范围和速率限制，在本平台的管理页面创建和管理。
                </td>
              </tr>
              <tr>
                <td><code>OAuth 2.0</code></td>
                <td>
                  开放授权标准。ABDL-Space 支持 <strong>Authorization Code Grant</strong> 流程，并推荐使用 <strong>PKCE</strong> 增强安全性。
                  适用于 Web 应用、移动应用、SPA 等场景的第三方登录接入。
                </td>
              </tr>
              <tr>
                <td><code>access_token</code></td>
                <td>
                  OAuth 授权后的访问凭证，代表用户授予你的应用的权限。调用需要用户身份的 API 时，需在请求头中携带此 Token。
                  <br />格式：<code>Authorization: Bearer {'<access_token>'}</code>
                </td>
              </tr>
              <tr>
                <td><code>refresh_token</code></td>
                <td>
                  用于在 <code>access_token</code> 过期后获取新的访问凭证，无需用户重新授权。
                  <code>refresh_token</code> 的有效期长于 <code>access_token</code>，应安全存储。
                </td>
              </tr>
              <tr>
                <td><code>client_id</code> / <code>client_secret</code></td>
                <td>
                  OAuth 应用的身份标识。<code>client_id</code> 是公开的应用 ID，<code>client_secret</code> 是仅保存在服务端的密钥。
                  <br />在「<a href="/oauth-clients" style={{ color: 'var(--primary)' }}>OAuth 应用</a>」页面创建后获得。
                </td>
              </tr>
              <tr>
                <td><code>scope</code></td>
                <td>
                  权限范围，控制你的应用可以访问哪些用户数据或 API 功能。
                  <br />例如：<code>profile</code>（用户基本信息）、<code>email</code>（邮箱）、<code>read</code>（读取数据）。
                  <br />授权时用户会看到你的应用请求了哪些权限，并可以选择同意或拒绝。
                </td>
              </tr>
              <tr>
                <td><code>redirect_uri</code></td>
                <td>
                  OAuth 授权完成后的回调地址。用户在 ABDL-Space 授权页面确认后，会被重定向到此地址，并携带授权码 <code>code</code>。
                  <br />必须与 OAuth 应用配置中填写的回调地址完全一致，否则授权会被拒绝。
                </td>
              </tr>
              <tr>
                <td><code>PKCE</code></td>
                <td>
                  Proof Key for Code Exchange，OAuth 2.0 的安全增强机制。
                  <br />通过 <code>code_verifier</code> / <code>code_challenge</code> 配对，防止授权码被拦截后直接使用。
                  <br />公开客户端（SPA、移动应用）强烈推荐启用。
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* API 基础信息 */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>API 基础信息</h2>
          <div className="card" style={{ fontSize: '0.85rem' }}>
            <table className="doc-table" style={{ marginBottom: 0 }}>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600, width: '25%' }}>Base URL</td>
                  <td><code>https://api.abdl-space.top/api</code></td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>协议</td>
                  <td>仅支持 HTTPS</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Content-Type</td>
                  <td><code>application/json</code></td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>字符编码</td>
                  <td>UTF-8</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 角色说明 */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>角色说明</h2>

          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem', marginTop: '1rem' }}>
            <i className="fa-solid fa-code" style={{ color: 'var(--primary)', marginRight: '0.5rem' }} />
            开发者（接入方）
          </h3>
          <div className="card" style={{ fontSize: '0.85rem' }}>
            <p>即 API 的使用者。开发过程中涉及以下部分：</p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', lineHeight: 2 }}>
              <li><strong>前端</strong> — 与用户交互的界面部分，负责引导用户授权、展示验证码、显示数据等</li>
              <li><strong>后端</strong> — 处理业务逻辑的服务端，负责存储数据、换取 Token、调用 API 等</li>
              <li><strong>开放平台</strong> — 在本平台管理你的 API Key、OAuth 应用，查阅文档</li>
            </ul>
          </div>

          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem', marginTop: '1rem' }}>
            <i className="fa-solid fa-server" style={{ color: 'var(--success)', marginRight: '0.5rem' }} />
            ABDL-Space 平台
          </h3>
          <div className="card" style={{ fontSize: '0.85rem' }}>
            <ul style={{ paddingLeft: '1.5rem', lineHeight: 2 }}>
              <li><strong>API 服务</strong> — 提供验证码、内容数据、OAuth 授权等后端服务</li>
              <li><strong>认证中心</strong> — 负责验证开发者身份和 API Key 的合法性，确保调用者拥有执行操作所需的权限</li>
              <li><strong>用户系统</strong> — ABDL-Space 的用户账号体系，OAuth 授权时用户在此确认权限</li>
            </ul>
          </div>
        </section>

        {/* 开发流程 */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>开发流程</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            接入 ABDL-Space 开放平台的标准流程如下：
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Step 1 */}
            <div className="card" style={{ borderLeft: '3px solid var(--primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span style={{ background: 'var(--primary)', color: '#fff', borderRadius: '50%', width: '1.5rem', height: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>1</span>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>创建 API Key 或 OAuth 应用</h4>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', paddingLeft: '2.25rem' }}>
                根据你的需求，在开放平台创建相应的凭证：
              </p>
              <ul style={{ fontSize: '0.8rem', paddingLeft: '3.75rem', lineHeight: 2, color: 'var(--text-muted)' }}>
                <li>需要人机验证 → 在「<a href="/captcha-keys" style={{ color: 'var(--primary)' }}>验证码 API Key</a>」创建 <code>cv_</code> Key</li>
                <li>需要内容数据 → 在「<a href="/content-keys" style={{ color: 'var(--primary)' }}>内容 API Key</a>」创建 <code>ak_</code> Key</li>
                <li>需要第三方登录 → 在「<a href="/oauth-clients" style={{ color: 'var(--primary)' }}>OAuth 应用</a>」注册应用，获取 <code>client_id</code> 和 <code>client_secret</code></li>
              </ul>
            </div>

            {/* Step 2 */}
            <div className="card" style={{ borderLeft: '3px solid var(--success)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span style={{ background: 'var(--success)', color: '#fff', borderRadius: '50%', width: '1.5rem', height: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>2</span>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>集成 SDK / 调用 API</h4>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', paddingLeft: '2.25rem' }}>
                根据业务场景进行开发：
              </p>
              <ul style={{ fontSize: '0.8rem', paddingLeft: '3.75rem', lineHeight: 2, color: 'var(--text-muted)' }}>
                <li><strong>验证码</strong> — 参考「<a href="/docs/captcha" style={{ color: 'var(--primary)' }}>验证码 API 文档</a>」，在前端渲染验证组件，后端校验结果</li>
                <li><strong>内容数据</strong> — 参考「<a href="/docs/content" style={{ color: 'var(--primary)' }}>内容 API 文档</a>」，使用 API Key 请求帖子、排行榜等数据</li>
                <li><strong>OAuth 登录</strong> — 参考「<a href="/docs/oauth" style={{ color: 'var(--primary)' }}>OAuth 2.0 文档</a>」，实现授权码流程，获取用户身份</li>
              </ul>
            </div>

            {/* Step 3 */}
            <div className="card" style={{ borderLeft: '3px solid var(--warning)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span style={{ background: 'var(--warning)', color: '#1a1a2e', borderRadius: '50%', width: '1.5rem', height: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>3</span>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>测试与上线</h4>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', paddingLeft: '2.25rem' }}>
                在开发环境完成集成测试后，将应用部署到生产环境。确保：
              </p>
              <ul style={{ fontSize: '0.8rem', paddingLeft: '3.75rem', lineHeight: 2, color: 'var(--text-muted)' }}>
                <li>API Key 和 OAuth 凭证已妥善保管，未暴露在前端代码中</li>
                <li>OAuth 的 <code>redirect_uri</code> 已配置为生产环境地址</li>
                <li>已处理 Token 过期、刷新、错误码等异常情况</li>
                <li>已遵守速率限制，避免触发限流</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 快速导航 */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>快速导航</h2>
          <table className="doc-table">
            <thead>
              <tr><th>如果你需要…</th><th>查看</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>接入人机验证保护表单/登录</td>
                <td><a href="/docs/captcha" style={{ color: 'var(--primary)' }}>验证码 API 文档</a></td>
              </tr>
              <tr>
                <td>获取帖子、排行榜、纸尿裤数据</td>
                <td><a href="/docs/content" style={{ color: 'var(--primary)' }}>内容 API 文档</a></td>
              </tr>
              <tr>
                <td>实现"使用 ABDL-Space 登录"</td>
                <td><a href="/docs/oauth" style={{ color: 'var(--primary)' }}>OAuth 2.0 文档</a></td>
              </tr>
              <tr>
                <td>管理验证码 API Key</td>
                <td><a href="/captcha-keys" style={{ color: 'var(--primary)' }}>验证码 Key 管理</a></td>
              </tr>
              <tr>
                <td>管理内容 API Key</td>
                <td><a href="/content-keys" style={{ color: 'var(--primary)' }}>内容 API Key 管理</a></td>
              </tr>
              <tr>
                <td>注册和管理 OAuth 应用</td>
                <td><a href="/oauth-clients" style={{ color: 'var(--primary)' }}>OAuth 应用管理</a></td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* 安全建议 */}
        <section>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>安全建议</h2>
          <div className="card" style={{ fontSize: '0.85rem' }}>
            <ul style={{ paddingLeft: '1.5rem', lineHeight: 2.2 }}>
              <li><strong>密钥安全</strong> — <code>client_secret</code> 和 API Key 仅保存在服务端，不要暴露在前端代码、Git 仓库或日志中</li>
              <li><strong>使用 HTTPS</strong> — 所有 API 请求必须通过 HTTPS 传输，防止凭证被中间人截获</li>
              <li><strong>最小权限</strong> — 只申请你的应用实际需要的 Scope 和 API 权限</li>
              <li><strong>Token 存储</strong> — <code>access_token</code> 应安全存储（如 HttpOnly Cookie 或服务端 Session），避免 localStorage</li>
              <li><strong>PKCE</strong> — SPA 和移动应用务必启用 PKCE，防止授权码拦截</li>
              <li><strong>轮换密钥</strong> — 定期轮换 API Key 和 OAuth 凭证，发现泄露立即吊销</li>
            </ul>
          </div>
        </section>

      </div>
    </>
  );
}
