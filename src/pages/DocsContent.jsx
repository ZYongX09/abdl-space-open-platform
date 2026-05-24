export default function DocsContent() {
  return (
    <>
      <div className="page-header">
        <h1><i className="fa-solid fa-code" /> 内容 API 文档</h1>
        <p>ABDL-Space Content API 接入指南 — 帖子、排行榜、纸尿裤数据</p>
      </div>
      <div className="page-body" style={{ maxWidth: 720 }}>

        {/* 基础信息 */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>基础信息</h2>
          <div className="card" style={{ fontSize: '0.85rem' }}>
            <p>Base URL: <code>https://api.abdl-space.top/api/v1/content</code></p>
            <p style={{ marginTop: '0.25rem' }}>鉴权: <code>Authorization: Bearer ak_your_key</code></p>
            <p style={{ marginTop: '0.25rem' }}>Content-Type: <code>application/json</code></p>
            <p style={{ marginTop: '0.25rem' }}>所有端点均为 <strong>只读</strong>（GET），仅支持数据查询</p>
          </div>
        </section>

        {/* 鉴权说明 */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>鉴权方式</h2>
          <div className="card" style={{ fontSize: '0.85rem' }}>
            <p>所有请求需要在 Header 中携带 API Key：</p>
            <pre style={{ marginTop: '0.5rem' }}>{`Authorization: Bearer ak_your_api_key`}</pre>
            <p style={{ marginTop: '0.75rem' }}>API Key 在本平台「<a href="/content-keys" style={{ color: 'var(--primary)' }}>内容 API Key</a>」页面创建，格式为 <code>ak_</code> 开头的字符串。</p>
            <p style={{ marginTop: '0.5rem' }}>每个 Key 可配置权限范围和速率限制，默认权限为全部读取权限（<code>read_posts</code>、<code>read_rankings</code>、<code>read_diapers</code>）。</p>
          </div>
        </section>

        {/* 权限说明 */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>权限说明</h2>
          <table className="doc-table">
            <thead><tr><th>权限</th><th>说明</th><th>可用端点</th></tr></thead>
            <tbody>
              <tr><td><code>read_posts</code></td><td>读取帖子数据</td><td>/posts, /posts/:id</td></tr>
              <tr><td><code>read_rankings</code></td><td>读取排行榜数据</td><td>/rankings</td></tr>
              <tr><td><code>read_diapers</code></td><td>读取纸尿裤数据</td><td>/diapers</td></tr>
            </tbody>
          </table>
        </section>

        {/* 帖子列表 */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            <span style={{ background: 'var(--success)', color: '#fff', padding: '0.15rem 0.5rem', borderRadius: 4, fontSize: '0.7rem', fontWeight: 700, marginRight: '0.5rem' }}>GET</span>
            /posts
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>获取帖子列表，支持分页和搜索</p>
          <p style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>所需权限：<code>read_posts</code></p>

          <h4 style={{ fontSize: '0.85rem', fontWeight: 600, margin: '1rem 0 0.5rem' }}>查询参数</h4>
          <table className="doc-table">
            <thead><tr><th>参数</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
            <tbody>
              <tr><td><code>page</code></td><td>int</td><td>1</td><td>页码，从 1 开始</td></tr>
              <tr><td><code>limit</code></td><td>int</td><td>20</td><td>每页数量，1-100</td></tr>
              <tr><td><code>search</code></td><td>string</td><td>—</td><td>搜索帖子内容</td></tr>
              <tr><td><code>user_id</code></td><td>int</td><td>—</td><td>按用户 ID 筛选</td></tr>
            </tbody>
          </table>

          <h4 style={{ fontSize: '0.85rem', fontWeight: 600, margin: '1rem 0 0.5rem' }}>响应示例</h4>
          <pre>{`{
  "posts": [
    {
      "id": 123,
      "user": { "id": 1, "username": "demo", "avatar": null, "role": "user" },
      "content": "今天试了 XXL 号的...",
      "diaper_id": 5,
      "pinned": false,
      "like_count": 12,
      "comment_count": 3,
      "created_at": 1716500000
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "totalPages": 8
  }
}`}</pre>
        </section>

        {/* 帖子详情 */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            <span style={{ background: 'var(--success)', color: '#fff', padding: '0.15rem 0.5rem', borderRadius: 4, fontSize: '0.7rem', fontWeight: 700, marginRight: '0.5rem' }}>GET</span>
            /posts/:id
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>获取帖子详情及评论列表</p>
          <p style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>所需权限：<code>read_posts</code></p>

          <h4 style={{ fontSize: '0.85rem', fontWeight: 600, margin: '1rem 0 0.5rem' }}>路径参数</h4>
          <table className="doc-table">
            <thead><tr><th>参数</th><th>类型</th><th>说明</th></tr></thead>
            <tbody>
              <tr><td><code>id</code></td><td>int</td><td>帖子 ID</td></tr>
            </tbody>
          </table>

          <h4 style={{ fontSize: '0.85rem', fontWeight: 600, margin: '1rem 0 0.5rem' }}>响应示例</h4>
          <pre>{`{
  "post": {
    "id": 123,
    "user": { "id": 1, "username": "demo", "avatar": null, "role": "user" },
    "content": "今天试了 XXL 号的...",
    "diaper_id": 5,
    "pinned": false,
    "like_count": 12,
    "comment_count": 2,
    "created_at": 1716500000
  },
  "comments": [
    {
      "id": 456,
      "post_id": 123,
      "user": { "id": 2, "username": "reply_user", "avatar": null, "role": "user" },
      "parent_id": null,
      "content": "我也觉得这个不错！",
      "like_count": 3,
      "created_at": 1716501000
    }
  ]
}`}</pre>
        </section>

        {/* 排行榜 */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            <span style={{ background: 'var(--success)', color: '#fff', padding: '0.15rem 0.5rem', borderRadius: 4, fontSize: '0.7rem', fontWeight: 700, marginRight: '0.5rem' }}>GET</span>
            /rankings
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>获取纸尿裤排行榜，支持多种排序维度</p>
          <p style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>所需权限：<code>read_rankings</code></p>

          <h4 style={{ fontSize: '0.85rem', fontWeight: 600, margin: '1rem 0 0.5rem' }}>查询参数</h4>
          <table className="doc-table">
            <thead><tr><th>参数</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
            <tbody>
              <tr><td><code>type</code></td><td>string</td><td>hot</td><td>排行类型：<code>hot</code>（综合热门）、<code>absorbency</code>（吸水量）、<code>popular</code>（评分人数）、<code>dimension</code>（指定维度）</td></tr>
              <tr><td><code>dimension</code></td><td>string</td><td>—</td><td>当 type=dimension 时必填：<code>absorption_score</code>、<code>fit_score</code>、<code>comfort_score</code>、<code>thickness_score</code>、<code>appearance_score</code>、<code>value_score</code></td></tr>
              <tr><td><code>limit</code></td><td>int</td><td>20</td><td>返回数量，1-50</td></tr>
            </tbody>
          </table>

          <h4 style={{ fontSize: '0.85rem', fontWeight: 600, margin: '1rem 0 0.5rem' }}>响应示例</h4>
          <pre>{`{
  "rankings": [
    {
      "id": 1,
      "brand": "品牌名",
      "model": "型号",
      "avg_score": 8.5,
      "rating_count": 42,
      "thickness": "中厚",
      "absorbency_adult": "1200ml"
    }
  ],
  "type": "hot"
}`}</pre>
        </section>

        {/* 纸尿裤列表 */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            <span style={{ background: 'var(--success)', color: '#fff', padding: '0.15rem 0.5rem', borderRadius: 4, fontSize: '0.7rem', fontWeight: 700, marginRight: '0.5rem' }}>GET</span>
            /diapers
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>获取纸尿裤列表，支持搜索和品牌筛选</p>
          <p style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>所需权限：<code>read_diapers</code></p>

          <h4 style={{ fontSize: '0.85rem', fontWeight: 600, margin: '1rem 0 0.5rem' }}>查询参数</h4>
          <table className="doc-table">
            <thead><tr><th>参数</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
            <tbody>
              <tr><td><code>page</code></td><td>int</td><td>1</td><td>页码</td></tr>
              <tr><td><code>limit</code></td><td>int</td><td>20</td><td>每页数量，1-100</td></tr>
              <tr><td><code>search</code></td><td>string</td><td>—</td><td>搜索品牌或型号</td></tr>
              <tr><td><code>brand</code></td><td>string</td><td>—</td><td>按品牌精确筛选</td></tr>
            </tbody>
          </table>

          <h4 style={{ fontSize: '0.85rem', fontWeight: 600, margin: '1rem 0 0.5rem' }}>响应示例</h4>
          <pre>{`{
  "diapers": [
    {
      "id": 1,
      "brand": "品牌名",
      "model": "型号",
      "thickness": "中厚",
      "absorbency_adult": "1200ml",
      "image_url": null
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 85,
    "totalPages": 5
  }
}`}</pre>
        </section>

        {/* 调用示例 */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>调用示例</h2>
          <pre>{`// JavaScript / Fetch
const API_KEY = 'ak_your_api_key';
const BASE = 'https://api.abdl-space.top/api/v1/content';

// 获取最新帖子
const posts = await fetch(BASE + '/posts?limit=10', {
  headers: { 'Authorization': 'Bearer ' + API_KEY }
}).then(r => r.json());

// 获取热门排行榜
const rankings = await fetch(BASE + '/rankings?type=hot&limit=20', {
  headers: { 'Authorization': 'Bearer ' + API_KEY }
}).then(r => r.json());

// 搜索纸尿裤
const diapers = await fetch(BASE + '/diapers?search=品牌名', {
  headers: { 'Authorization': 'Bearer ' + API_KEY }
}).then(r => r.json());`}</pre>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Python 示例</h2>
          <pre>{`import requests

API_KEY = "ak_your_api_key"
BASE = "https://api.abdl-space.top/api/v1/content"
HEADERS = {"Authorization": f"Bearer {API_KEY}"}

# 获取帖子
resp = requests.get(f"{BASE}/posts", headers=HEADERS, params={"limit": 10})
data = resp.json()
for post in data["posts"]:
    print(f"[{post['id']}] {post['user']['username']}: {post['content'][:50]}")`}</pre>
        </section>

        {/* 频率限制 */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>频率限制</h2>
          <div className="card" style={{ fontSize: '0.85rem' }}>
            <p>默认速率限制为 <strong>200 次/分钟</strong>（创建 Key 时可自定义，范围 1-10000）。</p>
            <p style={{ marginTop: '0.5rem' }}>超限返回 <code>429 Too Many Requests</code>，请做好重试和退避逻辑。</p>
            <p style={{ marginTop: '0.5rem' }}>响应 Header 中包含：</p>
            <ul style={{ marginTop: '0.25rem', paddingLeft: '1.5rem' }}>
              <li><code>X-RateLimit-Limit</code> — 你的 Key 的速率上限</li>
              <li><code>X-RateLimit-Remaining</code> — 当前窗口剩余次数</li>
            </ul>
          </div>
        </section>

        {/* 错误码 */}
        <section>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>错误码</h2>
          <table className="doc-table">
            <thead><tr><th>状态码</th><th>说明</th></tr></thead>
            <tbody>
              <tr><td><code>400</code></td><td>参数错误（无效的 type、dimension 等）</td></tr>
              <tr><td><code>401</code></td><td>缺少或无效的 API Key</td></tr>
              <tr><td><code>403</code></td><td>Key 权限不足（如缺少 read_posts）</td></tr>
              <tr><td><code>404</code></td><td>资源不存在（如帖子 ID 无效）</td></tr>
              <tr><td><code>429</code></td><td>请求频率超限</td></tr>
              <tr><td><code>500</code></td><td>服务器内部错误</td></tr>
            </tbody>
          </table>
        </section>
      </div>
    </>
  );
}
