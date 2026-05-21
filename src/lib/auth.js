/**
 * OAuth 2.0 PKCE 认证模块
 *
 * 开放平台作为 ABDL-Space 的 OAuth 客户端
 * 使用 Authorization Code + PKCE 流程（公开客户端，无 secret）
 */

const MAIN_SITE = import.meta.env.VITE_MAIN_SITE || 'https://abdl-space.top';
const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.abdl-space.top';
const CLIENT_ID = import.meta.env.VITE_OAUTH_CLIENT_ID || 'oc_open_platform';

const TOKEN_KEY = 'osp_access_token';
const REFRESH_KEY = 'osp_refresh_token';
const CODE_VERIFIER_KEY = 'osp_code_verifier';

/* ---- PKCE 工具 ---- */

function generateRandomString(len = 43) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => chars[b % chars.length]).join('');
}

async function sha256(plain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return String.fromCharCode(...new Uint8Array(hash));
}

function base64urlencode(str) {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function generateCodeChallenge(verifier) {
  const hashed = await sha256(verifier);
  return base64urlencode(hashed);
}

/* ---- Token 存储 ---- */

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}

export function setTokens(accessToken, refreshToken) {
  localStorage.setItem(TOKEN_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(CODE_VERIFIER_KEY);
}

export function isAuthenticated() {
  return !!getAccessToken();
}

/* ---- 登录流程 ---- */

/**
 * 发起 OAuth 登录（跳转到 ABDL-Space 授权页）
 * @param {string} currentPath - 授权后回调路径
 */
export async function login(currentPath = '/') {
  const verifier = generateRandomString(43);
  const challenge = await generateCodeChallenge(verifier);
  localStorage.setItem(CODE_VERIFIER_KEY, verifier);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: `${window.location.origin}/callback`,
    response_type: 'code',
    scope: 'profile email',
    state: currentPath,
    code_challenge: challenge,
    code_challenge_method: 'S256',
  });

  window.location.href = `${MAIN_SITE}/oauth/authorize?${params}`;
}

/**
 * 处理 OAuth 回调（用 code 换 token）
 * @param {string} code - 授权码
 * @returns {boolean} 是否成功
 */
export async function handleCallback(code) {
  const verifier = localStorage.getItem(CODE_VERIFIER_KEY);
  if (!verifier) throw new Error('Missing code_verifier');

  const res = await fetch(`${API_BASE}/api/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: `${window.location.origin}/callback`,
      client_id: CLIENT_ID,
      code_verifier: verifier,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Token exchange failed');
  }

  const data = await res.json();
  setTokens(data.access_token, data.refresh_token);
  localStorage.removeItem(CODE_VERIFIER_KEY);
  return true;
}

/**
 * 刷新 access_token
 */
export async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token');

  const res = await fetch(`${API_BASE}/api/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: CLIENT_ID,
    }),
  });

  if (!res.ok) {
    clearTokens();
    throw new Error('Refresh failed');
  }

  const data = await res.json();
  setTokens(data.access_token, data.refresh_token);
  return data.access_token;
}

/**
 * 登出
 */
export function logout() {
  const token = getAccessToken();
  clearTokens();
  // 尝试吊销 token
  if (token) {
    fetch(`${API_BASE}/api/oauth/revoke`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    }).catch(() => {});
  }
}

/**
 * 获取当前用户信息
 */
export async function getUserInfo() {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE}/api/oauth/userinfo`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) {
      // 尝试刷新
      try {
        await refreshAccessToken();
        return getUserInfo();
      } catch {
        clearTokens();
        return null;
      }
    }
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

/**
 * 检测 ABDL-Space 主站登录状态
 * 通过检查主站 localStorage 中是否有 token
 * 注意: 跨域限制，只能在同源时检测
 */
export function detectMainSiteLogin() {
  // 如果当前域名是 abdl-space.top 的子域，可以尝试读取
  try {
    const token = localStorage.getItem('token');  // 主站的 key
    return !!token;
  } catch {
    return false;
  }
}

/**
 * 带认证的 API 请求
 */
export async function apiFetch(path, options = {}) {
  let token = getAccessToken();
  if (!token) throw new Error('Not authenticated');

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 401) {
    try {
      token = await refreshAccessToken();
      headers.Authorization = `Bearer ${token}`;
      const retry = await fetch(`${API_BASE}${path}`, { ...options, headers });
      if (!retry.ok) {
        const err = await retry.json().catch(() => ({}));
        throw new Error(err.error || `Request failed (${retry.status})`);
      }
      return retry.json();
    } catch {
      clearTokens();
      throw new Error('Session expired');
    }
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Request failed (${res.status})`);
  }

  return res.json();
}
