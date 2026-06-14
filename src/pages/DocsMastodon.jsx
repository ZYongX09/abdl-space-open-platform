import DocToc from '../components/DocToc';
export default function DocsMastodon() {
  return (
    <>
      <div className="page-header">
        <h1><i className="fa-brands fa-mastodon" /> Mastodon 兼容 API</h1>
        <p>使用 Mastodon 客户端（如 Moshidon）连接 ABDL Space</p>
      </div>
      <div className="page-body" style={{ maxWidth: 720 }}>
        <DocToc />

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }} id="overview">概述</h2>
          <div className="card" style={{ fontSize: '0.85rem' }}>
            <p>ABDL Space 提供 <strong>Mastodon 兼容 API</strong>，支持使用 Mastodon 客户端（如 Android 上的 <a href="https://github.com/LucasGGamerM/moshidon" target="_blank" rel="noopener">Moshidon</a>）连接到 ABDL Space。</p>
            <p style={{ marginTop: '0.5rem' }}>兼容层是纯转换层，读写同一个数据库，不影响现有 ABDL API。所有 <code>/api/v1/*</code> 端点遵循 <a href="https://docs.joinmastodon.org/" target="_blank" rel="noopener">Mastodon API 规范</a>。</p>
          </div>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }} id="quickstart">快速开始</h2>
          <div className="card" style={{ fontSize: '0.85rem' }}>
            <p><strong>1. 下载 Moshidon</strong></p>
            <p style={{ color: 'var(--text-muted)' }}>从 <a href="https://github.com/LucasGGamerM/moshidon/releases" target="_blank" rel="noopener">GitHub Releases</a> 下载最新版 APK。</p>
            <p style={{ marginTop: '0.75rem' }}><strong>2. 添加账号</strong></p>
            <p style={{ color: 'var(--text-muted)' }}>打开 Moshidon → 设置 → 添加账号 → 实例地址填 <code>api.abdl-space.top</code></p>
            <p style={{ marginTop: '0.75rem' }}><strong>3. 登录</strong></p>
            <p style={{ color: 'var(--text-muted)' }}>使用你的 ABDL Space 账号密码登录。Moshidon 会通过 OAuth 获取 access_token。</p>
            <p style={{ marginTop: '0.75rem' }}><strong>4. 开始使用</strong></p>
            <p style={{ color: 'var(--text-muted)' }}>浏览时间线、发帖、点赞、评论、关注用户等社交功能均可在 Moshidon 中操作。</p>
          </div>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }} id="architecture">架构</h2>
          <pre>{`Moshidon (Mastodon Client)
        │
        ▼
/api/v1/*     → Mastodon 兼容层（纯转换）
/api/v2/*     → Mastodon v2 端点
/api/*        → 现有 ABDL 自定义 API

共享同一个 D1 数据库`}</pre>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }} id="auth">认证方式</h2>
          <div className="card" style={{ fontSize: '0.85rem' }}>
            <p>支持两种 Bearer Token：</p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', lineHeight: 2 }}>
              <li><strong>OAuth access_token</strong> — 通过 <code>/api/v1/apps</code> 注册 + OAuth 流程获取（Moshidon 自动完成）</li>
              <li><strong>JWT</strong> — 现有 ABDL Space 的 token</li>
            </ul>
            <p style={{ marginTop: '0.75rem' }}>Mastodon scope 映射：</p>
            <table className="doc-table" style={{ marginTop: '0.5rem' }}>
              <thead><tr><th>Mastodon Scope</th><th>映射到</th></tr></thead>
              <tbody>
                <tr><td><code>read</code></td><td><code>read</code></td></tr>
                <tr><td><code>write</code></td><td><code>write</code></td></tr>
                <tr><td><code>follow</code></td><td><code>write</code></td></tr>
                <tr><td><code>push</code></td><td>丢弃</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }} id="status-id">Status ID 格式</h2>
          <div className="card" style={{ fontSize: '0.85rem' }}>
            <p>帖子和评论使用前缀格式的字符串 ID：</p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', lineHeight: 2 }}>
              <li>帖子：<code>p_&lt;id&gt;</code>（如 <code>p_42</code>）</li>
              <li>评论：<code>c_&lt;id&gt;</code>（如 <code>c_100</code>）</li>
            </ul>
            <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>Mastodon 客户端将 status ID 视为不透明字符串，前缀格式完全兼容。</p>
          </div>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }} id="endpoints">已实现端点</h2>

          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '1rem', marginBottom: '0.5rem' }}>Instance & Apps</h3>
          <table className="doc-table">
            <thead><tr><th>端点</th><th>说明</th></tr></thead>
            <tbody>
              <tr><td><code>GET /api/v1/instance</code></td><td>实例信息</td></tr>
              <tr><td><code>GET /api/v2/instance</code></td><td>实例信息（v2）</td></tr>
              <tr><td><code>POST /api/v1/apps</code></td><td>注册 OAuth 应用</td></tr>
              <tr><td><code>GET /api/v1/apps/verify_credentials</code></td><td>验证应用</td></tr>
            </tbody>
          </table>

          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '1rem', marginBottom: '0.5rem' }}>Accounts</h3>
          <table className="doc-table">
            <thead><tr><th>端点</th><th>说明</th></tr></thead>
            <tbody>
              <tr><td><code>GET /api/v1/accounts/verify_credentials</code></td><td>当前用户</td></tr>
              <tr><td><code>PATCH /api/v1/accounts/update_credentials</code></td><td>编辑资料</td></tr>
              <tr><td><code>GET /api/v1/accounts/:id</code></td><td>用户信息</td></tr>
              <tr><td><code>GET /api/v1/accounts/:id/statuses</code></td><td>用户帖子</td></tr>
              <tr><td><code>GET /api/v1/accounts/:id/followers</code></td><td>粉丝</td></tr>
              <tr><td><code>GET /api/v1/accounts/:id/following</code></td><td>关注</td></tr>
              <tr><td><code>POST /api/v1/accounts/:id/follow</code></td><td>关注</td></tr>
              <tr><td><code>POST /api/v1/accounts/:id/unfollow</code></td><td>取关</td></tr>
              <tr><td><code>GET /api/v1/accounts/relationships</code></td><td>关系状态</td></tr>
            </tbody>
          </table>

          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '1rem', marginBottom: '0.5rem' }}>Statuses</h3>
          <table className="doc-table">
            <thead><tr><th>端点</th><th>说明</th></tr></thead>
            <tbody>
              <tr><td><code>POST /api/v1/statuses</code></td><td>发帖</td></tr>
              <tr><td><code>GET /api/v1/statuses/:id</code></td><td>帖子/评论详情</td></tr>
              <tr><td><code>DELETE /api/v1/statuses/:id</code></td><td>删除</td></tr>
              <tr><td><code>POST /api/v1/statuses/:id/favourite</code></td><td>点赞</td></tr>
              <tr><td><code>POST /api/v1/statuses/:id/unfavourite</code></td><td>取消赞</td></tr>
              <tr><td><code>POST /api/v1/statuses/:id/reblog</code></td><td>转发（no-op）</td></tr>
              <tr><td><code>GET /api/v1/statuses/:id/context</code></td><td>评论上下文</td></tr>
              <tr><td><code>GET /api/v1/statuses/:id/favourited_by</code></td><td>点赞用户列表</td></tr>
            </tbody>
          </table>

          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '1rem', marginBottom: '0.5rem' }}>Timelines</h3>
          <table className="doc-table">
            <thead><tr><th>端点</th><th>说明</th></tr></thead>
            <tbody>
              <tr><td><code>GET /api/v1/timelines/home</code></td><td>关注时间线</td></tr>
              <tr><td><code>GET /api/v1/timelines/public</code></td><td>公共时间线</td></tr>
              <tr><td><code>GET /api/v1/timelines/tag/:hashtag</code></td><td>标签时间线</td></tr>
            </tbody>
          </table>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>所有时间线支持 <code>max_id</code>/<code>since_id</code>/<code>limit</code> 分页，返回 <code>Link</code> header。</p>

          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '1rem', marginBottom: '0.5rem' }}>Notifications</h3>
          <table className="doc-table">
            <thead><tr><th>端点</th><th>说明</th></tr></thead>
            <tbody>
              <tr><td><code>GET /api/v1/notifications</code></td><td>通知列表</td></tr>
              <tr><td><code>GET /api/v1/notifications/:id</code></td><td>单条通知</td></tr>
              <tr><td><code>POST /api/v1/notifications/clear</code></td><td>全部已读</td></tr>
              <tr><td><code>GET /api/v1/notifications/unread_count</code></td><td>未读数</td></tr>
            </tbody>
          </table>

          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '1rem', marginBottom: '0.5rem' }}>Media & Search</h3>
          <table className="doc-table">
            <thead><tr><th>端点</th><th>说明</th></tr></thead>
            <tbody>
              <tr><td><code>POST /api/v1/media</code></td><td>上传图片</td></tr>
              <tr><td><code>GET /api/v1/search</code></td><td>搜索（v1）</td></tr>
              <tr><td><code>GET /api/v2/search</code></td><td>搜索（v2）</td></tr>
            </tbody>
          </table>

          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '1rem', marginBottom: '0.5rem' }}>Push 推送</h3>
          <table className="doc-table">
            <thead><tr><th>端点</th><th>说明</th></tr></thead>
            <tbody>
              <tr><td><code>POST /api/v1/push/subscription</code></td><td>创建推送订阅</td></tr>
              <tr><td><code>GET /api/v1/push/subscription</code></td><td>查询当前订阅</td></tr>
              <tr><td><code>PUT /api/v1/push/subscription</code></td><td>更新 alert 设置</td></tr>
              <tr><td><code>DELETE /api/v1/push/subscription</code></td><td>删除订阅</td></tr>
            </tbody>
          </table>
          <div className="card" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
            <p>支持的 alert 类型：<code>follow</code>、<code>favourite</code>、<code>reblog</code>、<code>mention</code>、<code>poll</code>、<code>status</code></p>
            <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>实际推送需要在 Wrangler 配置 <code>VAPID_PUBLIC_KEY</code> 和 <code>VAPID_PRIVATE_KEY</code> 环境变量。<code>push_subscriptions</code> 表自动创建。</p>
          </div>

          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '1rem', marginBottom: '0.5rem' }}>ABDL 自定义端点 <code>/api/v1/abdl/*</code></h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>以 Mastodon API 风格暴露 ABDL 专属功能。原有 ABDL API 不受影响。</p>

          <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: '0.75rem', marginBottom: '0.25rem' }}>纸尿裤</h4>
          <table className="doc-table">
            <thead><tr><th>端点</th><th>说明</th></tr></thead>
            <tbody>
              <tr><td><code>GET /api/v1/abdl/diapers</code></td><td>纸尿裤列表（search/brand/sort/order/page/limit）</td></tr>
              <tr><td><code>GET /api/v1/abdl/diapers/:id</code></td><td>纸尿裤详情（含尺寸、图片）</td></tr>
              <tr><td><code>GET /api/v1/abdl/diapers/:id/ratings</code></td><td>评分列表 + 分维度统计</td></tr>
              <tr><td><code>GET /api/v1/abdl/diapers/:id/feelings</code></td><td>感受列表 + 统计</td></tr>
              <tr><td><code>GET /api/v1/abdl/diapers/brands</code></td><td>品牌列表</td></tr>
              <tr><td><code>GET /api/v1/abdl/diapers/sizes</code></td><td>尺码标签列表</td></tr>
              <tr><td><code>GET /api/v1/abdl/diapers/compare</code></td><td>纸尿裤对比（ids=1,2,3，最多 5 款）</td></tr>
            </tbody>
          </table>

          <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: '0.75rem', marginBottom: '0.25rem' }}>排行榜与术语</h4>
          <table className="doc-table">
            <thead><tr><th>端点</th><th>说明</th></tr></thead>
            <tbody>
              <tr><td><code>GET /api/v1/abdl/rankings</code></td><td>排行榜（type=hot/popular/absorbency）</td></tr>
              <tr><td><code>GET /api/v1/abdl/terms</code></td><td>术语百科（search/category）</td></tr>
              <tr><td><code>GET /api/v1/abdl/terms/categories</code></td><td>术语分类列表</td></tr>
            </tbody>
          </table>

          <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: '0.75rem', marginBottom: '0.25rem' }}>用户档案</h4>
          <table className="doc-table">
            <thead><tr><th>端点</th><th>说明</th></tr></thead>
            <tbody>
              <tr><td><code>GET /api/v1/abdl/me</code></td><td>当前用户 ABDL 档案（经验、积分、徽章）</td></tr>
              <tr><td><code>GET /api/v1/abdl/users/:id</code></td><td>用户公开 ABDL 档案</td></tr>
              <tr><td><code>GET /api/v1/abdl/users/:id/worn</code></td><td>穿过的纸尿裤</td></tr>
            </tbody>
          </table>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }} id="limits">已知限制</h2>
          <div className="card" style={{ fontSize: '0.85rem' }}>
            <ul style={{ paddingLeft: '1.5rem', lineHeight: 2 }}>
              <li><strong>无 Streaming API</strong> — Moshidon 自动回退轮询，不影响使用</li>
              <li><strong>无联邦化</strong> — 纯本地实例，不支持跨站通信</li>
              <li><strong>转发为 no-op</strong> — 可点击但无实际效果</li>
              <li><strong>私信</strong> — Moshidon 私信功能不可用（ABDL 私信 ≠ Mastodon conversations）</li>
              <li><strong>WebPush</strong> — 订阅可创建，实际推送需配置 VAPID 密钥</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }} id="api-source">API 源码</h2>
          <div className="card" style={{ fontSize: '0.85rem' }}>
            <p>Mastodon 兼容层源码位于后端仓库的 <code>src/mastodon/</code> 目录：</p>
            <pre style={{ marginTop: '0.5rem' }}>{`src/mastodon/
├── shared.ts      # 共享逻辑（auth、instance、resolveStatus、toMastoId）
├── types.ts       # Mastodon 实体类型定义
├── converter.ts   # ABDL → Mastodon 数据模型转换
├── routes.ts      # /api/v1/* 标准 Mastodon 端点
├── v2.ts          # /api/v2/* 端点（instance、search）
├── push.ts        # /api/v1/push/* WebPush 订阅
└── abdl.ts        # /api/v1/abdl/* ABDL 自定义端点`}</pre>
          </div>
        </section>
      </div>
    </>
  );
}
