/**
 * 开放平台 API 客户端
 * 封装 captcha key 管理、OAuth client 管理等接口
 */
import { apiFetch } from './auth';

/* ============================================================
 * Captcha API Key 管理
 * ============================================================ */
export const captchaKeysAPI = {
  list: () => apiFetch('/api/captcha/keys'),
  create: (data) => apiFetch('/api/captcha/keys', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/api/captcha/keys/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/api/captcha/keys/${id}`, { method: 'DELETE' }),
};

/* ============================================================
 * OAuth Client 管理
 * ============================================================ */
export const oauthClientsAPI = {
  list: () => apiFetch('/api/oauth/clients'),
  get: (clientId) => apiFetch(`/api/oauth/clients/${clientId}`),
  create: (data) => apiFetch('/api/oauth/clients', { method: 'POST', body: JSON.stringify(data) }),
  update: (clientId, data) => apiFetch(`/api/oauth/clients/${clientId}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (clientId) => apiFetch(`/api/oauth/clients/${clientId}`, { method: 'DELETE' }),
};

/* ============================================================
 * OAuth 公开信息
 * ============================================================ */
export const oauthAPI = {
  scopes: () => apiFetch('/api/oauth/scopes'),
  status: () => apiFetch('/api/health'),
};

/* ============================================================
 * Captcha 公开信息
 * ============================================================ */
export const captchaAPI = {
  status: () => apiFetch('/api/captcha/status'),
  types: () => apiFetch('/api/v1/captcha/types'),
};

/* ============================================================
 * Content API Key 管理
 * ============================================================ */
export const contentKeysAPI = {
  list: () => apiFetch('/api/content/keys'),
  create: (data) => apiFetch('/api/content/keys', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/api/content/keys/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/api/content/keys/${id}`, { method: 'DELETE' }),
};
