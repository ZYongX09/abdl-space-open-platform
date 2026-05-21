# ABDL-Space 开放平台

ABDL-Space 第三方开发者平台，管理验证码 API Key、OAuth 应用，查阅开发文档。

## 功能

- **仪表盘** — 总览入口
- **验证码 API Key** — 创建和管理 Captcha API Key
- **OAuth 应用** — 注册和管理 OAuth 2.0 应用
- **API 文档** — 验证码 API + OAuth 2.0 接入文档

## 技术栈

- Vite + React + React Router
- 无独立后端，通过 OAuth PKCE 使用 ABDL-Space API

## 登录机制

作为 ABDL-Space 的 OAuth 客户端，使用 **Authorization Code + PKCE** 流程：

1. 用户访问开放平台 → 跳转 ABDL-Space `/oauth/authorize`
2. 用户确认授权 → 回调 `/callback` 携带 code
3. 前端用 code + code_verifier 换取 access_token
4. 使用 access_token 调用 ABDL-Space API

## 环境变量

```bash
VITE_API_BASE=https://api.abdl-space.top
VITE_MAIN_SITE=https://abdl-space.top
VITE_OAUTH_CLIENT_ID=oc_open_platform   # 需先在 ABDL-Space 创建
```

## 部署前准备

1. 在 ABDL-Space 主站 `/oauth-clients` 创建 OAuth 应用
2. 设置 redirect_uri 为开放平台域名 + `/callback`
3. 将 client_id 填入 `VITE_OAUTH_CLIENT_ID`
4. 部署到 Vercel / Cloudflare Pages

## 开发

```bash
npm install
npm run dev     # localhost:5174
```

## 页面路由

| 路径 | 说明 |
|------|------|
| `/` | 仪表盘 |
| `/captcha-keys` | 验证码 Key 管理 |
| `/oauth-clients` | OAuth 应用管理 |
| `/docs/captcha` | 验证码 API 文档 |
| `/docs/oauth` | OAuth 2.0 文档 |
| `/callback` | OAuth 回调 |
| `/login` | 登录页 |

## 安全

- OAuth PKCE (S256) 登录，无 Client Secret 暴露
- Token 自动刷新（access_token 1h，refresh_token 30d）
- API 限速：所有端点均有 IP 级频率限制
- CORS：外部 API 允许所有来源，内部 API 仅允许 `*.abdl-space.top`
